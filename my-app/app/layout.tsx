import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: '2022 개정 교육과정 성취기준 탐색',
  description: '3~4학년군 성취기준 탐색 및 수업 재구성 워크숍',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50 min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
