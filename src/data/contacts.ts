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
  phone: '010-2774-5201',
  bank: null,
  account: null,
}

/** 신부 */
export const BRIDE: Contact = {
  role: '신부',
  name: '박휘정',
  phone: '010-2327-4009',
  bank: '하나은행',
  account: '135-910012-95905',
}

/** 혼주 */
export const PARENTS: ContactGroup[] = [
  {
    side: '신랑측',
    members: [
      { role: '아버지', name: '오병목', phone: '010-2774-5201', bank: null, account: null },
      { role: '어머니', name: '최경자', phone: '010-2774-5201', bank: null, account: null },
    ],
  },
  {
    side: '신부측',
    members: [
      { role: '아버지', name: '박호준', phone: '010-7190-3450', bank: null, account: null },
    ],
  },
]
