```markdown
# WF_Resource_Analysis

**Cel:** Przeprowadzić audyt zasobów niezbędnych do realizacji produktu SaaS: czas (osobo‑dni), budżet (koszty bezpośrednie i pośrednie) oraz zewnętrzne integracje wymagane do uruchomienia MVP i skalowania.

### **1. Preflight (wejściowe założenia)**

- **Krótki opis produktu / 1‑liner:**
- **Stage:** (Idea / MVP / Scaling)
- **Horyzont planowania:** (30 / 90 / 180 dni)
- **Główny cel audytu:** (np. oszacować minimalny budżet MVP, zidentyfikować krytyczne integracje)

### **2. Audyt Czasu (Time Audit)**

Podziel zadania na kategorie i oszacuj w osobo‑dniach:

- **Core development:** rdzeń produktu, backend, API, frontend.
- **Integracje:** implementacja zewnętrznych API i utrzymanie.
- **DevOps / Infra:** CI/CD, hosting, monitoring.
- **Design & UX:** prototypy, testy użyteczności.
- **QA:** testy manualne/automatyczne.
- **Growth & Ops:** landing page, onboarding, marketing podstawowy.
- **Support & Ops:** przygotowanie materiałów wsparcia.

Dla każdej kategorii: minimalne (MVP), optymalne (PMF) i bufor ryzyka (20–30%).

### **3. Audyt Budżetu (Budget Audit)**

Rozbij koszty na stałe i zmienne oraz jednorazowe:

- **Jednorazowe koszty:** prototypy, licencje narzędziowe, konsultacje prawne.
- **Miesięczne koszty:** hosting, baza danych, narzędzia monitoringowe, płatne integracje.
- **Koszty pracy:** wynagrodzenia / stawki kontraktorów (przelicz na osobo‑dni).
- **Marketing / Customer Acquisition:** testowy budżet na kanały (pierwsze 3 miesiące).

Zsumuj: minimalny budżet MVP (pierwsze 3 miesiące) i budżet rozszerzony (6–12 miesięcy).

### **4. Integracje Zewnętrzne (External Integrations)**

Lista integracji oceniona wg krytyczności i trudności implementacji:

- **Kategoryzacja:** Krytyczne / Opcjonalne / Nice‑to‑have.
- **Przykłady:** płatności (Stripe/PayPal), auth (Auth0/OKTA), CRM (HubSpot/Pipedrive), marketplace (Shopify), storage (S3), email (SendGrid), analytics (GA/Amplitude), webhooks/queue (Rabbit/Kafka).
- **Dla każdej integracji:** wymagane scope API, koszty licencyjne, szacowany czas implementacji, punkty ryzyka (rate limits, compliance).

### **5. Macierz Priorytetów (Prioritization Matrix)**

Użyj prostego arkusza: funkcja/integra → wartość biznesowa (1–5) × trudność (1–5) → priorytet.

Wyróżnij elementy krytyczne do MVP vs. elementy możliwe do dodania po uruchomieniu.

### **6. Estymacje i Alokacja Zasobów**

- Przydziel role (np. 0.5 FTE dev, 0.2 FTE designer) i odpowiadające im osobo‑dni.
- Określ minimalny zespół do uruchomienia MVP i listę zadań z termami.
- Dodaj bufor (20–30%) na nieprzewidziane prace i integracyjne opóźnienia.

### **7. Ryzyka i Mitigacje**

- ID ryzyka (np. opóźnienia integracji płatności) → wpływ → prawdopodobieństwo → plan mitigacji.
- Przygotuj alternatywy (backup integrations, manual workarounds) dla krytycznych punktów.

### **8. Plan Finansowy Krótkoterminowy**

- Punkty progowe (runway): ile miesięcy działania przy minimalnym burn rate.
- Break‑even target: ile płatnych użytkowników / ARPA potrzebne do pokrycia kosztów.

### **9. Checklista Wdrożeniowa (MVP‑Ready)**

- Krytyczne integracje zaimplementowane i przetestowane.
- Automatyczny onboarding i tracking kluczowych eventów.
- Podstawowy monitoring (uptime, error reporting) i kopie zapasowe.
- Mechanizm płatności i prosty billing.
- Dokumentacja operacyjna dla działań supportu.

### **10. Output / Deliverables**

Po wykonaniu audytu dostarcz:

- Arkusz z osobo‑dniami i budżetem (CSV/Google Sheet).
- Lista integracji z oceną krytyczności i estymacjami czasu/kosztów.
- Macierz priorytetów.
- Krótki plan działania (30/90/180 dni) z przypisanymi właścicielami.

---

### **Instrukcja dla Agentów (do wklejenia w system prompt):**

> Przy uruchomieniu `WF_Resource_Analysis` poproś użytkownika o: 1) 1‑liner produktu, 2) etap produktu (Idea/MVP/Scaling), 3) dostępne zasoby (liczba devów, budżet miesięczny), 4) lista planowanych integracji. Następnie wygeneruj: skrócony audyt czasu (osobo‑dni) dla MVP, minimalny budżet 3‑miesięczny, listę krytycznych integracji z estymacjami i macierz priorytetów. Załącz link do arkusza z estymacjami.

