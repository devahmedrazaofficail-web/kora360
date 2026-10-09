/* ============================================================
   كورة 360 — Fixtures data + rendering engine
   ----------------------------------------------------------------
   HOW TO UPDATE:
   - Each fixture has: day (0=today, 1=tomorrow, 2=day after),
     time (KSA, 24h), league, country, home, away, broadcaster,
     venue, status ("upcoming" | "live" | "finished"),
     and optional score {h, a} when finished.
   - Saudi Pro League fixtures below are REAL (Round 8, verified
     Oct 2026 from sports press, KSA times). European fixtures are
     SAMPLE template data — replace with the real weekly schedule.
   - Team crests are CSS initial badges (no trademarked logos).
   ============================================================ */

const FIXTURES = [
  /* ---------- اليوم (day 0) — Friday ---------- */
  { day:0, time:"16:50", league:"الدوري السعودي", country:"السعودية",
    home:"الخلود", away:"القادسية", broadcaster:"ثمانية",
    venue:"ملعب الحزم، الرس", status:"upcoming" },
  { day:0, time:"17:55", league:"الدوري السعودي", country:"السعودية",
    home:"الفتح", away:"الأهلي", broadcaster:"ثمانية",
    venue:"ملعب الفتح، الأحساء", status:"upcoming" },
  { day:0, time:"21:00", league:"الدوري السعودي", country:"السعودية",
    home:"النصر", away:"الدرعية", broadcaster:"ثمانية",
    venue:"الأول بارك، الرياض", status:"upcoming", featured:true },
  { day:0, time:"21:30", league:"الدوري الألماني", country:"ألمانيا",
    home:"بوروسيا دورتموند", away:"فيردر بريمن", broadcaster:"beIN Sports",
    venue:"سيغنال إيدونا بارك", status:"upcoming" },
  { day:0, time:"21:45", league:"الدوري الفرنسي", country:"فرنسا",
    home:"لانس", away:"أولمبيك ليون", broadcaster:"beIN Sports",
    venue:"ملعب بولار", status:"upcoming" },
  { day:0, time:"22:00", league:"الدوري الإسباني", country:"إسبانيا",
    home:"مالقا", away:"إسبانيول", broadcaster:"beIN Sports",
    venue:"لا روزاليدا", status:"upcoming" },

  /* ---------- الغد (day 1) — Saturday ---------- */
  { day:1, time:"16:50", league:"الدوري السعودي", country:"السعودية",
    home:"الحزم", away:"نيوم", broadcaster:"ثمانية",
    venue:"ملعب الحزم، الرس", status:"upcoming" },
  { day:1, time:"17:55", league:"الدوري السعودي", country:"السعودية",
    home:"الاتفاق", away:"الخليج", broadcaster:"ثمانية",
    venue:"ملعب الاتفاق، الدمام", status:"upcoming" },
  { day:1, time:"21:00", league:"الدوري السعودي", country:"السعودية",
    home:"الهلال", away:"الاتحاد", broadcaster:"ثمانية",
    venue:"المملكة أرينا، الرياض", status:"upcoming", featured:true },
  { day:1, time:"19:30", league:"الدوري الإنجليزي", country:"إنجلترا",
    home:"أرسنال", away:"تشيلسي", broadcaster:"beIN Sports",
    venue:"الإمارات", status:"upcoming" },
  { day:1, time:"22:00", league:"الدوري الإيطالي", country:"إيطاليا",
    home:"إنتر ميلان", away:"نابولي", broadcaster:"beIN Sports",
    venue:"سان سيرو", status:"upcoming" },

  /* ---------- بعد الغد (day 2) — Sunday ---------- */
  { day:2, time:"16:40", league:"الدوري السعودي", country:"السعودية",
    home:"الفيحاء", away:"الرياض", broadcaster:"ثمانية",
    venue:"مدينة المجمعة الرياضية", status:"upcoming" },
  { day:2, time:"18:25", league:"الدوري السعودي", country:"السعودية",
    home:"أبها", away:"الفيصلي", broadcaster:"ثمانية",
    venue:"ملعب ضمك، خميس مشيط", status:"upcoming" },
  { day:2, time:"21:00", league:"الدوري السعودي", country:"السعودية",
    home:"الشباب", away:"التعاون", broadcaster:"ثمانية",
    venue:"ملعب الشباب، الرياض", status:"upcoming" },
  { day:2, time:"20:00", league:"الدوري المصري", country:"مصر",
    home:"الأهلي", away:"الزمالك", broadcaster:"أون سبورت",
    venue:"ستاد القاهرة", status:"upcoming", featured:true },
  { day:2, time:"22:00", league:"الدوري الإسباني", country:"إسبانيا",
    home:"ريال مدريد", away:"إشبيلية", broadcaster:"beIN Sports",
    venue:"سانتياغو برنابيو", status:"upcoming" },
];

/* ---------- Rendering ---------- */

/** Crest colors rotate per team name (stable hash → hue). */
function crestStyle(name){
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)) % 360;
  return `background:linear-gradient(135deg,hsl(${h} 55% 38%),hsl(${(h+40)%360} 60% 24%))`;
}

function teamInitial(name){
  return (name || "?").trim().charAt(0);
}

function statusBadge(f){
  if (f.status === "live")    return `<span class="status-badge status-live">جارية الآن</span>`;
  if (f.status === "finished")return `<span class="status-badge status-finished">انتهت</span>`;
  return `<span class="status-badge status-upcoming">قادمة</span>`;
}

function midBlock(f){
  if (f.status === "finished" && f.score)
    return `<div class="match-mid"><div class="match-score">${f.score.h} - ${f.score.a}</div><div class="match-vs">النتيجة</div></div>`;
  if (f.status === "live")
    return `<div class="match-mid"><div class="match-score" style="color:var(--red)">مباشر</div><div class="match-vs">${f.time}</div></div>`;
  return `<div class="match-mid"><div class="match-time">${f.time}</div><div class="match-vs">بتوقيت السعودية</div></div>`;
}

/** Render fixture cards into #matchesGrid for a given day offset (0/1/2). */
function renderFixtures(day, gridId = "matchesGrid"){
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const list = FIXTURES.filter(f => f.day === day);
  if (!list.length){
    grid.innerHTML = `<div class="empty-state">لا توجد مباريات مجدولة لهذا اليوم بعد — عد لاحقاً.</div>`;
    return;
  }
  grid.innerHTML = list.map((f, i) => `
    <article class="match-card" ${f.featured ? 'style="border-color:var(--orange-500)"' : ""}>
      <div class="match-top">
        ${statusBadge(f)}
        <span class="match-league">${f.country}، ${f.league}</span>
      </div>
      <div class="match-body">
        <div class="team">
          <span class="team-crest" style="${crestStyle(f.home)}">${teamInitial(f.home)}</span>
          <span class="team-name">${f.home}</span>
        </div>
        ${midBlock(f)}
        <div class="team">
          <span class="team-crest" style="${crestStyle(f.away)}">${teamInitial(f.away)}</span>
          <span class="team-name">${f.away}</span>
        </div>
      </div>
      <div class="match-meta">
        <span>📺 ${f.broadcaster}</span>
        <span>🏟 ${f.venue}</span>
      </div>
      <div class="match-cta">
        <button class="btn-match" data-fixture="${day}-${i}">تفاصيل المباراة</button>
      </div>
    </article>`).join("");

  grid.querySelectorAll("[data-fixture]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [d, idx] = btn.dataset.fixture.split("-").map(Number);
      openMatchModal(FIXTURES.filter(f => f.day === d)[idx]);
    });
  });
}

/** Arabic date label for a day offset, e.g. "الجمعة 9 أكتوبر". */
function dayLabel(offset){
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return new Intl.DateTimeFormat("ar-SA", { weekday:"long", day:"numeric", month:"long" }).format(d);
}
