/* =========================================================
   СИГНАЛ — рекламное агентство
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Хедер при скролле ---------- */

  var header = document.getElementById("header");

  function onScroll() {
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Мобильное меню ---------- */

  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function closeNav() {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.style.overflow = open ? "hidden" : "";
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) closeNav();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 760) closeNav();
  });

  /* ---------- Появление блоков ---------- */

  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Счётчики ---------- */

  var counters = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- Подсветка активного пункта меню ---------- */

  var sections = document.querySelectorAll("main section[id]");
  var navLinks = nav.querySelectorAll('a[href^="#"]');

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------- FAQ: открыт только один пункт ---------- */

  var faqItems = document.querySelectorAll(".faq__item");

  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- Форма ---------- */

  var form = document.getElementById("orderForm");

  if (form) {
    var nameInput = document.getElementById("name");
    var phoneInput = document.getElementById("phone");
    var agreeInput = document.getElementById("agree");
    var successBox = form.querySelector(".form__success");

    function setError(input, message) {
      var errorEl = form.querySelector('[data-error-for="' + input.id + '"]');
      if (errorEl) errorEl.textContent = message || "";
      input.classList.toggle("is-invalid", Boolean(message));
    }

    function validateName() {
      if (nameInput.value.trim().length < 2) {
        setError(nameInput, "Укажите имя — хотя бы 2 символа");
        return false;
      }
      setError(nameInput, "");
      return true;
    }

    function validatePhone() {
      var value = phoneInput.value.trim();
      var digits = value.replace(/\D/g, "");
      var isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!isEmail && digits.length < 10) {
        setError(phoneInput, "Введите телефон или корректный e-mail");
        return false;
      }
      setError(phoneInput, "");
      return true;
    }

    nameInput.addEventListener("blur", validateName);
    phoneInput.addEventListener("blur", validatePhone);
    nameInput.addEventListener("input", function () { if (nameInput.classList.contains("is-invalid")) validateName(); });
    phoneInput.addEventListener("input", function () { if (phoneInput.classList.contains("is-invalid")) validatePhone(); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var ok = validateName();
      ok = validatePhone() && ok;

      if (!agreeInput.checked) {
        setError(agreeInput, "Нужно согласие на обработку данных");
        ok = false;
      } else {
        setError(agreeInput, "");
      }

      if (!ok) {
        var firstInvalid = form.querySelector(".is-invalid") || agreeInput;
        if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправляем…";

      /* Демо: имитация отправки. Здесь можно вызвать fetch() к вашему API. */
      window.setTimeout(function () {
        successBox.hidden = false;
      }, 600);
    });
  }

  /* ---------- Плавная прокрутка с учётом фиксированного хедера ---------- */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: "smooth" });

      if (history.replaceState) history.replaceState(null, "", id);
    });
  });
})();
