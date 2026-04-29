(function () {
  // Year stamp
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.hidden = open;
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      }
    });
  }

  // Close FAQ siblings when one opens (single-open accordion)
  var details = document.querySelectorAll('.faq-list details');
  details.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) {
        details.forEach(function (other) { if (other !== d) other.open = false; });
      }
    });
  });

  // Reveal on scroll (progressive enhancement — gated on .js-reveal so
  // content stays visible if JS fails for any reason)
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    var targets = document.querySelectorAll('.service-card, .expert-card, .steps li, .faq-list details, .hero-copy, .hero-card, .trust-grid > div');
    targets.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });

    // Safety net: if for any reason the observer doesn't reveal items
    // within 1.5s of load, force-reveal everything.
    setTimeout(function () {
      targets.forEach(function (el) { el.classList.add('is-in'); });
    }, 1500);
  }
})();
