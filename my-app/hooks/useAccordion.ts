'use client'
import { useState, useCallback } from 'react'

export function useAccordion() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggle = useCallback((key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const expandAll = useCallback((keys: string[]) => {
    setOpenItems(new Set(keys))
  }, [])

  const collapseAll = useCallback(() => {
    setOpenItems(new Set())
  }, [])

  const isOpen = useCallback((key: string) => openItems.has(key), [openItems])

  return { isOpen, toggle, expandAll, collapseAll }
}
