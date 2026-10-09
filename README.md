# كورة 360 — Kora360 Static Website

موقع عربي (RTL) لجدول مباريات كرة القدم والأخبار — مبني بالكامل بـ **HTML + CSS + Vanilla JS** بدون أي فريمورك، جاهز للنشر على **Vercel** كموقع ثابت.

> **ملاحظة قانونية:** الموقع دليل للمواعيد والقنوات الرسمية والأخبار فقط — لا يستضيف أي بثوث للمباريات ولا يروّج لأي محتوى مقرصن.

## بنية المشروع

```
kora360-site/
├── index.html                    # الرئيسية (جدول المباريات + الأخبار + FAQ)
├── matches.html                  # جدول المباريات مع فلترة حسب البطولة
├── news.html                     # فهرس الأخبار
├── article-saudi-pro-league.html # مقال: الدوري السعودي
├── article-cairo-derby.html       # مقال: ديربي القاهرة
├── article-champions-league.html # مقال: دوري أبطال أوروبا
├── article-how-to-watch.html     # مقال: دليل المشاهدة
├── channels.html                 # دليل القنوات الناقلة الرسمية
├── about.html / contact.html / privacy.html / 404.html
├── assets/
│   ├── css/style.css             # كل التنسيقات (نظام ألوان: كحلي + برتقالي)
│   ├── js/fixtures.js            # بيانات المباريات + محرك العرض
│   ├── js/main.js                # التفاعلات (تبويبات، فلترة، نافذة التفاصيل، عدّاد)
│   └── img/                      # الصور المولّدة الأصلية
├── robots.txt / sitemap.xml / vercel.json
└── README.md / SEO-REPORT.md
```

## تحديث جدول المباريات

كل بيانات المباريات في `assets/js/fixtures.js` — مصفوفة `FIXTURES`:

```js
{ day:0, time:"21:00", league:"الدوري السعودي", country:"السعودية",
  home:"النصر", away:"الدرعية", broadcaster:"ثمانية",
  venue:"الأول بارك، الرياض", status:"upcoming" }
```

- `day`: `0` = اليوم، `1` = الغد، `2` = بعد الغد (التواريخ تُحسب تلقائياً بتوقيت الزائر).
- `time`: بتوقيت السعودية (GMT+3)، بصيغة 24 ساعة.
- `status`: `upcoming` | `live` | `finished` (مع `score:{h,a}` عند الانتهاء).
- مباريات الدوري السعودي الحالية حقيقية (الجولة 8، أكتوبر 2026) — حدّثها أسبوعياً.

## قبل النشر: استبدل الدومين

النطاق المؤقت المستخدم في `canonical` و`og:url` و`sitemap.xml` و`robots.txt` هو:

```
https://kora360.vercel.app/
```

ابحث عنه في كل الملفات واستبدله بدومينك الحقيقي:

```bash
grep -rl "kora360.vercel.app" . | xargs sed -i 's|kora360.vercel.app|YOUR-DOMAIN.com|g'
```

## النشر على Vercel (بدون Build)

1. ارفع مجلد `kora360-site` إلى مستودع Git (GitHub/GitLab).
2. في Vercel: **Add New → Project → Import** المستودع.
3. **Framework Preset:** اختر `Other`.
4. **Build Command:** اتركه فارغاً (بدون أمر بناء).
5. **Output Directory:** اتركه فارغاً (جذر المشروع).
6. اضغط **Deploy** — الموقع يعمل فوراً.
7. لربط دومين مخصص لاحقاً: **Settings → Domains → Add**.

ملف `vercel.json` يفعّل روابط نظيفة (`/matches` بدل `/matches.html`) — لا حاجة لأي إعداد إضافي.

## نموذج الاتصال

النموذج في `contact.html` يتحقق من البيانات في المتصفح فقط. لاستلام الرسائل فعلياً:

1. أنشئ حساباً مجانياً في [Formspree](https://formspree.io) واحصل على endpoint.
2. في `contact.html` غيّر `<form id="contactForm" novalidate>` إلى:
   `<form id="contactForm" action="https://formspree.io/f/YOUR_ID" method="POST" novalidate>`
3. في `assets/js/main.js` أضف إرسال `fetch` — أو ببساطة أزل `e.preventDefault()` بعد نجاح التحقق.

## تحسينات مقترحة لاحقاً

- ربط جدول المباريات بـ API رياضي حقيقي (يتطلب مفتاح API وباك-إند بسيط).
- إضافة صفحات بطولات منفصلة عند توسّع المحتوى.
- تفعيل Google Search Console وإرسال `sitemap.xml`.
