'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import type { Subject } from '@/types'

export function useSearch(subjects: Subject[]) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback((value: string) => {
    setQuery(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setDebouncedQuery(value), 300)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const filtered = debouncedQuery.trim()
    ? subjects.map(subject => ({
        ...subject,
        domains: subject.domains
          .map(domain => ({
            ...domain,
            criteria: domain.criteria.filter(c =>
              c.code.includes(debouncedQuery) ||
              c.text.includes(debouncedQuery) ||
              c.explanation.includes(debouncedQuery)
            ),
          }))
          .filter(domain => domain.criteria.length > 0),
      })).filter(subject => subject.domains.length > 0)
    : subjects

  return { query, setQuery: handleChange, filtered }
}
