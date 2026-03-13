'use client'
import { cn } from '@/lib/utils'

interface Props {
  subjects: string[]
  active: string | null
  onToggle: (name: string) => void
}

export default function SubjectChips({ subjects, active, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => active && onToggle(active)}
        className={cn(
          'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
          !active
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
        )}
      >
        전체
      </button>
      {subjects.map(name => (
        <button
          key={name}
          onClick={() => onToggle(name)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
            active === name
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
          )}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
