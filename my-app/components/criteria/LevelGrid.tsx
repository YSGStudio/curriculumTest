interface Props {
  levelA: string
  levelB: string
  levelC: string
}

export default function LevelGrid({ levelA, levelB, levelC }: Props) {
  const levels = [
    { label: 'A', desc: '잘함', text: levelA, bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
    { label: 'B', desc: '보통', text: levelB, bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
    { label: 'C', desc: '노력 필요', text: levelC, bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
      {levels.map(({ label, desc, text, bg, border, badge }) => (
        <div key={label} className={`rounded-lg border p-3 ${bg} ${border}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge}`}>
              {label} ({desc})
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{text || '—'}</p>
        </div>
      ))}
    </div>
  )
}
