'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import SelectedCriteriaList from './SelectedCriteriaList'
import LessonForm from './LessonForm'
import SavedPlanCard from './SavedPlanCard'
import PlanDetailModal from './PlanDetailModal'
import type { Criteria, LessonPlan } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  selectedCriteria: Criteria[]
  onToggleCriteria: (c: Criteria) => void
  savedPlans: LessonPlan[]
  onFetchPlans: () => Promise<void>
  onSavePlan: (plan: Omit<LessonPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error?: string }>
  onUpdatePlan: (id: string, plan: Omit<LessonPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error?: string }>
  onDeletePlan: (id: string) => Promise<void>
}

type Tab = 'write' | 'saved'

export default function WorkshopPanel({
  isOpen, onClose,
  selectedCriteria, onToggleCriteria,
  savedPlans, onFetchPlans, onSavePlan, onUpdatePlan, onDeletePlan,
}: Props) {
  const [tab, setTab] = useState<Tab>('write')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [modalPlan, setModalPlan] = useState<{ plan: LessonPlan; mode: 'view' | 'edit' } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
  }, [supabase, isOpen])

  useEffect(() => {
    if (isOpen && tab === 'saved' && isLoggedIn) {
      onFetchPlans()
    }
  }, [isOpen, tab, isLoggedIn])

  const handleNavigate = (code: string) => {
    onClose()
    setTimeout(() => {
      const el = document.getElementById(`criteria-${code}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('ring-2', 'ring-blue-400', 'ring-offset-2')
        setTimeout(() => el.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-2'), 1500)
      }
    }, 100)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[85vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">수업 재구성 워크숍</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="flex border-b border-gray-100 px-5">
          {(['write', 'saved'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2.5 px-1 mr-4 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'write' ? '계획서 작성' : '저장된 목록'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === 'write' && (
            <div className="space-y-5">
              {selectedCriteria.length > 0 ? (
                <>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      선택된 성취기준 ({selectedCriteria.length}개)
                      <span className="ml-1 font-normal text-gray-400">— 클릭하면 본문으로 이동</span>
                    </p>
                    <SelectedCriteriaList
                      criteria={selectedCriteria}
                      onRemove={onToggleCriteria}
                      onNavigate={handleNavigate}
                    />
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    {isLoggedIn ? (
                      <LessonForm
                        selectedCriteria={selectedCriteria}
                        onSave={onSavePlan}
                        onClose={onClose}
                      />
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600 mb-3">계획서를 저장하려면 로그인이 필요합니다.</p>
                        <a href="/auth/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          로그인하기
                        </a>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="text-sm">성취기준 카드에서 <strong className="text-blue-600">+ 선택</strong> 버튼을 눌러<br/>재구성할 성취기준을 추가하세요.</p>
                </div>
              )}
            </div>
          )}

          {tab === 'saved' && (
            <div>
              {!isLoggedIn ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-sm mb-3">저장된 계획서를 보려면 로그인이 필요합니다.</p>
                  <a href="/auth/login" className="text-blue-600 text-sm hover:underline">로그인하기</a>
                </div>
              ) : savedPlans.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-sm">저장된 계획서가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPlans.map(plan => (
                    <SavedPlanCard
                      key={plan.id}
                      plan={plan}
                      onView={p => setModalPlan({ plan: p, mode: 'view' })}
                      onEdit={p => setModalPlan({ plan: p, mode: 'edit' })}
                      onDelete={onDeletePlan}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {modalPlan && (
        <PlanDetailModal
          plan={modalPlan.plan}
          onClose={() => setModalPlan(null)}
          onUpdate={async (id, data) => {
            const result = await onUpdatePlan(id, data)
            if (!result.error) setModalPlan(null)
            return result
          }}
        />
      )}
    </>
  )
}
