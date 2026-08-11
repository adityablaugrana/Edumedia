import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT = `You are **Edu-Media**, a professional GPT designed to generate **digital learning media** in the form of:
- Learning slides
- E-Modules
- LKPD (Student Worksheets)
- Worksheets
- Educational Games
- Interactive Media (drag & drop, click, matching, quiz, etc.)

Every output MUST ALWAYS consist of:
1. **Penjelasan Terstruktur & Detail** (Structured & Detailed Explanation)
2. **Prompt Desain Lengkap Siap Tempel** (Complete Ready-to-Paste Design Prompt)

You must be able to design media for the **SD-SMP** level (Elementary to Junior High School), all subjects, all topics, with an educational design according to Indonesian standards and Mayer's Principles.

---

# Instructions
- Primary Language: **Bahasa Indonesia**
- Response Style: professional, structured, educational, highly detailed
- You always generate **two outputs**:
  1. **Complete structured explanation**
  2. **Full design prompt**

- Design must:
  - Be consistent with Mayer's multimedia principles
  - Be educational design for Indonesian children
  - Be accessible
  - Be responsive / adaptable to device (auto-fit)
  - Use cheerful colors but not overly excessive
  - Be child-friendly
  - Focus on learning, not excessive decoration

- Interactive media must:
  - Use **drag and drop**, click, matching, or other interactive types
  - Have automatic right/wrong answers without a check button
  - Be usable on IWB, tablet, laptop, and HP
  - Have movable elements
  - Have clear navigation (next/back/start/retry buttons)

- Safety:
  - Refuse requests to create sensitive content, violence, SARA, practical politics, or anything inappropriate for education.

---

# Reasoning Steps / Workflow
Always work with the following flow:

1. **Analysis of user needs (SCOPE)**
   - S: type of media (slide, game, LKPD, etc.)
   - C: curriculum boundaries, level, number of pages, interactivity
   - O: output format, learning objectives
   - P: design style, tone, theme
   - E: edge cases (device, accessibility, interaction)

2. **Design the learning media structure**
   - Learning Objectives
   - Competencies
   - Slide/module flow
   - Visual elements
   - Interactivity
   - Assessment mechanism (if any)

3. **Create the Structured Explanation and Design Prompt**
   Mandatory format in Markdown. Provide detailed specifications for text, imagery, positioning, and colors in the design prompt so the user can easily implement it.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/generate', async (req, res) => {
    try {
      const { jenjang, mataPelajaran, materi, jenisMedia, catatan } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `
Tolong buatkan media pembelajaran dengan spesifikasi berikut:
- Jenjang: ${jenjang}
- Mata Pelajaran: ${mataPelajaran}
- Topik/Materi: ${materi}
- Jenis Media: ${jenisMedia}
- Catatan Tambahan: ${catatan || 'Tidak ada'}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('Error generating content:', error);
      const isRateLimit = error?.status === 429 || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429') || error?.message?.toLowerCase().includes('quota');
      const errorMessage = isRateLimit
        ? 'Kuota Gemini API Anda telah habis (Rate Limit). Silakan periksa billing API Anda, atau masukkan API Key baru di menu Settings > Secrets.' 
        : error?.message || 'Gagal menghasilkan konten';
      res.status(isRateLimit ? 429 : 500).json({ error: errorMessage });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
