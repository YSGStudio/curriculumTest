'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LessonPlan, Criteria } from '@/types'

export function useWorkshop() {
  const supabase = createClient()
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria[]>([])
  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>([])
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const fetchPlans = async () => {
    const { data } = await supabase
      .from('lesson_plans')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setSavedPlans(data)
  }

  const savePlan = async (
    plan: Omit<LessonPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: '로그인이 필요합니다.' }

    const { error } = await supabase.from('lesson_plans').insert({
      ...plan,
      user_id: user.id,
    })
    if (!error) await fetchPlans()
    return { error: error?.message }
  }

  const deletePlan = async (id: string) => {
    await supabase.from('lesson_plans').delete().eq('id', id)
    setSavedPlans(prev => prev.filter(p => p.id !== id))
  }

  const toggleCriteria = (c: Criteria) => {
    setSelectedCriteria(prev =>
      prev.find(x => x.code === c.code)
        ? prev.filter(x => x.code !== c.code)
        : [...prev, c]
    )
  }

  return {
    selectedCriteria,
    toggleCriteria,
    savedPlans,
    fetchPlans,
    savePlan,
    deletePlan,
    isPanelOpen,
    setIsPanelOpen,
  }
}
