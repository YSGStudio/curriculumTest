'use client'
import { useState } from 'react'
import type { LessonPlan, Criteria } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  selectedCriteria: Criteria[]
  onSave: (plan: Omit<LessonPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error?: string }>
  onClose: () => void
}

export default function LessonForm({ selectedCriteria, onSave, onClose }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    inquiry_question: '',
    goal: '',
    performance_task: '',
    rubric: '',
    key_activities: '',
    schedule: '',
    assessment: '',
    memo: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('제목을 입력하세요.'); return }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { error: err } = await onSave({
      ...form,
      criteria_codes: selectedCriteria.map(c => c.code),
    })

    setLoading(false)
    if (err) { setError(err); return }
    setSuccess(true)
    setTimeout(onClose, 1500)
  }

  const field = (label: string, key: keyof typeof form, placeholder: string, rows = 3) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  )

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-green-600 font-medium">저장되었습니다!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="예: 3학년 통합단원 — 우리 마을 탐구"
          value={form.title}
          onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">수업 설계</p>
        {field('탐구질문', 'inquiry_question', '예: 우리 마을은 어떻게 변화해 왔을까?', 2)}
        {field('도달목표', 'goal', '수업을 마친 후 학생이 할 수 있어야 하는 것...', 3)}
        {field('수행과제', 'performance_task', '학생이 실제로 수행할 과제를 기술...', 3)}
        {field('채점기준', 'rubric', '평가 기준별 수준 기술 (예: 상/중/하 또는 루브릭)...', 4)}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">차시 운영</p>
        {field('핵심 활동', 'key_activities', '주요 학습 활동을 기록...', 3)}
        {field('차시 계획', 'schedule', '예: 1차시 - 도입, 2~4차시 - 탐구...', 4)}
        {field('평가 방법', 'assessment', '관찰, 포트폴리오, 수행평가 등...', 2)}
        {field('메모', 'memo', '기타 참고 사항...', 2)}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '저장 중...' : '저장하기'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}
