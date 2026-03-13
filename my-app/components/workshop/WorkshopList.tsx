'use client'
import { useState } from 'react'
import SavedPlanCard from './SavedPlanCard'
import PlanDetailModal from './PlanDetailModal'
import { createClient } from '@/lib/supabase/client'
import type { LessonPlan } from '@/types'

interface Props {
  initialPlans: LessonPlan[]
}

export default function WorkshopList({ initialPlans }: Props) {
  const [plans, setPlans] = useState<LessonPlan[]>(initialPlans)
  const [modalPlan, setModalPlan] = useState<LessonPlan | null>(null)
  const supabase = createClient()

  const updatePlan = async (
    id: string,
    data: Omit<LessonPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    const { error } = await supabase.from('lesson_plans').update(data).eq('id', id)
    if (!error) {
      setPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
      setModalPlan(null)
    }
    return { error: error?.message }
  }

  const deletePlan = async (id: string) => {
    await supabase.from('lesson_plans').delete().eq('id', id)
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-4">📋</p>
        <p className="text-lg mb-2">저장된 계획서가 없습니다</p>
        <p className="text-sm mb-4">메인 화면에서 성취기준을 선택하고 계획서를 작성해보세요.</p>
        <a href="/" className="text-blue-600 hover:underline text-sm">성취기준 탐색하기 →</a>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map(plan => (
          <SavedPlanCard
            key={plan.id}
            plan={plan}
            onView={p => setModalPlan(p)}
            onEdit={p => setModalPlan(p)}
            onDelete={deletePlan}
          />
        ))}
      </div>

      {modalPlan && (
        <PlanDetailModal
          plan={modalPlan}
          onClose={() => setModalPlan(null)}
          onUpdate={updatePlan}
        />
      )}
    </>
  )
}
