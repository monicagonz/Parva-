// src/pages/AICoach.jsx
import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Volume2, VolumeX } from 'lucide-react'
import { useStore } from '../store/useStore'
import { askCoach, speakResponse } from '../lib/ai'

const SUGERENCIAS = [
  '¿Cuánto gané esta semana?',
  '¿Cuándo llego a mi meta del seguro?',
  '¿Estoy gastando bien en el hogar?',
  '¿Qué producto debería vender más?',
]

export default function AICoach() {
  const { user, getSummary } = useStore()
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hola ${user?.name?.split(' ')[0] || ''} 👋 Soy Parcera, tu coach financiera. Cuéntame qué quieres saber sobre tu negocio.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (question) => {
    const q = question || input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setLoading(true)

    try {
      const summary = getSummary()
      const response = await askCoach({ question: q, summary, userName: user?.name || 'amiga' })

      setMessages(m => [...m, { role: 'bot', text: response }])

      // Intentar voz con ElevenLabs
      const url = await speakResponse(response)
      if (url) {
        setAudioUrl(url)
        // Reproducir automáticamente
        setTimeout(() => {
          audioRef.current?.play()
          setPlaying(true)
        }, 100)
      }
    } catch (e) {
      setMessages(m => [...m, {
        role: 'bot',
        text: 'Ups, tuve un problemita conectándome. ¿Lo intentamos de nuevo? 🙏',
      }])
    } finally {
      setLoading(false)
    }
  }

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
      {/* Header */}
      <div style={{
        background: 'var(--verde)',
        padding: '52px 20px 20px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--amarillo)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>🌱</div>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'white' }}>
              Parcera
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
              Tu coach financiera · siempre activa
            </p>
          </div>
          {audioUrl && (
            <button onClick={toggleAudio} style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.15)',
              border: 'none', borderRadius: '50%', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer',
            }}>
              {playing ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Mensajes */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '16px 16px 0',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'fadeUp 0.3s ease',
          }}>
            {m.role === 'bot' && (
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--amarillo)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, marginRight: 8, flexShrink: 0, alignSelf: 'flex-end',
              }}>🌱</div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? 'var(--verde)' : 'white',
              color: m.role === 'user' ? 'white' : 'var(--tinta)',
              fontSize: 14, lineHeight: 1.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--amarillo)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
            }}>🌱</div>
            <div style={{
              background: 'white', borderRadius: '18px 18px 18px 4px',
              padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--gris-medio)',
                    animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Sugerencias rápidas */}
      {messages.length <= 2 && (
        <div style={{
          padding: '12px 16px',
          display: 'flex', gap: 8, overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {SUGERENCIAS.map(s => (
            <button key={s} onClick={() => send(s)}
              style={{
                background: 'var(--verde-bg)', color: 'var(--verde)',
                border: '1px solid rgba(29,106,74,0.2)',
                borderRadius: 100, padding: '8px 16px',
                fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer',
              }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '12px 16px 88px',
        background: 'white',
        borderTop: '1px solid #ede9e0',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <input
          className="input-field"
          style={{ flex: 1 }}
          placeholder="Pregúntale a Parcera..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: input.trim() ? 'var(--verde)' : '#e2ddd5',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}>
          <Send size={18} color="white" />
        </button>
      </div>

      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} />}
    </div>
  )
}
