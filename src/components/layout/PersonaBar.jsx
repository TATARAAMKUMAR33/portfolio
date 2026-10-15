import { usePersona } from '../../context/PersonaContext'

export default function PersonaBar() {
  const { personaId, setPersonaId, PERSONAS } = usePersona()

  return (
    <div
      className="persona-bar w-full py-2 px-4 flex gap-2 justify-center flex-wrap"
      style={{ background: 'var(--color-primary)', borderBottom: '2px solid var(--color-accent)' }}
    >
      <span className="text-xs text-gray-400 self-center mr-2 hidden sm:inline">View as:</span>
      {PERSONAS.map(p => (
        <button
          key={p.id}
          onClick={() => setPersonaId(p.id)}
          className="text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200"
          style={{
            background:  personaId === p.id ? 'var(--color-accent)' : 'transparent',
            color:       personaId === p.id ? 'var(--color-primary)' : '#aaa',
            border:      personaId === p.id ? 'none' : '1px solid #444',
          }}
        >
          {p.icon} {p.shortLabel}
        </button>
      ))}
    </div>
  )
}
