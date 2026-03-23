# 🎯 MVP Scope: PropCheck

**Cel:** Drastyczne cięcie funkcji do absolutnego minimum, które pozwoli walidować hipotezę rynkową w 4-8 tygodni.

---

## Target Metrics (Co chcesz walidować?)

| Metryka | Cel | Hipoteza |
|---------|-----|----------|
| **Willingness-to-Pay** | 5 użytkowników zapłaci 49 PLN/mies. | Landlordzi zapłacą za porządek w usterkach |
| **Time-to-First-Value** | < 2 minuty | Użytkownik doda pierwsze zgłoszenie w < 2 min od rejestracji |
| **Retention** | 30% wraca po 7 dniach | Wartość jest na tyle wysoka, że użytkownicy chcą wracać |
| **Activation** | 50% dodaje ≥ 3 zgłoszenia w 14 dni | Produkt rozwiązuje realny problem |

---

## Core Loop (User Journey w MVP)

```
1. Sign-up (email + hasło) → 1 minuta
2. Dodaj pierwsze mieszkanie (nazwa/adrres) → 30 sekund
3. Dodaj zgłoszenie (zdjęcie + opis + lokalizacja na rzutce) → 2 minuty
4. Zobacz na liście → sukces! → 30 sekund
```

Czas do pierwszej wartości: **~4 minuty** (akceptowalne, cel < 5 min)

---

## Tier 1 Features (Must-Have)

### Onboarding & Autoryzacja

| Funkcja | Czas (h) | Cut? | Alternatywa / Hack |
|---------|----------|------|-------------------|
| User Registration (Email + Password) | 2 | ❌ | Basic JWT, nie OAuth |
| Email Confirmation | 1 | ✅ CUT | Skip, wyślij link aktywacyjny w dev |
| Password Reset | 2 | ✅ CUT | Manualnie przez admin w fazie walidacji |

### Core Feature: Dodawanie i lista usterek

| Funkcja | Czas (h) | Cut? | Alternatywa / Hack |
|---------|----------|------|-------------------|
| Dodawanie usterki (zdjęcie + opis) | 4 | ❌ | Core feature - musi działać |
| Lista wszystkich usterek | 2 | ❌ | Lista prosta, bez paginacji |
| Statusy usterek (nowe/w trakcie/gotowe) | 2 | ❌ | Enum w bazie, proste UI |
| Usuwanie/usuwanie zgłoszeń | 1 | ✅ CUT | Tylko zmiana statusu, nie usuwanie |

### Zarządzanie Mieszkaniami

| Funkcja | Czas (h) | Cut? | Alternatywa / Hack |
|---------|----------|------|-------------------|
| Lista mieszkań | 2 | ❌ | Prosta lista, bez szczegółów |
| Dodawanie mieszkania | 1 | ❌ | Tylko nazwa + adres |
| Upload rzutu mieszkania | 4 | ✅ CUT (v1) | Zamiast tego: manualne wpisywanie lokalizacji tekstowo |
| Pinezkowanie na rzutce | 8 | ✅ CUT (v1) | Wersja 1: lista, nie wizualizacja |

### Export i Output

| Funkcja | Czas (h) | Cut? | Alternatywa / Hack |
|---------|----------|------|-------------------|
| PDF Export (lista usterek) | 6 | ✅ CUT (v1) | Zamiast tego: HTML print view |
| Email z raportem | 2 | ✅ CUT | Tylko widok w apce |

### Billing

| Funkcja | Czas (h) | Cut? | Alternatywa / Hack |
|---------|----------|------|-------------------|
| Stripe Checkout (subskrypcja) | 4 | ❌ | Tylko 1 plan: 49 PLN/mies |
| Customer Portal | 2 | ✅ CUT | Link do faktur w email |
| Webhook płatności | 2 | ❌ | Potrzebne do walidacji |

---

## The Brutal Cuts (Co eliminujemy z MVP v1)

### 🚨 What's Intentionally Cut

| Funkcja | Powód cięcia |
|---------|--------------|
| **OAuth (Google/FB login)** | Wydaje mi 4h, email+password wystarcza |
| **Upload rzutu mieszkania** | Wydaje 4h+, można w v2 |
| **Pinezkowanie na rzutce** | Wydaje 8h+, to "wow feature", nie must-have |
| **PDF Export** | Wydaje 6h, zastąp print.css |
| **Mobile App / PWA** | Web mobile-friendly wystarcza |
| **Dark Mode** | Tier 3, nie wpływa na płatność |
| **Role Management** | Wszyscy użytkownicy mają pełny dostęp |
| **Team seats** | Single user w v1 |
| **Zapier/Slack integration** | Tier 2 |
| **Email notifications** | Dashboard wystarcza |
| **24/7 Support** | Email support wystarcza |
| **API** | Nie v1 |
| **SSO/SAML** | Nie v1 |
| **Multi-language (EN)** | Tylko PL |

---

## MVP v1 - Build Time Estimate

| Etap | Czas (h) |
|------|----------|
| Setup projektu (Next.js + Supabase) | 4 |
| Auth (JWT basic) | 2 |
| CRUD mieszkania | 3 |
| CRUD usterki + statusy | 6 |
| Lista usterek + filtry | 4 |
| Stripe Integration | 4 |
| Podstawowy UI/styling | 4 |
| Dashboard stats (prosty) | 2 |
| **Total** | **29h** |

**Czas realizacji:** ~1 tydzień ( przy 4-5h/dzień)

---

## Tier 2 Features (First Update - po walidacji)

Dodaj po uzyskaniu 5+ płacących użytkowników:

- [ ] Upload rzutu mieszkania (image upload)
- [ ] Pinezkowanie na rzutce (canvas/interactive)
- [ ] PDF Export (jsPDF lub react-pdf)
- [ ] OAuth (Google login)
- [ ] Podstawowe Analytics (Posthaven)
- [ ] Email notifications (SendGrid)

---

## Tier 3 Features (Post-Launch)

- Dark Mode
- Mobile App / PWA
- Role Management (admin/ekipa)
- Team seats (wielu użytkowników)
- Integracje (Zapier, Slack)
- Marketplace ekip
- Multi-language

---

## Tech Stack (Solo-Dev Optimized)

| Element | Wybór | Uzasadnienie |
|---------|-------|--------------|
| **Frontend** | Next.js (App Router) | Szybki start, full-stack w jednym |
| **Backend** | Next.js API Routes | Bez osobnego backendu |
| **Database** | Supabase (PostgreSQL) | Free tier, gotowy Auth + Storage |
| **Auth** | Supabase Auth (email) | Proste, gotowe |
| **Payment** | Stripe Checkout | Tylko 1 plan, najprostsze |
| **Hosting** | Vercel | Free tier, auto-deploy |
| **Storage** | Supabase Storage | Do zdjęć usterek |
| **Email** | Resend | Free tier (3k/mies) |
| **Analytics** | PostHog (free) | Event tracking |

**Szacowany miesięczny koszt startowy: $0-20**

---

## Red Lines (What You Can't Cut)

✅ **Działający core feature** – Dodawanie usterek z zdjęciami i statusami musi działać  
✅ **Prawidłowa walidacja danych** – Błędy uploadu obsłużone bez crash'u  
✅ **Bezpieczeństwo danych** – HTTPS, hashed passwords (Supabase)  
✅ **Działająca płatność** – Stripe Checkout gotowy przed startem  
✅ **Opłacalna hosting** – Vercel + Supabase free tier = $0/mies  

---

## Checklist Gotowości do Startu

- [x] Całkowity time estimate nie przekracza 200 godzin (**29h**)
- [x] 60%+ czasu pójdzie na core feature, nie infrastructure
- [x] Masz plan, jak pozyskać 10-20 beta-testers bez budżetu (cold DM do landlordów)
- [x] Umiesz wyjaśnić, co robi Twój produkt w 1 zdaniu: "WhatsApp dla usterek — jedno miejsce na zgłoszenia, statusy i raporty dla ekip"
- [x] Wiesz, za co ludzie będą płacić (49 PLN/mies = ~$12)
- [x] Masz Plan B, jeśli hipoteza się nie potwierdzi (pivot do innej niszy lub kill)

---

## Procedura Monitorowania (Post-Launch)

Po starcie MVP śledź:

| Metryka | Cel | Co robić |
|---------|-----|----------|
| **Time-to-First-Value** | < 5 min | Jeśli > 5 min = uprosić onboarding |
| **Churn** | < 10%/mies | Jeśli > 10% = brak product-market-fit |
| **Feature Requests** | Top 3 | Głosować, co dodawać w Tier 2 |
| **Support Load** | < 2h/dzień | Jeśli więcej = za dużo manualnej pracy |

**Decyzja po 4-8 tygodniach:**
- ✅ **Metrics good** → Scale (Tier 2 + więcej użytkowników)
- ❌ **Metrics weak** → Pivot lub Kill (nie wyrzucaj zasobów)

---

## Alternatywne podejście: MVP bez kodu (Manual Concierge)

Jeśli 29h to za dużo na start, rozważ:

```
Tydzień 1-2: Manual Concierge
- Ty obsługujesz 5 użytkowników przez WhatsApp
- Oni wysyłają zgłoszenia, Ty wprowadzasz do Notion/Airtable
- Generujesz raporty ręcznie
- Cena: 49 PLN/mies (prepaid)
- Cel: validation of willingness-to-pay BEZ budowy
```

**Zalet:** 0h develop time, instant feedback
**Wad:** Nie skalowalne, alew aduje realną wartość

---

## [RISKS] — Czerwone flagi MVP

| Ryzyko | Poziom | Komentarz |
|--------|--------|-----------|
| **Brak diferenciacji** | 🔴 Wysokie | Bez rzutki i pinezek = czy to tylko lista zgłoszeń? |
| **Willingness-to-pay test** | 🔴 Wysokie | Płacą za "porządek" czy za "fajne pinezki"? |
| **Too basic** | 🟡 Średnie | Może być za proste dla 15-50 mieszkań segmentu |
| **Too manual setup** | 🟡 Średnie | Jeśli onboarding > 3 min, rezygnacja |

---

## Podsumowanie MVP v1

```
PropCheck MVP v1 = Lista usterek + Statusy + 49 PLN/mies

To minimum pozwala odpowiedzieć na pytanie:
"Czy landlordzi zapłacą 49 PLN/mies za uporządkowanie zgłoszeń?"

Jeśli TAK → Dodaj rzutki i pinezki (Tier 2)
Jeśli NIE → Pivot lub Kill
```

---

## Sugerowany next step

**Uruchom Manual Concierge w 1 dzień:**
1. Stwórz prosty Notion/Airtable z bazą usterek
2. Znajdź 5 zarządców do testu
3. Obsługuj ich przez WhatsApp przez 2 tygodnie
4. Zbierz feedback o willingnes-to-pay

To da odpowiedź w 2 tygodnie zamiast 8.