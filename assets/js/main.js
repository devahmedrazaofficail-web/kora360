/* ============================================================
   كورة 360 — Main interactions (vanilla JS, no libraries)
   - Mobile navigation toggle
   - Day tabs (yesterday/today/tomorrow) with Arabic date labels
   - League filter chips (matches page)
   - FAQ accordion (accessible)
   - Match detail modal (accessible dialog)
   - Countdown to next featured match
   - Back-to-top button + footer year
   - Contact form validation (front-end only)
   ============================================================ */
(function(){
  "use strict";

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav){
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => nav.classList.remove("open")));
  }

  /* ---------- Active nav link ---------- */
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".main-nav a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
  });

  /* ---------- Day tabs ---------- */
  const tabBtns = document.querySelectorAll(".tab[data-day]");
  function paintTabDates(){
    tabBtns.forEach(btn => {
      const day = parseInt(btn.dataset.day, 10);
      const label = btn.querySelector(".tab-date");
      if (label && typeof dayLabel === "function") label.textContent = dayLabel(day);
    });
  }
  function selectDay(day){
    tabBtns.forEach(b => {
      const active = parseInt(b.dataset.day, 10) === day;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    if (typeof renderFixtures === "function") renderFixtures(day);
    const title = document.getElementById("matchesTitle");
    if (title){
      const names = {0:"مباريات اليوم", 1:"مباريات الغد", 2:"مباريات بعد الغد"};
      title.textContent = names[day] || "مباريات اليوم";
    }
  }
  if (tabBtns.length){
    paintTabDates();
    tabBtns.forEach(btn => btn.addEventListener("click", () =>
      selectDay(parseInt(btn.dataset.day, 10))));
    selectDay(0);
  }

  /* ---------- League filter (matches page) ---------- */
  const chips = document.querySelectorAll(".filter-chip");
  const leagueFilterWrap = document.getElementById("leagueFilters");
  if (chips.length && leagueFilterWrap){
    chips.forEach(chip => chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const league = chip.dataset.league; // "all" or league name
      const activeDay = parseInt(
        (document.querySelector(".tab.active") || {}).dataset?.day || "0", 10);
      const grid = document.getElementById("matchesGrid");
      if (!grid || typeof FIXTURES === "undefined") return;
      const list = FIXTURES.filter(f =>
        f.day === activeDay && (league === "all" || f.league === league));
      // Temporarily render filtered list
      const keep = FIXTURES;
      try {
        renderFilteredList(grid, list, activeDay);
      } finally { /* keep is untouched; renderFixtures reads global */ }
    }));
  }
  function renderFilteredList(grid, list, day){
    if (!list.length){
      grid.innerHTML = `<div class="empty-state">لا توجد مباريات في هذه البطولة لهذا اليوم.</div>`;
      return;
    }
    const full = FIXTURES.filter(f => f.day === day);
    grid.innerHTML = list.map(f => {
      const i = full.indexOf(f);
      return `
      <article class="match-card">
        <div class="match-top">${statusBadge(f)}
          <span class="match-league">${f.country}، ${f.league}</span></div>
        <div class="match-body">
          <div class="team"><span class="team-crest" style="${crestStyle(f.home)}">${teamInitial(f.home)}</span>
            <span class="team-name">${f.home}</span></div>
          ${midBlock(f)}
          <div class="team"><span class="team-crest" style="${crestStyle(f.away)}">${teamInitial(f.away)}</span>
            <span class="team-name">${f.away}</span></div>
        </div>
        <div class="match-meta"><span>📺 ${f.broadcaster}</span><span>🏟 ${f.venue}</span></div>
        <div class="match-cta"><button class="btn-match" data-fixture="${day}-${i}">تفاصيل المباراة</button></div>
      </article>`;
    }).join("");
    grid.querySelectorAll("[data-fixture]").forEach(btn =>
      btn.addEventListener("click", () => {
        const [d, idx] = btn.dataset.fixture.split("-").map(Number);
        openMatchModal(FIXTURES.filter(f => f.day === d)[idx]);
      }));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
    });
  });

  /* ---------- Match detail modal ---------- */
  const overlay = document.getElementById("matchModal");
  window.openMatchModal = function(f){
    if (!overlay || !f) return;
    document.getElementById("modalTitle").textContent = `${f.home} × ${f.away}`;
    document.getElementById("modalTeams").innerHTML = `
      <div class="team"><span class="team-crest" style="${crestStyle(f.home)}">${teamInitial(f.home)}</span>
        <div class="team-name">${f.home}</div></div>
      <div class="modal-vs">×</div>
      <div class="team"><span class="team-crest" style="${crestStyle(f.away)}">${teamInitial(f.away)}</span>
        <div class="team-name">${f.away}</div></div>`;
    document.getElementById("modalRows").innerHTML = `
      <div class="detail-row"><span class="k">البطولة</span><span class="v">${f.league}</span></div>
      <div class="detail-row"><span class="k">الموعد</span><span class="v">${dayLabel(f.day)} — ${f.time} بتوقيت السعودية</span></div>
      <div class="detail-row"><span class="k">الملعب</span><span class="v">${f.venue}</span></div>
      <div class="detail-row"><span class="k">القناة الناقلة</span><span class="v">${f.broadcaster}</span></div>
      <div class="detail-row"><span class="k">الحالة</span><span class="v">${f.status==="live"?"جارية الآن":f.status==="finished"?"انتهت":"لم تبدأ بعد"}</span></div>`;
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
    overlay.querySelector(".modal-close").focus();
  };
  function closeModal(){
    if (!overlay) return;
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  }
  if (overlay){
    overlay.querySelector(".modal-close").addEventListener("click", closeModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
  }

  /* ---------- Countdown to next featured match ---------- */
  const cd = document.getElementById("countdown");
  if (cd && typeof FIXTURES !== "undefined"){
    const upcoming = FIXTURES.filter(f => f.status === "upcoming").sort((a,b) =>
      a.day - b.day || a.time.localeCompare(b.time))[0];
    if (upcoming){
      document.getElementById("cdMatch").textContent = `${upcoming.home} × ${upcoming.away}`;
      const target = new Date();
      target.setDate(target.getDate() + upcoming.day);
      const [hh, mm] = upcoming.time.split(":").map(Number);
      // KSA = UTC+3
      target.setUTCHours(hh - 3, mm, 0, 0);
      const tick = () => {
        let diff = Math.max(0, target - new Date());
        const h = Math.floor(diff / 36e5), m = Math.floor(diff % 36e5 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
        document.getElementById("cdH").textContent = String(h).padStart(2,"0");
        document.getElementById("cdM").textContent = String(m).padStart(2,"0");
        document.getElementById("cdS").textContent = String(s).padStart(2,"0");
      };
      tick();
      setInterval(tick, 1000);
    } else { cd.style.display = "none"; }
  }

  /* ---------- Back to top + year ---------- */
  const backTop = document.getElementById("backTop");
  if (backTop){
    window.addEventListener("scroll", () =>
      backTop.classList.toggle("show", window.scrollY > 600), { passive:true });
    backTop.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
  }
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- Contact form (front-end validation only) ---------- */
  const form = document.getElementById("contactForm");
  if (form){
    form.addEventListener("submit", e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach(input => {
        const field = input.closest(".field");
        const bad = !input.value.trim() ||
          (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
        field.classList.toggle("invalid", bad);
        if (bad) valid = false;
      });
      const done = document.getElementById("formDone");
      if (valid){
        form.reset();
        if (done) done.style.display = "block";
        if (done) done.scrollIntoView({ behavior:"smooth", block:"center" });
      }
    });
    // NOTE: this form validates in the browser only. To actually receive
    // messages, connect it to a form backend (e.g. Formspree) — see README.
  }
})();
