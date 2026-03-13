'use client'
import DomainBlock from './DomainBlock'
import type { Subject, Criteria } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  subject: Subject
  isOpen: boolean
  onToggle: () => void
  selectedCriteria: Criteria[]
  onToggleSelect: (c: Criteria) => void
}

const SUBJECT_COLORS: Record<string, string> = {
  국어: 'bg-red-100 text-red-700 border-red-200',
  수학: 'bg-blue-100 text-blue-700 border-blue-200',
  사회: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  과학: 'bg-green-100 text-green-700 border-green-200',
  도덕: 'bg-purple-100 text-purple-700 border-purple-200',
  음악: 'bg-pink-100 text-pink-700 border-pink-200',
  미술: 'bg-orange-100 text-orange-700 border-orange-200',
  체육: 'bg-teal-100 text-teal-700 border-teal-200',
  영어: 'bg-indigo-100 text-indigo-700 border-indigo-200',
}

export default function SubjectSection({ subject, isOpen, onToggle, selectedCriteria, onToggleSelect }: Props) {
  const totalCriteria = subject.domains.reduce((sum, d) => sum + d.criteria.length, 0)
  const colorClass = SUBJECT_COLORS[subject.name] ?? 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className={cn('text-sm font-bold px-3 py-1 rounded-full border', colorClass)}>
            {subject.name}
          </span>
          <span className="text-xs text-gray-400">
            {subject.domains.length}개 영역 · {totalCriteria}개 성취기준
          </span>
        </div>
        <span className={cn(
          'text-gray-400 transition-transform',
          isOpen && 'rotate-180'
        )}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-6">
          {subject.domains.map(domain => (
            <DomainBlock
              key={domain.name}
              domain={domain}
              selectedCriteria={selectedCriteria}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
