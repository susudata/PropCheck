# WF_MVP_Scoping

**Cel:** Drastyczne cięcie funkcji produktu do absolutnego, technicznego minimum, które pozwala Solo-Devowi walidować hipotezę rynkową w 4-8 tygodniach bez bankructwa.

---

## **1. Fundamentalna Zasada (The Law of MVP)**

> **MVP to nie "wersja 0.1" Twojego marzenia. To najmniejsza możliwa instancja, która pozwala Ci odpowiedzieć na jedno konkretne pytanie biznesowe: "Czy ludzie chcą zapłacić za rozwiązanie tego problemu?"**

Wszystko poza tym jest _waste_.

---

## **2. Faza Audytu Funkcji (Feature Execution Order)**

Zanim zaproponujesz cokolwiek, musisz przeanalizować całą listę funkcji i przefiltrowywać ją przez cztery pytania:

### **Pytanie 1: "Czy ta funkcja jest niezbędna do dostarczenia Wartości #1?"**
- Jeśli **NIE** → Usuń.
- Jeśli **TAK, ale pracuje bez niej** → Zaznacz jako "Post-MVP" (faza 2, 3+).

### **Pytanie 2: "Czy mogę to zbudować w mniej niż 4 godziny?"**
- Jeśli **NIE** → Szukaj "hacka" (API third-party, pre-built components, no-code), albo usuń.
- Jeśli **TAK** → Warunkowy admit.

### **Pytanie 3: "Czy bez niej tracę klienta w momencie onboardingu?"**
- Jeśli **TAK** → Musi być w MVP.
- Jeśli **NIE** → Post-MVP.

### **Pytanie 4: "Czy mogę to zvalidować bez budowy?"**
- (np. formularze, design mockupy, ręczne demo) → Jeśli **TAK**, wypchnij do fazy "Manual Operation".

---

## **3. Struktura MVP (The Core Architecture)**

### **Tier 1: Must-Have (0-4 tygodnie)**
Funkcje niezbędne do pierwszego walidacyjnego rundy z 10-20 early-adopters.

| Kategoria | Co to jest | Przykład |
|-----------|-----------|---------|
| **Onboarding** | Minimum do rejestracji i first-use value | Email + password (nie OAuth jeszcze) |
| **Core Feature** | Jedno, JEDNO rozwiązanie problemu | Jeśli SaaS to generator raportu → generator raportu w czystym tekście/PDF |
| **Data Input** | Jak użytkownik dostarcza dane | Formularz, CSV, API webhook |
| **Data Output** | Jak użytkownik otrzymuje wartość | Email, eksport, dashboard read-only |
| **Billing** | Minimalny system płatności | Stripe Checkout (nie self-hosted Paddle, nie subskrypcje) |

### **Tier 2: Should-Have (4-8 tygodnie)**
Po zebraniu feedbacku, dodaj:
- Integracje (np. Zapier, Slack, Gmail)
- Zaawansowane opcje dla Power Userów
- Analytics/tracking (tylko do optymalizacji, nie "piękne dashboardy")

### **Tier 3: Nice-to-Have (Post-Launch)**
- Dark Mode, Mobilne UI, Advanced Reporting, Community Features
- Wszystko, co nie wpływa bezpośrednio na to, czy użytkownik zapłaci.

---

## **4. Proces Cięcia Funkcji (The Brutal Cuts)**

### **A. Mapa Techniczny MVP**

Dla każdej zaproponowanej funkcji stwórz tabelę:

| Funkcja | Tier | Czas (h) | Cut? | Alternatywa / Hack |
|---------|------|----------|------|-------------------|
| User Authentication | 1 | 2 | ❌ | Email/Password (nie OAuth) |
| Social Login | 2 | 4 | ✅ CUT | Dodaj w Tier 2 |
| Admin Dashboard | 3 | 12 | ✅ CUT | Nie potrzebujesz tego teraz |
| Report Generation | 1 | 6 | ❌ | Jeśli to core feature |
| Email Notifications | 1 | 2 | ❌ | SendGrid API (basic template) |
| Scheduled Tasks | 2 | 8 | ✅ CUT | Cron job na serveriez lub Zapier |
| Advanced Analytics | 3 | 20 | ✅ CUT | Posthaven/Mixpanel w Tier 2 |
| Customer Support Chat | 3 | 40 | ✅ CUT | Email + Slack DM na start |

### **B. "The 80/20 Question"**

Dla każdego feature spytaj:
> _"Czy mogę dostarczyć 80% wartości dla użytkownika, obcinając 80% złożoności technicznej?"_

**Przykłady:**
- Zamiast "zaawansowanego systemu uprawnień" → Wszystkie użytkownicy mają dostęp (prototyp).
- Zamiast "beautifulnego, responsywnego UI" → Funkcjonalne, mobile-unfriendly, ale pracuje.
- Zamiast "complex data sync" → Batch upload CSV raz dziennie.

---

## **5. Szablon Output'u (MVP Scope Document)**

Zaproponuj użytkownikowi dokument zawierający:

```
## 🎯 MVP Scope: [Nazwa Produktu]

### Target Metrics (Co chcesz walidować?)
- [ ] Czy 10 użytkowników zapłaci $29/mo?
- [ ] Czy time-to-value wynosi <5 minut?
- [ ] Czy churn to <10% miesięcznie?

### Core Loop (User Journey w MVP)
1. Sign-up (email + hasło) → 1 minut
2. Upload data / Connect (CSV lub form) → 2 minuty
3. Receive value (Generowanie outputu) → <30 sekund
4. Export / Share → 1 minuta

### Tier 1 Features (Must-Have)
- [ ] User Registration (Email + Password)
- [ ] [CORE FEATURE #1]: [Opis]
- [ ] [CORE FEATURE #2]: [Opis]
- [ ] Basic Email Confirmation
- [ ] Stripe Checkout (One-Time or Sub)
- [ ] Output Export (PDF/CSV/Email)

**Total Build Time: [X] hours**

### Tier 2 Features (First Update - po feedbacku)
- [ ] OAuth Integration (Google/GitHub)
- [ ] Zapier/Make Integration
- [ ] Advanced Filtering/Options
- [ ] Basic Analytics Dashboard

### 🚨 What's Intentionally Cut
- Dark Mode (Tier 3)
- Mobile App (Tier 3)
- Advanced Permissioning (Tier 3)
- Custom Branding (Tier 3)
- 24/7 Support (Hire when you have users paying)

### Tech Stack (Solo-Dev Optimized)
- **Backend:** [Framework] (simplest option)
- **Database:** PostgreSQL or Firebase (managed)
- **Payment:** Stripe Checkout
- **Hosting:** Vercel / Railway / Heroku free tier
- **Auth:** NextAuth / Simple JWT
- **Email:** SendGrid (free tier)
```

---

## **6. Red Lines (What You Can't Cut)**

Jednak **MUSZĄ** być w MVP:

1. ✅ **Działający core feature** – Produkt musi rzeczywiście rozwiązywać problem.
2. ✅ **Prawidłowa walidacja danych** – Jeśli użytkownik wprowadzi śmieci, system musi to obsłużyć bez crash'u.
3. ✅ **Bezpieczeństwo danych** – HTTPS, hashed passwords, basic GDPR compliance.
4. ✅ **Działająca płatność** – Bez tego nie wiesz, czy ktoś zapłaci.
5. ✅ **Opłacalna hosting** – Nie powinna kosztować Cię >$20/miesiąc na starcie.

---

## **7. Checklist Gotowości do Startu**

Zanim zatwierdzisz MVP scope, sprawdź:

- [ ] Całkowity time estimate nie przekracza 200 godzin.
- [ ] 60%+ czasu pójdzie na core feature, nie infrastructure.
- [ ] Masz plan, jak pozyskać 10-20 beta-testers bez budżetu.
- [ ] Umiesz wyjaśnić, co robi Twój produkt w 1 zdaniu.
- [ ] Wiesz, za co ludzie będą płacić ($X/miesiąc).
- [ ] Masz Plan B, jeśli hipoteza się nie potwierdzi.

---

## **8. Procedura Monitorowania (Post-Launch)**

Po starcie MVP śledź:

1. **Time-to-First-Value:** Czy średni nowy użytkownik widzi wartość w <5 minut?
2. **Churn:** Jaki % użytkowników rezygnuje w ciągu miesiąca?
3. **Feature Requests:** Które 3 funkcje najczęściej są proszę dodane?
4. **Support Load:** Czy wspierasz produkt, czy produkt wspiera się sam?

**Decyzja:**
- Jeśli metrics są dobrze → Scale (dodaj Tier 2, pozyskaj więcej klientów).
- Jeśli metrics są słabe → Pivot lub Kill (nie wyrzucaj zasobów w dziurę).

---

## **Instrukcja dla Agentów (do wklejenia w system prompt):**

> Kiedy użytkownik wywoła `WF_MVP_Scoping`, Twoim celem jest zredukowanie ambicji. Słuchaj uważnie: jeśli deweloper wymienia >10 funkcji, natychmiast zadaj pytanie: _"Którą z tych funkcji będzie miał użytkownik, kiedy będzie rozważać opłacenie Ci $29/miesiąc?"_. Każdą funkcję, którą nie potrafi uzasadnić tą logiką, poddaj pod głosowanie. Bądź brutalni. Czas Solo-Deva to najprzedniejszy zasób – nie pozwól mu marnować go na features, które mogą czekać.
