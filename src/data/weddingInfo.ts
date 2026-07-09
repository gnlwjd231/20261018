// 예식 정보 상수
// 예식 일시, 장소, 좌표 등 모든 정보를 한 곳에서 관리합니다.

/** 예식 일시 */
export const WEDDING_DATE_TIME = new Date('2026-10-18T11:00:00+09:00')

/** 표시용 일시 문자열 */
export const WEDDING_DATE_DISPLAY = '2026년 10월 18일 일요일 오전 11시'
export const WEDDING_DATE_SHORT = '2026.10.18 SUN 11:00'

/** 장소 정보 */
export const VENUE = {
  name: '서울대학교 교수회관',
  nameEn: 'SNU Faculty Club',
  address: '서울특별시 관악구 관악로 1 서울대학교 내 65동',
  addressShort: '서울대학교 교수회관',
  /** 카카오맵 좌표 (서울대학교 교수회관) */
  lat: 37.4600,
  lng: 126.9530,
  /** 카카오맵 장소 ID — 지도 인포윈도우용 */
  kakaoPlaceId: '7942551',
} as const

/** 딥링크 URLs */
export const MAP_LINKS = {
  /** 카카오맵 앱 실행 (장소 상세) */
  kakao: `kakaomap://look?p=${37.4600},${126.9530}`,
  /** 카카오맵 웹 fallback */
  kakaoWeb: `https://map.kakao.com/link/map/${encodeURIComponent('서울대학교 교수회관')},${37.4600},${126.9530}`,
  /** 네이버 지도 앱 실행 */
  naver: `nmap://place?lat=${37.4600}&lng=${126.9530}&name=${encodeURIComponent('서울대학교 교수회관')}&appname=wedding.invitation`,
  /** 네이버 지도 웹 fallback */
  naverWeb: `https://map.naver.com/v5/search/${encodeURIComponent('서울대학교 교수회관')}`,
  /** 티맵 앱 실행 */
  tmap: `tmap://search?name=${encodeURIComponent('서울대학교 교수회관')}`,
  /** 구글 캘린더 이벤트 추가 */
  googleCalendar: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('오○○♥박○○ 결혼식')}&dates=20261018T020000Z/20261018T040000Z&details=${encodeURIComponent('서울대학교 교수회관')}&location=${encodeURIComponent('서울특별시 관악구 관악로 1 서울대학교 교수회관')}`,
} as const

/** 교통편 정보 */
export const TRANSPORT = {
  subway: {
    line: '2호선',
    station: '낙성대역',
    exit: '4번 출구',
  },
  bus: {
    route: '관악 02-1',
    boardAt: '낙성대역 4번 출구 앞 GS칼텍스 주유소 지나 우회전',
    alightAt: '공동기기원(교수회관)',
    warning: '호암교수회관에서 내리면 안 됩니다 (호암교수회관 ≠ 서울대학교 교수회관)',
  },
  car: {
    parking: '무료 (주차 자유)',
    naviKeyword: '서울대학교 교수회관',
  },
  steps: [
    '2호선 낙성대역 4번 출구로 나옵니다.',
    '4번 출구 바로 앞(10m), GS칼텍스 주유소를 지나 우회전합니다.',
    '우회전 직후, "관악 02" 정류장에서 관악 02-1번 탑승합니다.',
    '⚠ 서울대 진입 전 "호암교수회관"에서 절대 내리지 마세요.',
    '서울대학교 진입 이후, "공동기기원(교수회관)"에서 하차합니다.',
    '하차 후 교통안내판을 따라 약 200m 걸으면 교수회관에 도착합니다.',
  ],
} as const
