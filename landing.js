/* =========================================================
   이 파일은 [광고용 랜딩페이지(LP) 전용 스크립트] 입니다.
   - 저장소: biznaeil/naeilplus-landing
   - 사용처: landing.html (UTM 자동 캡처, FB Lead 이벤트 발사, Firestore 상담접수 저장)
   - 분리 이력 (2026-05-01): 파일명 lp.js → landing.js
   - 수정 (2026-05-01, 상담접수 통합): Formspree 제거 → naeil-workspace Firestore 의 consultations 컬렉션에 직접 저장.
       워크스페이스 관리자는 https://naeil-workspace.web.app/#/consultations 에서 목록/상세 확인.
       이 파일은 ESM(type="module") 로 로드됨 — landing.html 의 <script type="module"> 참고.
   내일플러스 LP — UTM capture & Firestore lead submit
   ========================================================= */

// Firebase v10 Modular SDK (CDN ESM). 워크스페이스(naeil-workspace) 프로젝트로 직접 쓰기.
// apiKey 는 공개돼도 안전한 설계 — 실제 보호는 firestore.rules 의 consultations 규칙(필드 화이트리스트 + 허니팟) 으로 처리.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// 워크스페이스 Firebase 설정 (naeil-workspace 프로젝트, .env.local 과 일치).
const firebaseConfig = {
  apiKey: "AIzaSyDXkcMiFHZYj_hgkj1ey0mluqFwI5d7pBQ",
  authDomain: "naeil-workspace.firebaseapp.com",
  projectId: "naeil-workspace",
  storageBucket: "naeil-workspace.firebasestorage.app",
  messagingSenderId: "76719281659",
  appId: "1:76719281659:web:0e6b013cc4a3c38ab8275e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1) UTM 파라미터 + referrer 를 hidden field 로 자동 채우기.
const params = new URLSearchParams(window.location.search);
const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

utmKeys.forEach((key) => {
  const val = params.get(key) || "";
  document.querySelectorAll('input[name="' + key + '"]').forEach((el) => {
    el.value = val;
  });
});

document.querySelectorAll('input[name="referrer"]').forEach((el) => {
  el.value = document.referrer || "";
});

// 2) 전화번호 입력 시 숫자/하이픈만 허용 (가벼운 클라이언트 검증).
document.querySelectorAll('input[type="tel"]').forEach((el) => {
  el.addEventListener("input", () => {
    el.value = el.value.replace(/[^\d-]/g, "");
  });
});

// 3) 페이지 로드 시각 — 너무 빨리 제출되면(< 2.5초) 봇으로 간주하고 차단.
//    허니팟과 함께 1차 봇 차단 레이어. 사람은 폼 채우는 데 거의 항상 2.5초 이상 걸림.
const pageLoadTime = Date.now();

// 4) 폼 제출 처리 — Firestore 직접 쓰기.
document.querySelectorAll("form[data-lead-form]").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn?.disabled) return;

    // 봇 차단 1: 너무 빨리 제출
    if (Date.now() - pageLoadTime < 2500) {
      console.warn("[lead-form] submit too fast — blocked");
      window.location.href = "thanks.html"; // 봇에는 정상으로 보이도록 redirect
      return;
    }

    // 봇 차단 2: 허니팟 — firestore.rules 도 검증하지만 클라이언트에서 한번 더.
    const hp = (form.querySelector('input[name="hp"]')?.value || "").trim();
    if (hp.length > 0) {
      console.warn("[lead-form] honeypot filled — blocked");
      window.location.href = "thanks.html";
      return;
    }

    // 폼 데이터 수집 — name 속성이 한글이라 직접 매핑.
    const get = (selector) =>
      (form.querySelector(selector)?.value || "").trim();

    const payload = {
      name: get('input[name="이름"]'),
      phone: get('input[name="연락처"]'),
      company: get('input[name="회사"]'),
      topic: get('select[name="관심영역"]'),
      message: get('textarea[name="상황"]'),
      hp: "", // 허니팟은 항상 빈 값으로 저장 (rules 가 size==0 검증)
      status: "new", // 신규 접수
      createdAt: serverTimestamp(), // 서버 시간
      utm_source: get('input[name="utm_source"]'),
      utm_medium: get('input[name="utm_medium"]'),
      utm_campaign: get('input[name="utm_campaign"]'),
      utm_term: get('input[name="utm_term"]'),
      utm_content: get('input[name="utm_content"]'),
      referrer: get('input[name="referrer"]'),
      landing_page: get('input[name="landing_page"]'),
      userAgent: navigator.userAgent || "",
    };

    // 필수값 클라이언트 검증 (HTML required 외 한 번 더 안전망).
    if (!payload.name || !payload.phone || !payload.company || !payload.topic) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }

    // 제출 버튼 비활성 + 로딩 표시
    let originalText = "";
    if (submitBtn) {
      originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "전송 중...";
    }

    try {
      // 페이스북 픽셀 Lead 이벤트 — fbq 가 로드돼 있을 때만.
      if (typeof window.fbq === "function") {
        try {
          window.fbq("track", "Lead");
        } catch (_) { /* swallow */ }
      }

      await addDoc(collection(db, "consultations"), payload);
      // 성공 → 감사 페이지
      window.location.href = "thanks.html";
    } catch (err) {
      console.error("[lead-form] submit failed:", err);
      alert(
        "제출에 실패했습니다. 잠시 후 다시 시도해 주시거나 ceo@biznaeil.com 으로 연락 주세요.\n\n오류: " +
          (err?.message || err),
      );
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
});

// 5) 인페이지 앵커 부드러운 스크롤.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", id);
  });
});
