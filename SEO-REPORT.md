# كورة 360 — SEO Implementation Report

**Date:** 9 October 2026 · **Site:** https://kora360.vercel.app · **Target:** Saudi Arabia (ar-SA)

## 1. Reference analysis (Phase 1)

Reference: `tvkora360.site` (screenshot + homepage fetch). Useful patterns adopted: day tabs (yesterday/today/tomorrow), match cards (teams, time, league, CTA), news grid, keyword-rich footer. **Not copied:** no source code, text, branding art, or images were reused — all code, copy, and visuals are original. The fetch returned limited text (JS-heavy page), so the screenshot was the primary design reference; this is noted as an inspection gap.

**New color scheme (per request):** the competitor uses green — this build uses an original **deep navy (#0b1730) + vivid orange (#ff6b1a) + gold** identity with its own SVG logo mark.

## 2. Keyword research & intent (Phase 2)

- Primary: **كورة 360** (navigational/brand + "مباريات اليوم بث مباشر" intent).
- Secondary/semantic: مباريات اليوم، بث مباشر، مباريات الغد، الدوري السعودي، الدوري المصري، دوري أبطال أوروبا، القنوات الناقلة، kora360.
- SERP check confirmed the niche is crowded with lookalike domains (kora360tvs.com, 360kora-live.io…) — differentiation via original design, real weekly fixtures, and honest "official channels only" positioning.
- **No fabricated metrics:** no search volume / difficulty numbers are claimed.

## 3. Site architecture (12 pages, all original Arabic RTL content)

| Page | Purpose / target intent |
|---|---|
| `index.html` | مباريات اليوم + أخبار + FAQ (primary keyword) |
| `matches.html` | جدول المباريات + فلترة البطولات + SportsEvent schema |
| `news.html` | فهرس الأخبار (ItemList schema) |
| 4 articles | الدوري السعودي، ديربي القاهرة، دوري الأبطال، دليل المشاهدة (NewsArticle + HowTo) |
| `channels.html` | دليل القنوات الناقلة الرسمية (FAQ schema) |
| `about / contact / privacy / 404` | الثقة والقانونية؛ 404 = noindex |

## 4. Keyword density — homepage (exact match «كورة 360»)

- **Analyzed words:** 766 (visible body text; headings included; head/meta/alt/JSON-LD/scripts excluded)
- **Exact occurrences:** 4 → **density = 0.522%** ✅ within the 0.4–0.7% target
- Remaining occurrences are natural brand placements only (H1, section title, footer pill, copyright). Latin variant «kora360» appears in title/meta for brand search.

## 5. On-page SEO implemented

- Unique `<title>` + meta description + canonical (absolute) on every page; `lang="ar" dir="rtl"`; `robots` directives (404 = noindex).
- OG + Twitter cards with absolute image URLs; theme-color; SVG favicon.
- One H1 per page; logical H2/H3 hierarchy; descriptive Arabic alt text (keyword never stuffed in alts).
- BreadcrumbList on all inner pages; contextual internal linking (articles ↔ matches ↔ channels).
- `robots.txt` + `sitemap.xml` (11 URLs); clean URLs via `vercel.json` (no global rewrites).

## 6. Schema markup (all JSON-LD validated)

WebSite, Organization, WebPage, BreadcrumbList, FAQPage (home + channels), NewsArticle (4), HowTo (watch guide), SportsEvent (2 featured matches), ItemList (news index).

## 7. Performance & accessibility

- Zero frameworks: pure HTML/CSS/vanilla JS (2 small JS files, ~18KB total).
- Images: 6 original AI-generated visuals, compressed (71–162KB), lazy-loaded except hero (`fetchpriority="high"`).
- Semantic HTML, keyboard-accessible tabs/accordion/modal, visible focus rings, `prefers-reduced-motion` respected, 48px touch targets, no horizontal overflow (responsive breakpoints at 1024/720px).
- Fixture times in KSA (GMT+3); dates computed per visitor via `Intl.DateTimeFormat('ar-SA')`.

## 8. UI/UX improvements vs reference

1. Original navy/orange identity instead of the competitor's green.
2. Countdown timer to the next match + live-status badges.
3. League filter chips on the matches page.
4. Accessible match-detail modal (broadcaster, venue, time) instead of dead «stream soon» buttons.
5. FAQ accordions with FAQPage schema for rich results.
6. «Official channels only» honesty positioning + legal footer (no pirated streams — a deliberate liability decision).
7. Team crests as CSS initial badges (no trademarked logos).

## 9. Outstanding issues / owner tasks

1. ~~Replace placeholder domain~~ — done: site now uses `https://kora360.vercel.app` everywhere.
2. **Update `fixtures.js` weekly** — Saudi fixtures are real (Round 8, Oct 2026); European ones are clearly-marked sample data.
3. **Connect the contact form** to Formspree (instructions in README) — currently front-end validation only.
4. Submit `sitemap.xml` in Google Search Console after launch; add analytics if desired.
5. PageSpeed/Lighthouse not run in this environment — verify after deploy.

## 10. Test summary

- 19/19 project files present; 0 broken internal links; all images resolve.
- JSON-LD valid on all 11 schema pages; `vercel.json` valid; JS passes `node --check`.
- 16 fixtures validated (6 today / 5 tomorrow / 5 day-after), all required fields present.
- No build step, no backend, no database — deploys to Vercel as a static site.
