import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WorkshopList from '@/components/workshop/WorkshopList'
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
      <WorkshopList initialPlans={(plans ?? []) as LessonPlan[]} />
    </div>
  )
}
