# 개성 맞춤형 듀얼 모드 모바일 청첩장 디자인 가이드

본 문서는 **개성 맞춤형 듀얼 모드 모바일 청첩장**의 UI/UX, 무드, 타이포그래피, 화면 전환 방식에 대한 전용 설계 문서입니다.

---

## 1. 듀얼 모드 디자인 방향

이 프로젝트는 단순한 라이트/다크 토글이 아니라, 같은 URL 안에서 서로 다른 세계관의 화면을 넘겨보는 방식으로 설계합니다.

- `Light Mode`: 전시 도록, 매거진, 에디토리얼 분위기의 차분한 화면
- `Dark Mode`: 터미널, ASCII, 레트로 컴퓨팅 감성의 개성 있는 화면
- 상단 해/달 버튼으로 화면 전환
- 전환 시에는 색만 바뀌는 것이 아니라, 레이아웃과 타이포그래피 밀도까지 함께 바뀜

---

## 2. Light Mode

### 2.1 무드
Vintage Editorial

### 2.2 타이포그래피
- 헤드라인: `Instrument Serif`
- 본문: `Pretendard`
- 캡션: `IBM Plex Mono`

### 2.3 레이아웃 특징
- 충분한 여백을 활용한 잡지식 구성
- 사진과 텍스트의 위계를 분명하게 분리
- 캡션은 아주 작게, 작품 번호처럼 보이도록 처리

### 2.4 표현 방식 예시
```text
Chapter 01

The Beginning

9년 동안 서로의 일상을 채워온 두 사람이,
이제 하나의 일상을 시작합니다.
```

---

## 3. Dark Mode

### 3.1 무드
Retro Computing

### 3.2 타이포그래피
- 헤드라인: `IBM Plex Mono`
- 본문: `Geist Mono` 또는 `IBM Plex Mono`
- 강조: ASCII Art와 모노스페이스만 사용

### 3.3 레이아웃 특징
- 터미널 창처럼 보이는 컴포넌트 구조
- ASCII 아트와 코드블록 중심의 구성
- 각진 요소와 고대비 컬러를 활용한 레트로 UI

### 3.4 표현 방식 예시
```text
BOOT SEQUENCE

> loading memory of us...
> switching to retro mode
```

---

## 4. 화면 전환

- 해/달 아이콘 버튼으로 `mode`를 전환
- 전환은 동일 URL 내에서 수행
- `LightModePage`와 `DarkModePage`는 별도 컴포넌트로 분리
- 전환 애니메이션은 페이드 또는 디졸브 중심으로 구성
- `prefers-reduced-motion` 환경에서는 전환 효과를 축소

---

## 5. 공통 원칙

- 캡션과 보조 정보는 모노스페이스 계열을 우선 사용
- 텍스트는 각 모드의 세계관에 맞게 톤을 분리
- 색상만 바꾸는 테마보다, 콘텐츠 구조 자체가 달라지는 느낌을 우선
- 모바일에서 읽기 쉬운 위계와 밀도를 유지

---

## 6. 애니메이션 컴포넌트 운영

React Bits를 보조 애니메이션 라이브러리로 사용합니다.

- Tailwind CSS는 도입하지 않음
- React Bits의 `TS-CSS` 변형만 사용
- shadcn registry URL 방식으로 필요한 컴포넌트만 개별 추가
- Dark Mode의 텍스트/ASCII/배경 연출 위주로 제한적으로 사용
- Light Mode에서는 과한 움직임보다 전시 도록 같은 은은한 reveal 효과만 사용

컴포넌트 추가 예시:
```bash
npx shadcn@latest add https://reactbits.dev/r/BlurText-TS-CSS.json --yes
```
