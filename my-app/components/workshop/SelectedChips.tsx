import type { Criteria } from '@/types'

interface Props {
  criteria: Criteria[]
  onRemove: (c: Criteria) => void
}

export default function SelectedChips({ criteria, onRemove }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {criteria.map(c => (
        <span
          key={c.code}
          className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200"
        >
          <span className="font-mono">[{c.code}]</span>
          <button
            onClick={() => onRemove(c)}
            className="hover:text-red-500 transition-colors"
            title="제거"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  )
}
