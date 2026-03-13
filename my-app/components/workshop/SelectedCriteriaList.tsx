import type { Criteria } from '@/types'

interface Props {
  criteria: Criteria[]
  onRemove: (c: Criteria) => void
  onNavigate: (code: string) => void
}

export default function SelectedCriteriaList({ criteria, onRemove, onNavigate }: Props) {
  return (
    <div className="space-y-2">
      {criteria.map(c => (
        <div
          key={c.code}
          className="flex items-start gap-3 p-3 rounded-lg border border-blue-100 bg-blue-50"
        >
          <div className="flex-1 min-w-0">
            <button
              onClick={() => onNavigate(c.code)}
              className="text-left w-full group"
              title="본문에서 해당 성취기준으로 이동"
            >
              <span className="font-mono text-xs text-blue-600 bg-white border border-blue-200 px-1.5 py-0.5 rounded mr-1.5">
                [{c.code}]
              </span>
              <span className="text-sm text-gray-700 leading-relaxed group-hover:text-blue-700 group-hover:underline underline-offset-2 transition-colors">
                {c.text}
              </span>
            </button>
          </div>
          <button
            onClick={() => onRemove(c)}
            className="shrink-0 text-gray-300 hover:text-red-500 transition-colors mt-0.5 text-base leading-none"
            title="선택 해제"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
