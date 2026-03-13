'use client'
import { useState, useCallback } from 'react'
import type { Subject } from '@/types'

export function useFilter() {
  const [activeSubject, setActiveSubject] = useState<string | null>(null)

  const toggle = useCallback((name: string) => {
    setActiveSubject(prev => (prev === name ? null : name))
  }, [])

  const applyFilter = useCallback(
    (subjects: Subject[]) =>
      activeSubject ? subjects.filter(s => s.name === activeSubject) : subjects,
    [activeSubject]
  )

  return { activeSubject, toggle, applyFilter }
}
