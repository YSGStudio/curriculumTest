'use client'
import { useState } from 'react'
import CriteriaCard from './CriteriaCard'
import type { Domain, Criteria } from '@/types'

interface Props {
  domain: Domain
  selectedCriteria: Criteria[]
  onToggleSelect: (c: Criteria) => void
}

export default function DomainBlock({ domain, selectedCriteria, onToggleSelect }: Props) {
  const [showCoreIdea, setShowCoreIdea] = useState(false)

  return (
    <div className="border-l-4 border-blue-200 pl-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-blue-800">{domain.name}</h3>
        <span className="text-xs text-gray-400">({domain.criteria.length}개)</span>
        {domain.coreIdea && (
          <button
            onClick={() => setShowCoreIdea(prev => !prev)}
            className="text-xs text-gray-400 hover:text-blue-600 ml-auto"
          >
            {showCoreIdea ? '핵심 아이디어 접기' : '핵심 아이디어'}
          </button>
        )}
      </div>

      {showCoreIdea && domain.coreIdea && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs text-blue-700 leading-relaxed whitespace-pre-line">{domain.coreIdea}</p>
        </div>
      )}

      <div className="space-y-3">
        {domain.criteria.map(c => (
          <CriteriaCard
            key={c.code}
            criteria={c}
            isSelected={!!selectedCriteria.find(x => x.code === c.code)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </div>
  )
}
