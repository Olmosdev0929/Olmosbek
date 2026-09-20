import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI:", err);
    }
  }
  return aiClient;
}

// 1. AI SPEAKING PARTNER ENDPOINT
app.post("/api/ai/speaking", async (req, res) => {
  try {
    const { topic, part, transcript, history } = req.body;

    const ai = getAI();
    if (ai) {
      const prompt = `You are an expert, encouraging British Council / IDP IELTS Speaking examiner and conversational English coach.
Topic: "${topic}" (${part}).
Conversation history: ${JSON.stringify(history || [])}
The student just said: "${transcript}".

Evaluate the student's speaking response and formulate your response in JSON format matching this schema:
{
  "reply": "Your next conversational question or continuation as the examiner (in natural English, 2-3 sentences max)",
  "pronunciationScore": <number between 50 and 98 based on word clarity and complexity>,
  "grammarScore": <number between 50 and 98>,
  "fluencyScore": <number between 50 and 98>,
  "corrections": ["Specific correction 1 with explanation", "Specific correction 2 (if any)"],
  "betterPhrasing": "A more natural, high-band (IELTS 8.0+) phrasing of what the student meant"
}
Output only valid JSON, without markdown formatting or code blocks.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, data: parsed });
    }

    // Fallback heuristic evaluation if no API key is provided
    const words = (transcript || "").trim().split(/\s+/);
    const wordCount = words.length;
    const baseScore = Math.min(92, Math.max(65, 60 + Math.floor(wordCount * 1.5)));

    return res.json({
      success: true,
      data: {
        reply: `That is an insightful perspective on ${topic}! Could you elaborate a bit more on why you feel that way, and how it has influenced your daily life?`,
        pronunciationScore: baseScore,
        grammarScore: baseScore - 4,
        fluencyScore: baseScore + 2,
        corrections: [
          transcript.toLowerCase().includes("i think")
            ? 'Consider replacing "I think" with higher-level expressions like "From my perspective" or "I am strongly convinced that".'
            : 'Good grammatical cohesion. Ensure subject-verb agreement is maintained in complex sentences.',
        ],
        betterPhrasing: `Speaking frankly, ${transcript.replace(/^(i think|i feel)/i, 'it appears to me that')}, which plays a paramount role in modern society.`,
      },
    });
  } catch (error: any) {
    console.error("AI Speaking Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze speaking response",
    });
  }
});

// 2. AI ESSAY / WRITING CHECKER ENDPOINT
app.post("/api/ai/essay", async (req, res) => {
  try {
    const { essayText, topic, essayType } = req.body;
    const wordCount = (essayText || "").trim().split(/\s+/).filter(Boolean).length;

    const ai = getAI();
    if (ai) {
      const prompt = `You are a certified senior IELTS Writing examiner (British Council / Cambridge English).
Analyze this English essay thoroughly based on official IELTS writing assessment criteria:
1. Task Achievement / Task Response
2. Coherence and Cohesion
3. Lexical Resource (Vocabulary)
4. Grammatical Range and Accuracy

Essay Topic/Prompt: "${topic || 'General Academic Essay'}"
Essay Type: "${essayType || 'IELTS Task 2'}"
Essay Text:
"""
${essayText}
"""

Provide your assessment strictly in the following JSON schema:
{
  "overallBand": <number between 4.5 and 9.0, e.g. 6.5>,
  "wordCount": ${wordCount},
  "taskAchievement": {
    "score": <number 4.0-9.0>,
    "comment": "<Detailed analysis of how well the prompt was addressed>"
  },
  "coherenceCohesion": {
    "score": <number 4.0-9.0>,
    "comment": "<Analysis of paragraphing, linkers, topic sentences, and logical progression>"
  },
  "lexicalResource": {
    "score": <number 4.0-9.0>,
    "comment": "<Analysis of vocabulary range, collocations, and register>",
    "vocabularyBoost": [
      { "original": "<simple word or phrase used>", "better": "<advanced C1/C2 colocation>", "reason": "<why it enhances the essay>" }
    ]
  },
  "grammaticalAccuracy": {
    "score": <number 4.0-9.0>,
    "comment": "<Analysis of complex sentences, punctuation, and tense consistency>",
    "grammarMistakes": [
      { "mistake": "<exact text from essay>", "correction": "<correct form>", "explanation": "<clear grammar rule explanation>" }
    ]
  },
  "improvedVersion": "<A rewritten, model Band 8.5-9.0 version of the essay maintaining the author's original core ideas>",
  "examinerSummary": "<Encouraging conclusion with top 3 concrete action steps to reach Band 7.5+ in Uzbek and English>"
}
Output only valid JSON, without markdown formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, data: parsed });
    }

    // Heuristic Fallback
    const band = wordCount >= 250 ? 6.5 : wordCount >= 180 ? 6.0 : 5.5;
    return res.json({
      success: true,
      data: {
        overallBand: band,
        wordCount,
        taskAchievement: {
          score: band,
          comment: `The essay addresses the prompt with relevant main ideas. ${wordCount < 250 ? 'Warning: Task 2 requires at least 250 words to avoid underlength penalty.' : 'Good length and structure.'}`,
        },
        coherenceCohesion: {
          score: band,
          comment: "Paragraphs have clear central themes. Linking devices are present (Furthermore, In conclusion).",
        },
        lexicalResource: {
          score: band,
          comment: "Vocabulary is adequate for everyday topics with some attempts at academic collocations.",
          vocabularyBoost: [
            { original: "a lot of", better: "a substantial number of / an abundance of", reason: "More formal academic register" },
            { original: "important", better: "pivotal / quintessential", reason: "Demonstrates advanced lexical range" },
            { original: "big problem", better: "pressing issue / major impediment", reason: "Collocation used by native IELTS 8.0+ candidates" },
          ],
        },
        grammaticalAccuracy: {
          score: band,
          comment: "A mix of simple and compound structures. Pay close attention to prepositions and singular/plural articles.",
          grammarMistakes: [
            {
              mistake: "Every people have",
              correction: "Everyone has / Every person has",
              explanation: "'Every' is followed by a singular noun and singular verb.",
            },
          ],
        },
        improvedVersion: `${essayText}\n\n[Examiner Note: To achieve Band 8.0, introduce conditional clauses (If... then) and passive voice constructions for objective argumentation.]`,
        examinerSummary: "Yaxshi natija! Inshoni 7.5+ ballga ko'tarish uchun kamida 250 ta so'z yozing, akademik kirish so'zlaridan ko'proq foydalaning va har bir fikrni aniq misollar bilan quvvatlang.",
      },
    });
  } catch (error: any) {
    console.error("AI Essay Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze essay",
    });
  }
});

// 3. SMART READER WORD EXPLAINER
app.post("/api/ai/reader-explain", async (req, res) => {
  try {
    const { wordOrPhrase, contextSentence } = req.body;
    const ai = getAI();

    if (ai) {
      const prompt = `Explain this English word/phrase for an English language learner from Uzbekistan:
Word: "${wordOrPhrase}"
Context: "${contextSentence || ''}"

Return JSON:
{
  "word": "${wordOrPhrase}",
  "phonetic": "<IPA phonetic transcription, e.g. /pəˈvɪtəl/>",
  "partOfSpeech": "<verb/noun/adjective/idiom>",
  "uzbekTranslation": "<Natural, precise Uzbek translation>",
  "definition": "<Clear English definition>",
  "example": "<Natural example sentence in English>",
  "exampleUz": "<Uzbek translation of the example sentence>",
  "level": "<A1/A2/B1/B2/C1/C2>"
}
Output only valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed });
    }

    return res.json({
      success: true,
      data: {
        word: wordOrPhrase,
        phonetic: `/${wordOrPhrase.toLowerCase()}/`,
        partOfSpeech: "noun/verb",
        uzbekTranslation: "So'z ma'nosi kontekstda",
        definition: `A contextual term referring to ${wordOrPhrase}.`,
        example: `The concept of ${wordOrPhrase} is frequently observed in modern linguistics.`,
        exampleUz: `${wordOrPhrase} tushunchasi zamonaviy tilshunoslikda ko'p kuzatiladi.`,
        level: "B2",
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. PARENT CRM TELEGRAM DISPATCH SIMULATOR
app.post("/api/crm/send-parent-telegram", async (req, res) => {
  try {
    const { studentName, parentPhone, type, message } = req.body;
    // Simulate real bot delivery latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    return res.json({
      success: true,
      log: {
        id: "ntf_" + Date.now(),
        studentName,
        parentPhone,
        type,
        message,
        sentAt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        status: "delivered",
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduEnglish server running on port ${PORT}`);
  });
}

startServer();
