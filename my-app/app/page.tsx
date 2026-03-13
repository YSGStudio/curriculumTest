import { loadCriteria } from '@/lib/loadCriteria'
import CriteriaExplorer from '@/components/criteria/CriteriaExplorer'

export default function Home() {
  const subjects = loadCriteria()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          2022 개정 교육과정 성취기준
        </h1>
        <p className="text-gray-500 text-sm">
          3~4학년군 성취기준 탐색 및 수업 재구성 워크숍
        </p>
      </div>
      <CriteriaExplorer subjects={subjects} />
    </div>
  )
}
