import type { LessonPlan } from '@/types'

interface Props {
  plan: LessonPlan
  onView: (plan: LessonPlan) => void
  onEdit: (plan: LessonPlan) => void
  onDelete: (id: string) => void
}

export default function SavedPlanCard({ plan, onView, onEdit, onDelete }: Props) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white hover:border-gray-300 transition-colors">
      <div className="mb-3">
        <h4 className="font-medium text-gray-800 text-sm mb-1.5 truncate">{plan.title}</h4>
        <div className="flex flex-wrap gap-1">
          {plan.criteria_codes.map(code => (
            <span key={code} className="font-mono text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
              [{code}]
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(plan.created_at).toLocaleDateString('ko-KR')}
        </p>
      </div>
      <div className="flex gap-1.5">
        <button
          onClick={() => onView(plan)}
          className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          보기
        </button>
        <button
          onClick={() => onEdit(plan)}
          className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(plan.id)}
          className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
