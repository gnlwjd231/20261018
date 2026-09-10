// 초대 URL 버전별 OG 페이지 생성
// vite build 결과물(dist/index.html)을 템플릿으로, 버전별 meta만 바꿔 복사합니다.
// ponytail: 문구·이미지 추가/수정은 아래 PAGES 한 곳에서만
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://261018.vercel.app'
const DATE_VENUE = '2026년 10월 18일 일요일 오전 11시 · 서울대학교 교수회관'

const PAGES = [
  { slug: 'hazel', desc: '정아 공주 결혼해! 꼭 와줘잉 ~', img: 'og-image-dark.jpg' },
  { slug: 'okie', desc: '안녕, 나 오키. 초미녀 신부를 얻었다. 후후후', img: 'og-image-dark.jpg' },
]

const setContent = (html, key, value) =>
  html.replace(new RegExp(`(${key}" content=")[^"]*`), `$1${value}`)

const template = readFileSync(join(dist, 'index.html'), 'utf8')

for (const page of PAGES) {
  let html = template
  html = setContent(html, 'name="description', page.desc)
  html = setContent(html, 'property="og:description', page.desc)
  html = setContent(html, 'name="twitter:description', page.desc)
  html = setContent(html, 'property="og:url', `${SITE}/${page.slug}`)
  html = setContent(html, 'property="og:image', `${SITE}/${page.img}`)
  html = setContent(html, 'name="twitter:image', `${SITE}/${page.img}`)
  const dir = join(dist, page.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  console.log(`invite page: /${page.slug} (${page.img})`)
}
