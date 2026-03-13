'use client'
import { useState } from 'react'
import type { LessonPlan } from '@/types'

interface Props {
  plan: LessonPlan
  onClose: () => void
  onUpdate: (id: string, plan: Omit<LessonPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error?: string }>
}

type Mode = 'view' | 'edit'

const FIELDS: { label: string; key: keyof Omit<LessonPlan, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'title' | 'criteria_codes'>; rows: number }[] = [
  { label: '탐구질문', key: 'inquiry_question', rows: 2 },
  { label: '도달목표', key: 'goal', rows: 3 },
  { label: '수행과제', key: 'performance_task', rows: 3 },
  { label: '채점기준', key: 'rubric', rows: 4 },
  { label: '핵심 활동', key: 'key_activities', rows: 3 },
  { label: '차시 계획', key: 'schedule', rows: 4 },
  { label: '평가 방법', key: 'assessment', rows: 2 },
  { label: '메모', key: 'memo', rows: 2 },
]

export default function PlanDetailModal({ plan, onClose, onUpdate }: Props) {
  const [mode, setMode] = useState<Mode>('view')
  const [form, setForm] = useState({
    title: plan.title,
    criteria_codes: plan.criteria_codes,
    inquiry_question: plan.inquiry_question,
    goal: plan.goal,
    performance_task: plan.performance_task,
    rubric: plan.rubric,
    key_activities: plan.key_activities,
    schedule: plan.schedule,
    assessment: plan.assessment,
    memo: plan.memo,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    if (!form.title.trim()) { setError('제목을 입력하세요.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await onUpdate(plan.id, form)
    setLoading(false)
    if (err) { setError(err); return }
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setMode('view') }, 1000)
  }

  return (
    <>
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* 모달 */}
      <div className="fixed inset-x-4 top-8 bottom-8 z-[70] bg-white rounded-2xl shadow-2xl flex flex-col max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-800 text-base truncate max-w-[200px]">
              {mode === 'edit' ? '계획서 수정' : plan.title}
            </h2>
            {mode === 'view' && (
              <button
                onClick={() => setMode('edit')}
                className="text-xs text-blue-600 hover:underline"
              >
                수정
              </button>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl shrink-0">✕</button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* 성취기준 코드 */}
          <div className="flex flex-wrap gap-1 mb-5">
            {plan.criteria_codes.map(code => (
              <span key={code} className="font-mono text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                [{code}]
              </span>
            ))}
          </div>

          {mode === 'view' ? (
            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <p className="text-xs font-medium text-gray-400 mb-1">제목</p>
                <p className="text-sm text-gray-800 font-medium">{plan.title}</p>
              </div>
              {FIELDS.map(({ label, key }) => (
                plan[key] ? (
                  <div key={key}>
                    <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{plan[key] as string}</p>
                  </div>
                ) : null
              ))}
              <p className="text-xs text-gray-300 pt-2 border-t border-gray-100">
                작성일: {new Date(plan.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {FIELDS.map(({ label, key, rows }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <textarea
                    rows={rows}
                    value={form[key] as string}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              ))}
              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-600">저장되었습니다!</p>}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        {mode === 'edit' && (
          <div className="flex gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
            <button
              onClick={() => { setMode('view'); setError('') }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          </div>
        )}
      </div>
    </>
  )
}
