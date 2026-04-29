<!--
  Why this README exists:
  - 비기술자 사용자(김병준 대표)가 다음 세션이나 외부 협업자에게 프로젝트를 넘길 때
    "이게 뭐고 어떻게 띄우는지" 한 페이지로 알려주기 위함.
  - GitHub 저장소 첫 화면에 자동 노출되므로 SEO에도 약간 도움.
-->

# 내일플러스 (Naeil Plus) — 컨설팅 랜딩페이지

기업 성장 종합 컨설팅 회사 **내일플러스**의 공식 랜딩페이지 + 광고용 상세페이지(LP) 정적 웹사이트입니다.

- 회사: 내일플러스 (biznaeil.com)
- 대표: 김병준
- 연락처: ceo@biznaeil.com

## 페이지 구성

| 파일 | 용도 |
|------|------|
| `index.html` | 메인 홈 (18개 컨설팅 카탈로그 종합 안내) |
| `consult.html` | **광고용 상세페이지(LP)** — 페이스북 광고 트래픽 전용 단일 목적 페이지 |
| `thanks.html` | 상담 신청 완료 페이지 (Facebook `CompleteRegistration` 전환 이벤트) |
| `privacy.html` | 개인정보처리방침 |
| `terms.html` | 이용약관 |
| `styles.css` | 디자인 시스템 (Pretendard, 네이비+골드 컬러) |
| `script.js` | 메인 페이지 인터랙션 (모바일 메뉴, FAQ, 스크롤 페이드인) |
| `lp.js` | 광고 LP 전용 (UTM 자동 캡처, FB Lead 이벤트 발사) |
| `robots.txt`, `sitemap.xml` | SEO 색인 |

## 운영 시 교체해야 하는 자리표시자

광고 운영 전 아래 항목을 본인 값으로 교체하세요.

1. **Facebook Pixel ID** — `consult.html`, `thanks.html` 두 곳의 `PIXEL_ID` 교체 + 주변 `/* */` 주석 해제
2. **Formspree 폼 ID** — `consult.html`, `index.html`의 `YOUR_FORM_ID` 교체 (또는 자체 백엔드로 대체)
3. **OG 이미지** — 루트에 `og-image.png` (1200×630), `og-consult.png` 업로드
4. **후기 섹션** — `consult.html`의 14번 섹션을 실제 클라이언트 동의받은 후기로 교체

## 로컬 미리보기

별도 서버 없이 더블클릭으로 가능합니다.

```
C:\Users\AAAAA\naeilplus-landing\index.html
```

## 배포 (옵션)

GitHub Pages를 사용하면 무료로 인터넷에 공개할 수 있습니다.

1. 본 저장소 → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / Folder: **/ (root)**
4. **Save**
5. 1~2분 후 `https://<유저명>.github.io/naeilplus-landing/`에서 접속 가능

자체 도메인(biznaeil.com) 연결은 Settings → Pages → Custom domain에서 설정.

## 광고 URL 패턴 (UTM 추적)

```
https://biznaeil.com/consult.html?utm_source=facebook&utm_medium=cpc&utm_campaign=정책자금_4월&utm_content=영상A
```

URL의 `utm_*` 파라미터는 폼 제출 시 자동으로 hidden 필드에 담겨 함께 전송됩니다.

## 라이선스

본 저장소의 코드와 콘텐츠는 내일플러스 소유입니다. © 2026 Naeil Plus.
