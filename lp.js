/* =========================================================
   내일플러스 LP — UTM capture & lead-form helpers
   ========================================================= */
(function () {

  // 1) Capture UTM parameters and referrer into hidden fields
  var params = new URLSearchParams(window.location.search);
  var utmKeys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];

  utmKeys.forEach(function (key) {
    var val = params.get(key) || '';
    document.querySelectorAll('input[name="' + key + '"]').forEach(function (el) {
      el.value = val;
    });
  });

  document.querySelectorAll('input[name="referrer"]').forEach(function (el) {
    el.value = document.referrer || '';
  });

  // 2) Light client-side phone validation (KR)
  document.querySelectorAll('input[type="tel"]').forEach(function (el) {
    el.addEventListener('input', function () {
      // Strip everything except digits and dashes
      el.value = el.value.replace(/[^\d-]/g, '');
    });
  });

  // 3) Fire Facebook Lead event on form submit (only if fbq is loaded)
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function () {
      if (typeof window.fbq === 'function') {
        try {
          window.fbq('track', 'Lead');
        } catch (e) { /* swallow */ }
      }
      // Hand off — Formspree (or whichever backend) handles the rest
    });
  });

  // 4) Smooth scroll for in-page anchors (extra polish on top of CSS)
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

})();
