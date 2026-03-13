import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SavedPlanCard from '@/components/workshop/SavedPlanCard'
import type { LessonPlan } from '@/types'

export default async function WorkshopPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: plans } = await supabase
    .from('lesson_plans')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">수업 재구성 목록</h1>
        <p className="text-gray-500 text-sm">저장된 수업 재구성 계획서를 확인하세요.</p>
      </div>

      {!plans || plans.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-lg mb-2">저장된 계획서가 없습니다</p>
          <p className="text-sm mb-4">메인 화면에서 성취기준을 선택하고 계획서를 작성해보세요.</p>
          <a href="/" className="text-blue-600 hover:underline text-sm">성취기준 탐색하기 →</a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(plans as LessonPlan[]).map(plan => (
            <div key={plan.id} className="border border-gray-200 rounded-xl p-5 bg-white">
              <h3 className="font-semibold text-gray-800 mb-2">{plan.title}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {plan.criteria_codes?.map(code => (
                  <span key={code} className="font-mono text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                    [{code}]
                  </span>
                ))}
              </div>
              {plan.key_activities && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-400">핵심 활동</span>
                  <p className="text-sm text-gray-600 mt-0.5">{plan.key_activities}</p>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">
                {new Date(plan.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
