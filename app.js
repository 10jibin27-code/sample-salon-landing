/* 살롱 뮤즈 — 인터랙션 */
(function () {
  "use strict";

  /* ---------- 1. 영업시간 데이터 ---------- */
  // 0=일, 1=월 ...  (월요일 정기휴무)
  var SCHEDULE = {
    0: { open: "10:00", close: "17:00" },
    1: null,
    2: { open: "10:00", close: "20:00" },
    3: { open: "10:00", close: "20:00" },
    4: { open: "10:00", close: "20:00" },
    5: { open: "10:00", close: "20:00" },
    6: { open: "10:00", close: "18:00" }
  };

  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return Number(p[0]) * 60 + Number(p[1]);
  }

  function initHours() {
    var now = new Date();
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var today = SCHEDULE[day];

    var rows = document.querySelectorAll("#hoursTable tr[data-day]");
    for (var i = 0; i < rows.length; i++) {
      if (Number(rows[i].getAttribute("data-day")) === day) rows[i].classList.add("is-today");
    }

    var pill = document.getElementById("statusPill");
    var pillText = document.getElementById("statusText");
    var nowText = document.getElementById("hoursNow");

    var open = false;
    if (today && mins >= toMinutes(today.open) && mins < toMinutes(today.close)) open = true;

    if (pill && pillText) {
      pill.hidden = false;
      pillText.textContent = open ? "예약 접수 중" : "영업 종료";
      pill.classList.toggle("is-closed", !open);
    }

    if (nowText) {
      if (!today) {
        nowText.textContent = "오늘은 정기휴무입니다";
      } else if (open) {
        nowText.textContent = "지금 예약 상담 가능 · " + today.close + "까지";
      } else if (mins < toMinutes(today.open)) {
        nowText.textContent = "오늘 " + today.open + "에 문을 엽니다";
      } else {
        nowText.textContent = "오늘 영업이 끝났습니다 · " + today.open + " 오픈";
      }
    }
  }

  /* ---------- 2. 헤더 스크롤 상태 ---------- */
  function initHeader() {
    var head = document.getElementById("head");
    if (!head) return;
    var onScroll = function () {
      head.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 3. 모바일 메뉴 ---------- */
  function initMobileNav() {
    var burger = document.getElementById("burger");
    var nav = document.getElementById("mobileNav");
    if (!burger || !nav) return;

    function setOpen(open) {
      nav.hidden = !open;
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    }

    burger.addEventListener("click", function () {
      setOpen(nav.hidden);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080 && !nav.hidden) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !nav.hidden) setOpen(false);
    });
  }

  /* ---------- 4. 등장 애니메이션 ---------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-in");
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.getAttribute("data-delay") || 0);
        window.setTimeout(function () { el.classList.add("is-in"); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  }

  /* ---------- 5. 스타일 라이트박스 ---------- */
  function initLightbox() {
    var box = document.getElementById("lightbox");
    if (!box) return;
    var img = document.getElementById("lightboxImg");
    var cap = document.getElementById("lightboxCap");
    var close = document.getElementById("lightboxClose");
    var lastFocus = null;

    function open(src, alt, caption) {
      lastFocus = document.activeElement;
      img.src = src;
      img.alt = alt || "";
      cap.textContent = caption || "";
      box.hidden = false;
      document.body.style.overflow = "hidden";
      if (close) close.focus();
    }

    function shut() {
      if (box.hidden) return;
      box.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    var triggers = document.querySelectorAll(".gal__item");
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener("click", function () {
        var thumb = this.querySelector("img");
        open(this.getAttribute("data-full"), thumb ? thumb.alt : "", this.getAttribute("data-cap"));
      });
    }

    if (close) close.addEventListener("click", shut);
    box.addEventListener("click", function (e) {
      if (e.target === box) shut();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") shut();
    });
  }

  /* ---------- 6. 디자이너 선택 연결 ---------- */
  function initDesignerLinks() {
    var links = document.querySelectorAll("[data-designer]");
    if (!links.length) return;
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        var form = document.getElementById("reserveForm");
        if (!form) return;
        var sel = form.elements.designer;
        var want = this.getAttribute("data-designer");
        if (sel && want) {
          for (var k = 0; k < sel.options.length; k++) {
            if (sel.options[k].text === want) sel.selectedIndex = k;
          }
        }
      });
    }
  }

  /* ---------- 7. 예약 폼 ---------- */
  function initReserveForm() {
    var form = document.getElementById("reserveForm");
    if (!form) return;

    var dateInput = form.elements.date;
    if (dateInput) {
      var t = new Date();
      var iso = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
      dateInput.min = iso;
    }

    function setError(field, msg) {
      var wrap = field.closest(".field");
      var err = wrap ? wrap.querySelector(".field__err") : null;
      if (wrap) wrap.classList.toggle("has-error", Boolean(msg));
      if (err) err.textContent = msg || "";
    }

    function validate() {
      var ok = true;
      var name = form.elements.name;
      var phone = form.elements.phone;
      var date = form.elements.date;

      if ((name.value || "").trim().length < 2) { setError(name, "이름을 2자 이상 입력해 주세요."); ok = false; }
      else setError(name, "");

      var digits = (phone.value || "").replace(/[^0-9]/g, "");
      if (digits.length < 9 || digits.length > 11) {
        setError(phone, "연락처를 정확히 입력해 주세요. (예: 010-0000-0000)");
        ok = false;
      } else setError(phone, "");

      if (!date.value) { setError(date, "희망 날짜를 선택해 주세요."); ok = false; }
      else if (date.value < date.min) { setError(date, "오늘 이후 날짜로 선택해 주세요."); ok = false; }
      else setError(date, "");

      return ok;
    }

    ["name", "phone", "date"].forEach(function (key) {
      var el = form.elements[key];
      if (el) el.addEventListener("input", function () { setError(el, ""); });
    });

    var sent = document.getElementById("sent");
    var sentText = document.getElementById("sentText");
    var closeBtn = document.getElementById("sentClose");
    var copyBtn = document.getElementById("copyBtn");
    var lastFocus = null;

    function closePanel() {
      if (!sent || sent.hidden) return;
      sent.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstError = form.querySelector(".has-error input, .has-error select");
        if (firstError) firstError.focus();
        return;
      }

      var d = form.elements;
      var dateLabel = d.date.value.replace(/-/g, ".");
      var lines = [
        "[살롱 뮤즈 예약 문의]",
        "· 이름: " + d.name.value.trim(),
        "· 연락처: " + d.phone.value.trim(),
        "· 시술: " + d.service.value,
        "· 디자이너: " + d.designer.value,
        "· 희망 일시: " + dateLabel + " " + d.time.value,
        "· 요청: " + ((d.memo.value || "").trim() || "없음")
      ];

      sentText.textContent = lines.join("\n");
      lastFocus = document.activeElement;
      sent.hidden = false;
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    });

    if (closeBtn) closeBtn.addEventListener("click", closePanel);

    if (sent) {
      sent.addEventListener("click", function (e) {
        if (e.target === sent) closePanel();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanel();
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var text = sentText.textContent;
        var done = function () {
          copyBtn.textContent = "복사했어요";
          window.setTimeout(function () { copyBtn.textContent = "내용 복사"; }, 1800);
        };
        var fallback = function () {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(); } catch (err) { copyBtn.textContent = "복사 실패"; }
          document.body.removeChild(ta);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(fallback);
        } else {
          fallback();
        }
      });
    }
  }

  /* ---------- 8. 부드러운 앵커 이동 ---------- */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var head = document.getElementById("head");
      var offset = (head ? head.offsetHeight : 0) + 6;
      var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      history.replaceState(null, "", id);
    });
  }

  function boot() {
    initHours();
    initHeader();
    initMobileNav();
    initReveal();
    initLightbox();
    initDesignerLinks();
    initReserveForm();
    initAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
