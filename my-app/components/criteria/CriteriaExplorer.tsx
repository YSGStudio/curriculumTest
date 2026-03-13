'use client'
import { useSearch } from '@/hooks/useSearch'
import { useFilter } from '@/hooks/useFilter'
import { useAccordion } from '@/hooks/useAccordion'
import { useWorkshop } from '@/hooks/useWorkshop'
import SearchBar from './SearchBar'
import SubjectSection from './SubjectSection'
import SubjectChips from '@/components/layout/SubjectChips'
import WorkshopPanel from '@/components/workshop/WorkshopPanel'
import type { Subject } from '@/types'

interface Props {
  subjects: Subject[]
}

export default function CriteriaExplorer({ subjects }: Props) {
  const { query, setQuery, filtered: searchFiltered } = useSearch(subjects)
  const { activeSubject, toggle: toggleFilter, applyFilter } = useFilter()
  const { isOpen, toggle: toggleAccordion, expandAll, collapseAll } = useAccordion()
  const workshop = useWorkshop()

  const displayed = applyFilter(searchFiltered)
  const allKeys = displayed.map(s => s.name)

  return (
    <div className="relative">
      {/* 필터 & 검색 */}
      <div className="mb-6 space-y-3">
        <SubjectChips
          subjects={subjects.map(s => s.name)}
          active={activeSubject}
          onToggle={toggleFilter}
        />
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {displayed.length}개 교과 · 총{' '}
          {displayed.reduce((s, sub) => s + sub.domains.reduce((ds, d) => ds + d.criteria.length, 0), 0)}개 성취기준
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => expandAll(allKeys)}
            className="text-xs text-blue-600 hover:underline"
          >
            모두 펼치기
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={collapseAll}
            className="text-xs text-gray-500 hover:underline"
          >
            모두 접기
          </button>
        </div>
      </div>

      {/* 성취기준 목록 */}
      <div className="space-y-3">
        {displayed.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-1">검색 결과가 없습니다</p>
            <p className="text-sm">다른 검색어를 입력해보세요</p>
          </div>
        ) : (
          displayed.map(subject => (
            <SubjectSection
              key={subject.name}
              subject={subject}
              isOpen={isOpen(subject.name)}
              onToggle={() => toggleAccordion(subject.name)}
              selectedCriteria={workshop.selectedCriteria}
              onToggleSelect={workshop.toggleCriteria}
            />
          ))
        )}
      </div>

      {/* 선택된 성취기준 플로팅 배지 */}
      {workshop.selectedCriteria.length > 0 && (
        <button
          onClick={() => workshop.setIsPanelOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full px-5 py-3 shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 z-30"
        >
          <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {workshop.selectedCriteria.length}
          </span>
          수업 재구성 작성
        </button>
      )}

      {/* 수업 재구성 패널 */}
      <WorkshopPanel
        isOpen={workshop.isPanelOpen}
        onClose={() => workshop.setIsPanelOpen(false)}
        selectedCriteria={workshop.selectedCriteria}
        onToggleCriteria={workshop.toggleCriteria}
        savedPlans={workshop.savedPlans}
        onFetchPlans={workshop.fetchPlans}
        onSavePlan={workshop.savePlan}
        onUpdatePlan={workshop.updatePlan}
        onDeletePlan={workshop.deletePlan}
      />
    </div>
  )
}
