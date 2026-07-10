# Antigravity Rules & Workspace Guidelines

본 문서는 예비 부부의 맞춤형 모바일 청첩장 프로젝트에서 사용자가 지시한 규칙과 히스토리를 기억하고 준수하기 위한 규칙 파일(Rules)입니다. Antigravity 에이전트는 본 프로젝트를 수행할 때 항상 이 규칙을 참고합니다.

---

## 핵심 운영 규칙 (Workspace Rules)

1. **기능명세서 위치 및 이름**
   - 기능명세서는 [Docs/FSD.md](file:///Users/heizel/Documents/GitHub/20261018/Docs/FSD.md)에 위치하며, 설계의 최신 기준점(Single Source of Truth)으로 관리합니다.

2. **작업 완료 보고 및 체크리스트 동기화**
   - 구현 작업이나 단계가 완료되어 보고서(Walkthrough)를 작성할 때, **반드시** 동시에 [Docs/checklist.md](file:///Users/heizel/Documents/GitHub/20261018/Docs/checklist.md)의 체크박스를 실제 진행 상황에 맞춰 체크(`[x]` 또는 `[/]`) 상태로 업데이트해야 합니다.

3. **인프라 세팅의 자동화**
   - 인프라 세팅 요청 시, Supabase CLI 마이그레이션 SQL 스크립트 작성 및 로컬 환경 파일 설정 등 코드 수준에서 자동으로 구축될 수 있도록 구조를 제공합니다.

4. **규칙 및 중요 결정사항의 지속적 업데이트 (Self-Updating Rules)**
   - 프로젝트 도중 지속적으로 기억해야 할 중요한 요구사항 변경, 피드백, 설계 결정 등이 발생하면 자발적으로 `AGENT.md` 및 `.agents/AGENTS.md`를 즉각 업데이트하여 기록을 최신으로 유지합니다.

5. **무분별한 이모지 및 시각 장식물 배제**
   - 대화, 보고서, 문서 작성 시 의미 없는 장식성 이모지(아이콘) 사용을 지양하고 담백한 텍스트로 정보만 전달합니다.

6. **git checkout 금지**
   - 니마음대로 깃 체크아웃 하지마세요. 되돌리라는 명령은 바로 직전대화로 생성된 코드를 undo 하라는 의미입니다.

---

## 주요 지시사항 및 진행 히스토리

- **2026-07-09**:
  - `Docs/FSD.md` 분석 후 `Docs/checklist.md` 및 `Docs/plan.md` 설계 완료.
  - 1단계(React+TS+Vite 프로젝트 스캐폴딩, 절대 경로 `@/*` 설정, Supabase 마이그레이션 DDL/RLS 정책 및 `.env` 설정) 완료 및 빌드 성공 검증 완료.
  - `checklist.md`에 1단계 완료 상태 동기화 처리.

---

## 디자인 테마 가이드라인 (Design Theme Guidelines)

- **라이트 테마 (Vintage Editorial)**
  - 주요 키워드: Editorial, Fine Art, Magazine Layout, White Space, Serif Typography, Offset Printing, Matte Paper, Fine Art Wedding, Editorial Wedding, Kinfolk, Cereal Magazine, Vintage Paper, Letterpress, Museum Catalogue, Archive Design, Kodak Portra, Natural Linen, Swiss Editorial, Old Book Layout

- **다크 테마 (Retro Computing)**
  - 주요 키워드: Retro Computing, Terminal UI, Matrix, ASCII Art, CRT, Industrial, System Interface, Boot Sequence, Archive, Diegetic UI
