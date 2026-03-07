// src/lib/ai.js
// Coach financiero usando Featherless.ai (compatible con OpenAI)

const FEATHERLESS_URL = 'https://api.featherless.ai/v1/chat/completions'
const MODEL = 'deepseek-ai/DeepSeek-V3.2' // excelente en español

export async function askCoach({ question, summary, userName }) {
  const systemPrompt = `Eres la coach financiera de Parva, una app para mujeres emprendedoras en Colombia y LATAM.
Tu nombre es "Parcera" y hablas de forma cálida, cercana y motivadora.
Usas lenguaje simple — nunca tecnicismos bancarios.
Siempre terminas con un emoji motivador.
Máximo 3 oraciones en tu respuesta.`

  const userPrompt = `Hola soy ${userName}.
Mis datos de esta semana:
- Total vendido: $${summary.total?.toLocaleString('es-CO') || 0}
- Dinero limpio recibido: $${summary.net?.toLocaleString('es-CO') || 0}
- Aportado a mi seguro de salud: $${summary.insurance?.toLocaleString('es-CO') || 0}
- Ventas del negocio: $${summary.negocio?.toLocaleString('es-CO') || 0}
- Número de ventas: ${summary.count || 0}

Mi pregunta: ${question}`

  const res = await fetch(FEATHERLESS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_FEATHERLESS_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 200,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!res.ok) throw new Error('Error al conectar con el coach')
  const data = await res.json()
  return data.choices[0].message.content
}

// ─── ElevenLabs: convierte respuesta en voz ───
export async function speakResponse(text) {
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY

  if (!apiKey) return null // si no hay key, silencio

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  })

  if (!res.ok) return null
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
