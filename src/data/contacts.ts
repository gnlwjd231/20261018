// 연락처 데이터
// 신랑쪽 혼주 번호 확정 후 이 파일만 수정하면 됩니다.

export interface Contact {
  role: string
  name: string
  phone: string | null // null = 번호 미정
}

export interface ContactGroup {
  side: '신랑측' | '신부측'
  members: Contact[]
}

/** 신랑 */
export const GROOM: Contact = {
  role: '신랑',
  name: '오○○',
  phone: '010-2774-5201',
}

/** 신부 */
export const BRIDE: Contact = {
  role: '신부',
  name: '박○○',
  phone: '010-2327-4009',
}

/** 혼주 */
export const PARENTS: ContactGroup[] = [
  {
    side: '신랑측',
    members: [
      { role: '아버지', name: '오○○', phone: null },  // 번호 미정 — 확정 후 입력
      { role: '어머니', name: '○○○', phone: null },  // 번호 미정 — 확정 후 입력
    ],
  },
  {
    side: '신부측',
    members: [
      { role: '아버지', name: '박호준', phone: '010-2327-4009' },
    ],
  },
]
