export interface Contact {
  role: string
  name: string
  phone: string | null
  bank: string | null
  account: string | null
}

export interface ContactGroup {
  side: '신랑측' | '신부측'
  members: Contact[]
}

/** 신랑 */
export const GROOM: Contact = {
  role: '신랑',
  name: '오기승',
  phone: null,
  // ponytail: 가상 계좌(레이아웃 확인용) — 실계좌 확정되면 교체
  bank: '가상은행',
  account: '000-000-000001',
}

/** 신부 */
export const BRIDE: Contact = {
  role: '신부',
  name: '박휘정',
  phone: null,
  bank: '하나은행',
  account: '135-910012-95905',
}

/** 혼주 */
export const PARENTS: ContactGroup[] = [
  {
    side: '신랑측',
    members: [
      { role: '아버지', name: '오병목', phone: null, bank: '가상은행', account: '000-000-000002' },
      { role: '어머니', name: '최경자', phone: null, bank: '가상은행', account: '000-000-000003' },
    ],
  },
  {
    side: '신부측',
    members: [
      { role: '아버지', name: '박호준', phone: null, bank: '가상은행', account: '000-000-000004' },
      { role: '어머니', name: '안수현', phone: null, bank: '가상은행', account: '000-000-000005' },
    ],
  },
]
