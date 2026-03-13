import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import type { Subject } from '@/types'

export function loadCriteria(): Subject[] {
  const filePath = path.join(process.cwd(), 'data', 'criteria_3_4.csv')
  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const rows = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
  })

  const subjectMap = new Map<string, any>()

  for (const row of rows as Record<string, string>[]) {
    const rawCode = row['성취기준 코드'] ?? ''
    const code = rawCode.replace(/[\[\]]/g, '').trim()
    if (!code.match(/^4[가-힣\uAC00-\uD7A3a-zA-Z\d]+\d{2}-\d{2}$/)) continue

    const subjectName = (row['교과'] ?? '').trim()
    const domainName = (row['영역'] ?? '').trim()
    if (!subjectName || !domainName) continue

    if (!subjectMap.has(subjectName)) {
      subjectMap.set(subjectName, { name: subjectName, domains: new Map() })
    }
    const subject = subjectMap.get(subjectName)

    const coreIdeaKey = Object.keys(row).find(k => k.includes('핵심') && k.includes('아이디어')) ?? '핵심\n아이디어'

    if (!subject.domains.has(domainName)) {
      subject.domains.set(domainName, {
        name: domainName,
        coreIdea: (row[coreIdeaKey] ?? '').trim(),
        criteria: [],
      })
    }

    const domain = subject.domains.get(domainName)
    if (!domain.coreIdea && row[coreIdeaKey]) {
      domain.coreIdea = row[coreIdeaKey].trim()
    }

    domain.criteria.push({
      code,
      text: (row['성취기준'] ?? '').trim(),
      levelA: (row['성취수준(A)'] ?? '').trim(),
      levelB: (row['성취수준(B)'] ?? '').trim(),
      levelC: (row['성취수준(C)'] ?? '').trim(),
      explanation: (row['해설'] ?? '').trim(),
    })
  }

  return Array.from(subjectMap.values()).map(s => ({
    ...s,
    domains: Array.from(s.domains.values()),
  }))
}
