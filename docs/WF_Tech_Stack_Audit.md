# 🎯 WF_Tech_Stack_Audit — PropCheck

**Data audytu:** 2026-03-23  
**Status:** MVP w fazie koncepcji  
**Cel:** Optymalizacja stacka pod kątem szybkości MVP (4-8 tygodni) i minimalnych kosztów operacyjnych.

---

## 1. Obecny Stack — Inwetaryzacja

| Warstwa | Obecny wybór | Status | Zgodność z MVP |
|---------|--------------|--------|----------------|
| **Frontend** | React JS (SPA) | ✅ OK | Wymaga迁移 do Next.js |
| **Styling** | Tailwind CSS + shadcn/ui | ✅ OK | Idealny wybór |
| **Backend** | BRAK (klient mówi o Supabase) | ⚠️ Niejasny | React SPA potrzebuje backend/API |
| **Database** | Supabase (PostgreSQL) | ✅ OK | Free tier, gotowy Auth |
| **Auth** | Supabase Auth | ✅ OK | Email + future OAuth |
| **Storage** | Supabase Storage | ✅ OK | Do zdjęć usterek |
| **Payments** | NIE WYBRANY | 🔴 BRAK | Stripe potrzebny |
| **Email** | NIE WYBRANY | ⚠️ BRAK | Resend polecany |
| **PDF Export** | jsPDF / html2canvas | ✅ OK | Client-side, darmowe |
| **Analytics** | NIE WYBRANY | ⚠️ BRAK | PostHog polecany |
| **Hosting** | NIE WYBRANY | ⚠️ BRAK | Vercel polecany |

---

## 2. Analiza 4 Osi (Evaluation Framework)

### A. Frontend: React SPA → Next.js

| Oś | Ocena | Uzasadnienie |
|----|-------|--------------|
| **TTI** (Time-to-Implement) | 7/10 | React SPA wymaga osobnego backendu. Next.js = 2x szybciej (API routes). |
| **OB** (Operational Burden) | 6/10 | SPA ma dobre DX, ale brak SSR = gorsze SEO + cold start. |
| **CS** (Cost Scaling) | 7/10 | Vercel free tier = $0 do 100k visits. Skaluje się liniowo. |
| **DF** (Developer Familiarity) | 8/10 | Zakładam mid-level JS dev. |

**Średnia:** 7.0/10

**REKOMENDACJA:** Migracja do **Next.js 14 (App Router)**. API routes eliminują potrzebę osobnego backendu.

---

### B. Database: Supabase PostgreSQL

| Oś | Ocena | Uzasadnienie |
|----|-------|--------------|
| **TTI** | 9/10 | 0h setup. Free tier gotowy. Auth, Storage, DB = jedno kliknięcie. |
| **OB** | 9/10 | Managed service. Automated backups. Zero maintenance. |
| **CS** | 8/10 | Free tier: 500MB DB, 1GB storage, 50k monthly users. Potem $25/mo. |
| **DF** | 8/10 | Standard PostgreSQL. Łatwy do nauczenia. |

**Średnia:** 8.5/10

**WERDYKT:** ⭐ **OPTYMALNY WYBÓR** — Nie zmieniać.

---

### C. Auth: Supabase Auth

| Oś | Ocena | Uzasadnienie |
|----|-------|--------------|
| **TTI** | 9/10 | 1h implementacja email login. OAuth (Google) = +2h. |
| **OB** | 8/10 | Managed. RLS (Row Level Security) = bezpieczeństwo bez boilerplate. |
| **CS** | 9/10 | Free tier do 50k monthly active users. |
| **DF** | 8/10 | Proste API. Docs świetne. |

**Średnia:** 8.5/10

**WERDYKT:** ⭐ **OPTYMALNY WYBÓR** — Supabase Auth idealny dla MVP.

---

### D. Payments: BRAK → Stripe

| Oś | Ocena | Uzasadnienie |
|----|-------|--------------|
| **TTI** | 7/10 | Stripe Checkout = 4h. Webhook handling = +2h. |
| **OB** | 7/10 | Trzeba ogarnąć webhooki + subscription lifecycle. |
| **CS** | 6/10 | 2.9% + $0.30 per transaction. Przy 100 users × 49 PLN = ~$15/mies. |
| **DF** | 7/10 | Standard w SaaS. Dużo tutoriali. |

**Średnia:** 6.75/10

**WERDYKT:** ✅ **WYMAGANY DO MVP** — Stripe Checkout to standard.

---

### E. PDF Export: jsPDF / html2canvas

| Oś | Ocena | Uzasadnienie |
|----|-------|--------------|
| **TTI** | 8/10 | Client-side = 0h backend time. 6h na ładny PDF. |
| **OB** | 9/10 | Zero server-side processing. Przeglądarka generuje PDF. |
| **CS** | 10/10 | Free. Nie płacisz za żądania. |
| **DF** | 7/10 | Biblioteki do nauczenia, ale proste API. |

**Średnia:** 8.5/10

**WERDYKT:** ⭐ **OPTYMALNY DLA MVP** — CUT z MVP v1 (zastąp print.css).

---

### F. Analytics: BRAK → PostHog

| Oś | Ocena | Uzasadnienie |
|----|-------|--------------|
| **TTI** | 8/10 | 30 min embed code. Self-hostable lub cloud. |
| **OB** | 8/10 | Self-hosted = darmowy. Cloud = $0 do 1M events. |
| **CS** | 9/10 | Free tier bardzo hojny. |
| **DF** | 7/10 | Events + session recording = wszystko co potrzeba. |

**Średnia:** 8.0/10

**WERDYKT:** ✅ **DODAJ PO LAUNCH** — Śledź `first_report_created`, `subscription_created`.

---

### G. Email: BRAK → Resend

| Oś | Ocena | Uzasadnienie |
|----|-------|--------------|
| **TTI** | 8/10 | 1h setup (API key + React Email). |
| **OB** | 9/10 | Managed service. High deliverability. |
| **CS** | 9/10 | Free tier: 3,000 emails/month. Potem $20/mo za 50k. |
| **DF** | 7/10 | Proste API. |

**Średnia:** 8.25/10

**WERDYKT:** ✅ **DODAJ DO MVP v1** — Potrzebny do onboarding emails.

---

## 3. Podsumowanie Ocen Stacka

| Komponent | Obecny | Rekomendacja | Score | Decyzja |
|-----------|--------|--------------|-------|---------|
| **Frontend** | React SPA | Next.js 14 | 7.0 | 🔄 MIGRATE |
| **Database** | Supabase | ✅ ZOSTAWIĆ | 8.5 | ⭐ KEEP |
| **Auth** | Supabase | ✅ ZOSTAWIĆ | 8.5 | ⭐ KEEP |
| **Payments** | BRAK | Stripe | 6.75 | 🔴 ADD |
| **Storage** | Supabase | ✅ ZOSTAWIĆ | 8.5 | ⭐ KEEP |
| **PDF** | jsPDF | Print CSS first | 8.5 | 🔄 REFACTOR |
| **Analytics** | BRAK | PostHog (later) | 8.0 | ⏳ POST-LAUNCH |
| **Email** | BRAK | Resend | 8.25 | ✅ ADD |
| **Hosting** | BRAK | Vercel | 9.0 | ✅ ADD |

---

## 4. [RED FLAGS] — Działaj Teraz

### 🚨 1. Brak wybranego hostingu (Vercel)

**Problem:** Gdzie deployujesz aplikację?

**Rozwiązanie:** Vercel (free tier dla Next.js).

**Czas:** 30 min.

**Koszt:** $0/mo do 100k visits.

---

### 🚨 2. React SPA wymaga osobnego backendu

**Problem:** SPA nie ma SSR ani API routes. Potrzebujesz backend do Stripe, email, itp.

**Rozwiązanie:** Migracja do Next.js App Router.

**Czas:** 8-16h (zależy od wielkości kodu).

**Uzasadnienie:** Next.js API routes = backend bez dodatkowego serwera.

---

### 🚨 3. Brak Stripe integration

**Problem:** MVP bez płatności = 0 przychodów.

**Rozwiązanie:** Stripe Checkout + webhook handling.

**Czas:** 6-8h.

**Koszt:** 2.9% + $0.30 per transaction.

---

## 5. [YELLOW FLAGS] — Monitoruj

### ⚠️ 1. Koszty Supabase przy wzroście

**Monitoruj:** Gdy >50 użytkowników → przesiadka na płatny tier ($25/mo).

**Akcja:** Ustaw alert na Supabase dashboard.

---

### ⚠️ 2. jsPDF → print.css (MVP cuts)

**Według WF_MVP_Scoping:** PDF export jest CUT z MVP v1.

**Alternatywa:** CSS `@media print` dla raportów. Prezentacja = print-friendly table.

**Akcja:** Nie buduj jsPDF w v1. Zastąp print-friendly view.

---

### ⚠️ 3. Vendor lock-in Supabase

**Ryzyko:** 100% zależność od Supabase.

**Mitigation:**
- Eksportuj dane regularnie (Supabase dashboard → SQL export).
- Używaj standardowego PostgreSQL (łatwa migracja do AWS RDS).

---

## 6. Migration Path — Rekomendowana Ścieżka

### PHASE 1: MVP Foundation (Week 1-2)
```
Obecne:
React SPA + (backend?)

Docelowe:
┌─────────────────────────────────────┐
│  Next.js 14 (App Router)           │
│  + Vercel (Hosting)                │
│  + Supabase (DB + Auth + Storage)  │
│  + Stripe Checkout (Payments)      │
│  + Resend (Email)                  │
└─────────────────────────────────────┘
```
**Czas:** ~20h (setup + auth + basic CRUD)

---

### PHASE 2: MVP Launch (Week 3-4)
```
Dodaj:
+ Dashboard z listą usterek
+ Status tracking (enum: new/in_progress/done)
+ Basic filtering
+ Stripe webhook handling
+ Onboarding email (Resend)
```

**Czas:** ~30h

---

### PHASE 3: Post-Launch (After 5 paying users)
```
Dodaj:
+ Upload rzutu mieszkania
+ Pin positioning (canvas)
+ Print-friendly reports
+ PostHog analytics
```

**Czas:** ~40h

---

## 7. Finalny Stack — Rekomendacja

```
┌──────────────────────────────────────────────────┐
│  FRONTEND        Next.js 14 (App Router)         │
│  HOSTING         Vercel (free tier)              │
│  DATABASE        Supabase PostgreSQL (free tier)  │
│  AUTH            Supabase Auth (email)            │
│  STORAGE         Supabase Storage (1GB free)      │
│  PAYMENTS        Stripe Checkout (2.9% + $0.30)   │
│  EMAIL           Resend (3k free/month)            │
│  ANALYTICS       PostHog (self-hosted, free)      │
│  ERROR TRACKING  Sentry (free tier)               │
│  PDF EXPORT      Print CSS (MVP: skip jsPDF)      │
└──────────────────────────────────────────────────┘

💰 POCZĄTKOWY KOSZT: $0/mo (free tiers)
📈 PO 100 USERÓW: ~$25/mo (Supabase Pro)
🚀 MAINTENANCE: 2-3h/miesiąc
⏱️  TIME-TO-LAUNCH: 4-6 tygodni
```

---

## 8. Checklist Gotowości

- [x] **Time-to-Market:** 4-6 tygodni ✅
- [x] **Cost Predictability:** $0 → $25/mo → $50/mo (liniowy) ✅
- [x] **Backup Plan:** Supabase automated daily backups ✅
- [x] **Monitoring:** Sentry (free tier) ⏳ DO DODANIA
- [x] **Security:** HTTPS (Vercel), RLS (Supabase), hashed passwords ✅
- [x] **Scaling:** Vercel auto-scales, Supabase tier scaling ✅

---

## 9. Action Items (TODO)

| Priorytet | Zadanie | Czas | Status |
|-----------|---------|------|--------|
| 🔴 HIGH | Migracja React → Next.js 14 | 8-16h | ❌ TODO |
| 🔴 HIGH | Setup Vercel deployment | 1h | ❌ TODO |
| 🔴 HIGH | Stripe Checkout integration | 6-8h | ❌ TODO |
| 🟡 MED | Resend email setup | 2h | ❌ TODO |
| 🟡 MED | Sentry error tracking | 1h | ❌ TODO |
| 🟢 LOW | PostHog analytics | 1h | ⏳ POST-LAUNCH |

---

## 10. Konkluzja

**Werdykt:** Twój obecny stack (React + Supabase) jest **częściowo dobry**, ale wymaga:

1. **Migracji do Next.js** — eliminuje potrzebę osobnego backendu
2. **Dodania Stripe** — bez płatności nie ma biznesu
3. **Dodania Resend** — email onboarding wymagany
4. **Dodania Vercel** — hosting dla Next.js

**Stack Score:** 7.5/10 (po zmianach: 9/10)

**Red Lines (nie ruszaj):**
- ✅ Supabase (DB + Auth + Storage) — idealne dla MVP
- ✅ Tailwind + shadcn/ui — DX i UX top
- ✅ PostgreSQL foundation — łatwa migracja później

---

## Sugerowany next step

**Po ukończeniu MVP Scope → Zacznij od setup Next.js + Vercel + Supabase.**

Łączny czas: ~4h na działający boilerplate z auth.

---
