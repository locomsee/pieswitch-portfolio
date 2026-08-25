(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initStickyNav();
    initSmoothScroll();
    initScrollReveal();
    initActiveNavHighlight();
    initProcessProgress();
    initContactForm();
  });

  /* ---------------------------------------------------------------------
   * Mobile navigation toggle
   * ------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var mobileNav = document.getElementById("navMobile");
    if (!toggle || !mobileNav) return;

    function closeMenu() {
      toggle.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("is-open");
    }

    function openMenu() {
      toggle.setAttribute("aria-expanded", "true");
      mobileNav.classList.add("is-open");
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (e) {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (!isOpen) return;
      if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ---------------------------------------------------------------------
   * Sticky / compact navbar on scroll
   * ------------------------------------------------------------------- */
  function initStickyNav() {
    var nav = document.getElementById("siteNav");
    if (!nav) return;

    var ticking = false;

    function update() {
      if (window.scrollY > 24) {
        nav.classList.add("nav--scrolled");
      } else {
        nav.classList.remove("nav--scrolled");
      }
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  }

  /* ---------------------------------------------------------------------
   * Smooth scroll for in-page anchor links
   * ------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
        history.pushState(null, "", id);
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Scroll-reveal animation
   * ------------------------------------------------------------------- */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
   * Active nav link highlighting
   * ------------------------------------------------------------------- */
  function initActiveNavHighlight() {
    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll(".nav__links a, .nav__mobile a[href^='#']");
    if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------------------------------------------------------------------
   * Process timeline progress fill on scroll
   * ------------------------------------------------------------------- */
  function initProcessProgress() {
    var track = document.getElementById("processTrack");
    var fill = document.getElementById("processLineFill");
    if (!track || !fill || !("IntersectionObserver" in window)) return;

    var steps = track.querySelectorAll(".process-step");
    var stepObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
        var visibleCount = track.querySelectorAll(".process-step.is-visible").length;
        var percent = steps.length ? (visibleCount / steps.length) * 100 : 0;
        var isVertical = window.innerWidth <= 768;
        fill.style.width = isVertical ? "100%" : percent + "%";
        fill.style.height = isVertical ? percent + "%" : "100%";
      },
      { threshold: 0.5 }
    );

    steps.forEach(function (step) {
      stepObserver.observe(step);
    });
  }

  /* ---------------------------------------------------------------------
   * Contact form validation + simulated submit (no backend)
   * ------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var status = document.getElementById("formStatus");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phonePattern = /^[0-9+\-\s()]{7,20}$/;

    var fields = {
      name: { el: document.getElementById("name"), validate: function (v) { return v.trim().length > 0; } },
      email: { el: document.getElementById("email"), validate: function (v) { return emailPattern.test(v.trim()); } },
      phone: {
        el: document.getElementById("phone"),
        validate: function (v) { return v.trim() === "" || phonePattern.test(v.trim()); },
      },
      message: { el: document.getElementById("message"), validate: function (v) { return v.trim().length > 0; } },
    };

    function setFieldState(key, isValid) {
      var field = fields[key];
      if (!field || !field.el) return;
      var wrapper = field.el.closest(".field");
      if (!wrapper) return;
      wrapper.classList.toggle("has-error", !isValid);
      field.el.setAttribute("aria-invalid", isValid ? "false" : "true");
    }

    function validateAll() {
      var allValid = true;
      Object.keys(fields).forEach(function (key) {
        var field = fields[key];
        if (!field.el) return;
        var isValid = field.validate(field.el.value);
        setFieldState(key, isValid);
        if (!isValid) allValid = false;
      });
      return allValid;
    }

    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (!field.el) return;
      field.el.addEventListener("blur", function () {
        setFieldState(key, field.validate(field.el.value));
      });
      field.el.addEventListener("input", function () {
        var wrapper = field.el.closest(".field");
        if (wrapper && wrapper.classList.contains("has-error") && field.validate(field.el.value)) {
          setFieldState(key, true);
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (status) status.classList.remove("is-visible");

      if (!validateAll()) {
        var firstError = form.querySelector(".field.has-error input, .field.has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      if (status) status.classList.add("is-visible");
      form.reset();
      Object.keys(fields).forEach(function (key) {
        setFieldState(key, true);
      });
    });
  }
})();
