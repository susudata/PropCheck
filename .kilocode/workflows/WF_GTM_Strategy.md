```markdown
# WF_GTM_Strategy

**Cel:** Przygotowanie powtarzalnej, wykonawczej strategii Go‑To‑Market dla produktu SaaS, gotowej do wdrożenia przez zespół solo‑foundera lub mały zespół.

### **1. Szybkie założenia (Preflight)**

- **Produkt:** Krótki opis produktu i 1‑liner wartości.
- **Stage:** (Idea / MVP / Product‑market fit / Skalowanie)
- **Główny cel GTM:** (np. 100 płatnych użytkowników w 6 miesięcy)

### **2. Faza Badawcza (Discovery)**

- **ICP (Ideal Customer Profile):** opisz dokładnie branżę, rolę, wielkość firmy, ból, który produkt rozwiązuje.
- **Jobs To Be Done:** główny „job” klienta i alternatywne rozwiązania, które dziś wykorzystuje.
- **Wartość (Value Hypothesis):** jasne metryki, które produkt poprawia (czas, koszt, konwersja).

### **3. Pozycjonowanie i Messaging**

- **One‑liner:** Krótka linia komunikatu adresowana do ICP.
- **3 kluczowe korzyści:** co klient zyskuje (konkretne liczby jeśli możliwe).
- **Proof & Trust:** dowody (case study, dane beta, referencje, integracje).

### **4. Kanały Pozyskania (Acquisition Channels)**

Podziel propozycje kanałów na: „Wysoki priorytet (testy natychmiast)”, „Średni”, „Długoterminowy”.

- **Paid Ads:** propozycja małych testów (kampania, budżet, KPI). 
- **Content / SEO:** tematy high‑intent, kalendarz 3 miesięczny, formaty (blog, kalkulatory, case studies).
- **Outbound / Sales‑Led:** ICP listy, cold email/sequencing z propozycją wartości, playbook demo.
- **Partnerships / Integrations:** integracje, markety (np. Shopify, Slack), program referencyjny.
- **Community / Organic:** grupy LinkedIn, Slack, Reddit—lista miejsc i podejście.

### **5. Model Monetyzacji (Pricing & Packaging)**

- **Primary model:** miesięczny abonament / freemium / jednorazowa opłata / transakcyjny.
- **Propozycja cen:** 2‑3 proste plany z kluczowymi limitami i wyróżnioną wartością.
- **Testy cenowe:** hipotezy do A/B testów (np. cena vs. funkcje).

### **6. Plan Uruchomienia (Launch Plan)**

Fazy: Pre‑launch (listy, beta), Launch (week 0), Post‑launch (0–90 dni).

- **Pre‑launch:** lista beta userów, landing page, lead magnet, zapisy.
- **Launch (Week 0):** komunikat prasowy/announcement, 2–3 kampanie akwizycji, pierwsze 10 płatnych konwersji cel.
- **Post‑launch:** onboarding flow, feedback loop, szybkie poprawki produktu.

### **7. KPI i Metryki Sukcesu**

- **Acquisition:** CAC, liczba leadów, CR landing → trial.
- **Activation:** % użytkowników aktywowanych w X dni.
- **Revenue:** MRR, ARPA, churn.
- **Retention / Engagement:** DAU/MAU lub konkretne eventy użycia.

### **8. Eksperymenty i Roadmapa Testów**

Dla pierwszych 90 dni wypisz 6‑8 eksperymentów priorytetyzowanych wg RICE/ICE:

- Nazwa eksperymentu
- Hipoteza
- Metryka sukcesu
- Zasoby i czas

### **9. Checklista Operacyjna (Playbook)**

- Przygotuj landing page z jasnym CTA i trackingiem (UTM / events).
- Zaimplementuj prosty onboarding z 1‑3 krokami do pierwszej wartości.
- Ustaw podstawowy stack analityczny (Segment/GA/Amplitude) lub proste eventy.
- Skonfiguruj CRM / spreadsheet na leady i follow‑up.
- Przygotuj szablony emaili, social postów i 2 landing pages (A/B).

### **10. Komunikacja i Sprzężenie Zwrotne**

- Szybkie cykle feedbacku: codzienne/tygodniowe synchy z pierwszymi użytkownikami.
- Zbieraj NPS/wywiady 1:1 z płatnymi użytkownikami po 14–30 dniach.

---

### **Instrukcja dla Agentów (do wklejenia w system prompt):**

> Gdy wywołasz `WF_GTM_Strategy`, zbierz 3 kluczowe informacje od użytkownika: 1) krótki opis produktu + 1‑liner, 2) etap produktu (Idea/MVP/PMF), 3) docelowy ICP. Na tej podstawie wygeneruj dopasowany plan GTM w formacie: ICP, Messaging, 3 kanały do natychmiastowego testu, 5‑punktowy plan launchu oraz 5 eksperymentów priorytetyzowanych. Każdy eksperyment powinien mieć prostą metrykę sukcesu.

