'use client'
import { useState } from 'react'
import LevelGrid from './LevelGrid'
import type { Criteria } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  criteria: Criteria
  isSelected: boolean
  onToggleSelect: (c: Criteria) => void
}

export default function CriteriaCard({ criteria, isSelected, onToggleSelect }: Props) {
  const [showExplanation, setShowExplanation] = useState(false)
  const [showLevels, setShowLevels] = useState(false)

  return (
    <div
      id={`criteria-${criteria.code}`}
      className={cn(
        'rounded-xl border p-4 transition-all scroll-mt-20',
        isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
              [{criteria.code}]
            </span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">{criteria.text}</p>
        </div>
        <button
          onClick={() => onToggleSelect(criteria)}
          className={cn(
            'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
            isSelected
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
          )}
        >
          {isSelected ? '✓ 선택됨' : '+ 선택'}
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setShowLevels(prev => !prev)}
          className="text-xs text-blue-600 hover:underline"
        >
          {showLevels ? '성취수준 접기' : '성취수준 A/B/C 보기'}
        </button>
        {criteria.explanation && (
          <button
            onClick={() => setShowExplanation(prev => !prev)}
            className="text-xs text-gray-500 hover:underline"
          >
            {showExplanation ? '해설 접기' : '해설 보기'}
          </button>
        )}
      </div>

      {showLevels && (
        <LevelGrid
          levelA={criteria.levelA}
          levelB={criteria.levelB}
          levelC={criteria.levelC}
        />
      )}

      {showExplanation && criteria.explanation && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 leading-relaxed">{criteria.explanation}</p>
        </div>
      )}
    </div>
  )
}
