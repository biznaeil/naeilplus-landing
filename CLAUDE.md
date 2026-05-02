# 프로젝트 규칙 — naeilplus-landing

## 저장소 정보
- **레포지토리**: https://github.com/biznaeil/naeilplus-landing
- **소유 계정**: `biznaeil` (다른 사람 소유 — 본인 계정 아님)
- **레포 종류**: Public
- **저장소 성격**: 페이스북 광고 트래픽 전용 단일 목적 랜딩페이지(LP)
- **분리 이력**: 2026-05-01 회사 홈페이지 부분(index.html 등)을 `naeilplus-homepage` 저장소로 분리, 본 저장소는 LP 전담으로 정리. 동시에 `consult.html` → `landing.html`, `lp.js` → `landing.js` 이름 변경.

## 관련 저장소
- **`naeilplus-homepage`**: 회사 공식 홈페이지 (index.html, script.js 등). 별도 저장소로 운영.
- 두 저장소는 디자인 시스템(`styles.css`)과 법적 페이지(`privacy.html`, `terms.html`)를 **각자 복사본으로** 보유 — 디자인 변경 시 양쪽 동기화 필요.

## 개발 / 권한
- **개발자**: `kgb8905` (kgb8905@gmail.com) — 본인 계정
- **권한**: Collaborator (Write 권한)
- **로컬 git config**:
  - user.name: `kgb8905-cmd`
  - user.email: `kgb8905@gmail.com`

## 작업 흐름
- 본인이 코드 수정/작업
- "커밋해줘" / "올려줘" 라고 하면 Claude가 `git add` → `commit` → `push` 처리
- push 대상: `origin main` (biznaeil 계정의 원본 레포에 직접 push)

## 배포 흐름
- **"배포해줘"는 항상 GitHub 푸시 + Firebase Hosting 배포 둘 다를 의미한다.** 어느 한쪽만 하지 말 것.
- 실행 순서: (1) 변경사항 `git commit` → (2) `git push origin main` → (3) `npx firebase-tools deploy --only hosting --project naeilplus-landing`
- Firebase 프로젝트 ID: `naeilplus-landing`
- 라이브 URL: https://naeilplus-landing.web.app
- HTML은 1시간 캐시(`Cache-Control: max-age=3600`) — 배포 직후 미반영처럼 보일 수 있으니 강력 새로고침 안내 필요

## 코드 작성 규칙 (중요)
**모든 코드 작성·수정 시 한국어 주석으로 "이유와 상황"을 반드시 기록한다.**
- 새 코드: 작성 목적, 어떤 요구사항으로 만들어졌는지 주석으로 남기기
- 수정 코드: 수정 이유와 상황을 주석으로 남기기 (예: `// 수정: 모바일에서 버튼 안 보이는 이슈로 z-index 추가`)
- 목적: 새 대화 세션에서도 주석만 보고 맥락을 파악할 수 있도록 함
- 단순 오타/포맷팅은 제외, 의미 있는 변경에만 적용

## 주의사항
- `biznaeil` 계정은 본인 소유가 아니므로, 레포 설정 변경/삭제 등은 소유자에게 요청 필요
- `styles.css` 수정 시 `naeilplus-homepage` 저장소에도 동일 변경 적용해야 디자인 일관성 유지
- `landing.html` 파일명 절대 변경 금지 — 변경 시 페이스북 광고 URL과 canonical URL 깨짐
