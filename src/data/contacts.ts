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
  bank: '하나은행',
  account: '477-910276-46607',
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
      { role: '아버지', name: '오병묵', phone: null, bank: '제일은행', account: '157-20-201684' },
      { role: '어머니', name: '최경자', phone: null, bank: '신한은행', account: '110-432-607108' },
    ],
  },
  {
    side: '신부측',
    members: [
      { role: '아버지', name: '박호준', phone: null, bank: '우리은행', account: '1005-9010411747' },
      { role: '어머니', name: '안수현', phone: null, bank: '농협', account: '821110-52-037493' },
    ],
  },
]
