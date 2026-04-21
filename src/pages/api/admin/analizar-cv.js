import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { jwtVerify } from 'jose';

async function verifyAuth(req) {
  const cookie = req.headers.cookie || '';
  const match  = cookie.match(/admin_token=([^;]+)/);
  if (!match) return null;
  const rawSecret = process.env.JWT_SECRET || '';
  if (!rawSecret) return null;
  try {
    const { payload } = await jwtVerify(match[1], new TextEncoder().encode(rawSecret));
    return payload.role;
  } catch { return null; }
}

export const config = { api: { bodyParser: false } };

async function extractTextFromPDF(buffer) {
  // Extracción simple de texto plano desde PDF
  const text = buffer.toString('latin1');
  const matches = text.match(/BT[\s\S]*?ET/g) || [];
  const words = [];
  matches.forEach(block => {
    const found = block.match(/\(([^)]+)\)/g) || [];
    found.forEach(w => words.push(w.replace(/[()]/g, '')));
  });
  return words.join(' ').replace(/\s+/g, ' ').trim() || text.replace(/[^\x20-\x7E\n]/g, ' ').trim();
}

async function analyzeCV(textContent, fileName) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1200,
      messages: [
        {
          role: 'system',
          content: `Eres un experto en RRHH. Analiza el CV y responde SOLO con JSON válido, sin markdown.`
        },
        {
          role: 'user',
          content: `Analiza este CV y devuelve JSON con:
{
  "nombre": string,
  "correo": string,
  "telefono": string,
  "nivelEducativo": string,
  "carrera": string,
  "institucion": string,
  "anosExperiencia": number,
  "ultimoPuesto": string,
  "ultimaEmpresa": string,
  "habilidades": string[],
  "idiomas": string[],
  "fortalezas": string[],
  "areasMejora": string[],
  "puntuacion": number,
  "recomendacion": "CONTRATAR" | "2DA ENTREVISTA" | "DESCARTAR",
  "resumenEjecutivo": string
}

CV (archivo: ${fileName}):
${textContent.substring(0, 4000)}`
        }
      ]
    })
  });
  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  return JSON.parse(raw.replace(/```json|\n```|```/g, '').trim());
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const role = await verifyAuth(req);
  if (!role) return res.status(401).json({ error: 'No autorizado' });

  const form = new IncomingForm({ maxFileSize: 50 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error al procesar archivo' });

    try {
      const uploaded = files.file?.[0] || files.file;
      const filePath = uploaded.filepath;
      const fileName = uploaded.originalFilename || 'cv.pdf';
      const buffer = fs.readFileSync(filePath);
      const results = [];

      if (fileName.endsWith('.zip')) {
        const zip = await JSZip.loadAsync(buffer);
        const pdfFiles = Object.keys(zip.files).filter(n => n.endsWith('.pdf') && !zip.files[n].dir);
        const limited = pdfFiles.slice(0, 30);
        for (const pdfName of limited) {
          const pdfBuf = await zip.files[pdfName].async('nodebuffer');
          const text = await extractTextFromPDF(pdfBuf);
          const analysis = await analyzeCV(text, path.basename(pdfName));
          results.push({ archivo: path.basename(pdfName), ...analysis });
        }
      } else {
        const text = await extractTextFromPDF(buffer);
        const analysis = await analyzeCV(text, fileName);
        results.push({ archivo: fileName, ...analysis });
      }

      res.status(200).json({ results });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });
}