// 성취기준 (CSV에서 로딩)
export interface Criteria {
  code: string        // '4국01-01'
  text: string        // 성취기준 본문
  levelA: string      // 성취수준 A (잘함)
  levelB: string      // 성취수준 B (보통)
  levelC: string      // 성취수준 C (노력 필요)
  explanation: string // 해설
}

export interface Domain {
  name: string
  coreIdea: string
  criteria: Criteria[]
}

export interface Subject {
  name: string        // '국어', '수학', ...
  domains: Domain[]
}

// 수업 재구성 (Supabase에 저장)
export interface LessonPlan {
  id: string
  user_id: string
  title: string
  criteria_codes: string[]
  inquiry_question: string
  goal: string
  performance_task: string
  rubric: string
  key_activities: string
  schedule: string
  assessment: string
  memo: string
  created_at: string
  updated_at: string
}
