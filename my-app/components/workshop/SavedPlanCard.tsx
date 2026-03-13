import type { LessonPlan } from '@/types'

interface Props {
  plan: LessonPlan
  onDelete: (id: string) => void
}

export default function SavedPlanCard({ plan, onDelete }: Props) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm mb-1 truncate">{plan.title}</h4>
          <div className="flex flex-wrap gap-1 mb-2">
            {plan.criteria_codes.map(code => (
              <span key={code} className="font-mono text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                [{code}]
              </span>
            ))}
          </div>
          {plan.integrated_standard && (
            <p className="text-xs text-gray-500 line-clamp-2">{plan.integrated_standard}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {new Date(plan.created_at).toLocaleDateString('ko-KR')}
          </p>
        </div>
        <button
          onClick={() => onDelete(plan.id)}
          className="text-gray-300 hover:text-red-500 transition-colors shrink-0 text-xs"
          title="삭제"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
