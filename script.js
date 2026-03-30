document.addEventListener('DOMContentLoaded', function () {

  /* ── Scroll (throttled via rAF) ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  var navbar = document.getElementById('navbar');
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {

        /* Navbar scrolled state */
        navbar.classList.toggle('scrolled', window.scrollY > 10);

        /* Active section highlight */
        var current = '';
        sections.forEach(function (section) {
          if (window.scrollY >= section.offsetTop - 100) {
            current = section.getAttribute('id');
          }
        });
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (current && link.getAttribute('href').includes(current)) {
            link.classList.add('active');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  });

  /* ── Reveal on scroll ── */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () { entry.target.classList.add('visible'); }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ── Hamburger / mobile drawer ── */
  var hamburger = document.getElementById('hamburger');
  var mobileDrawer = document.getElementById('mobileDrawer');
  var drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  drawerOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ── Animated counters ── */
  function animateCounter(el, target, suffix) {
    var start = null;
    var duration = 1800;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statNums = document.querySelectorAll('.stat-num');
  var statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var text = entry.target.textContent;
        var num = parseInt(text);
        var suffix = text.replace(String(num), '');
        animateCounter(entry.target, num, suffix);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(function (el) { statObserver.observe(el); });

});
