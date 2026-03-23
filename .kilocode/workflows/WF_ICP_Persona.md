## WF_ICP_Persona — Definiowanie Idealnego Klienta (ICP) i Jego Problemów

**Cel:** Dostarczyć powtarzalną procedurę definiowania Ideal Customer Profile (ICP) oraz mapowania kluczowych problemów i ich priorytetyzacji, tak aby Solo‑Dev mógł szybko przejść do badań, eksperymentów i GTM.

### Wejścia (What you need)
- Krótki opis produktu / 1‑liner wartości
- Etap produktu (Idea / MVP / PMF)
- Wstępne hipotezy o kliencie (branża, rola, wielkość firmy)
- (opcjonalnie) Wyniki `WF_Competitor_Audit` lub `WF_Job_To_Be_Done`

### Wyjścia (Deliverables)
- Skrócony profil ICP (1‑stronicowa karta)
- Lista 5–8 problemów (opis + metryka wartości)
- Priorytetyzacja problemów (Impact × Ease / Confidence)
- Sugerowane następne eksperymenty (interview script, landing page, outreach)

### Procedura — krok po kroku

1) Sformułuj wstępny ICP (3 zdania)
	- Branża / segment (np. SaaS dla HR)
	- Rola decyzyjna (np. Head of People / Operations Manager)
	- Wielkość organizacji i budżet decyzyjny

2) Zbierz JTBD i konkretny kontekst (użyj `WF_Job_To_Be_Done`)
	- Przeprowadź 5–10 krótkich wywiadów lub obserwacji (Job Snapshot)
	- Dla każdego wpisu zbierz: Context, Motivation, Desired Outcome, Current Solution, Barriers, Trigger, Wartość (liczby), Confidence

3) Mapuj i agreguj bóle (Pain Mapping)
	- Zgrupuj obserwacje tematycznie (onboarding, integracje, czas, koszty)
	- Dla każdego bólu określ: kto go odczuwa, kiedy występuje, jak często, jaka jest bezpośrednia wartość do odzyskania

4) Kwantyfikuj wartość (Value Hypotheses)
	- Przypisz metryki: czas oszczędzony, koszt uniknięty, wzrost konwersji itp.
	- Szacuj skalę (per user / per company / miesięcznie)

5) Oceń Confidence i Ease
	- Confidence (0–10): jak dobre są dane (1 = opinia, 10 = telemetry / transakcje)
	- Ease (0–10): jak łatwo Solo‑Dev zbuduje rozwiązanie (1 = skomplikowane, 10 = prosty feature/no‑code)

6) Priorytetyzacja problemów
	- Użyj prostego wzoru: Priority = Impact × Confidence × Ease (lub RICE/ICE zamiennie)
	- Wybierz 1 Core Problem do natychmiastowego testu (najwyższy Priority przy wysokiej Ease)

7) Wynik: zbuduj kartę ICP i Problem Matrix
	- ICP card (1 akapit + persona bullets: pain, trigger, decision criteria, KPIs)
	- Problem Matrix (lista problemów z Impact/Confidence/Ease i proponowanym eksperymentem)

### Szablony i Artefakty (quick copy)

- ICP Card (1 akapit)
  - Kto: [branża, rola, wielkość]
  - Co: [główny job / cel]
  - Ból: [najważniejszy problem]
  - Decision Criteria: [co sprawia, że kupią?]

- Problem Row (dla każdego problemu)
  - Problem: krótki opis
  - Trigger: kiedy się pojawia
  - Value: metriki (czas, koszt, %)
  - Current Solution: jak to robią teraz
  - Impact (1–10), Confidence (1–10), Ease (1–10), Priority = I×C×E
  - Suggested experiment: (landing page / interview / concierge MVP)

### Interview Script (7 pytań, z `WF_Job_To_Be_Done`)
1. Opowiedz o ostatnim razie, kiedy próbowałeś [zadanie].
2. Co dokładnie robiłeś krok po kroku? (Current solution)
3. Co w tym procesie jest najbardziej frustrujące? (Pain)
4. Jak rozpoznasz, że problem został rozwiązany? (Desired outcome)
5. Ile czasu/kosztu to zabiera teraz? (Value)
6. Co byś zapłacił za prostsze rozwiązanie? (Willingness‑to‑pay)
7. Czy próbowałeś już czegoś innego? Dlaczego to nie zadziałało? (Alternatives)

### Szybkie eksperymenty (priorytetowane)
- Landing page + pre‑signup (test komunikacji i willingness to pay)
- 5‑10 rozmów z targetem (potwierdzenie value metrics)
- Concierge / manual flow dla 3 klientów (sprawdzenie willingness to pay)
- Small paid ad test (kieruj na jeden use case, mierz CTR → signup)

### Integracja z innymi workflowami
- Po zdefiniowaniu ICP: uruchom `WF_Job_To_Be_Done` (jeśli nie zrobione)
- Jeśli masz listę konkurentów: użyj `WF_Competitor_Audit` by znaleźć luki
- Gdy ICP i problemy są potwierdzone: przejdź do `WF_GTM_Strategy` (messaging + kanały)

### Checklista końcowa
- [ ] 1‑stronicowa karta ICP
- [ ] 5–10 Job Snapshotów
- [ ] Problem Matrix z priorytetami
- [ ] 3 propozycje szybkich eksperymentów
- [ ] Zapisany next step (GTM / MVP / Outreach)

---

### Instrukcja dla Agentów (do wklejenia w system prompt):
> Gdy wywołujesz `WF_ICP_Persona`, poproś o: 1) 1‑liner produktu, 2) etap (Idea/MVP/PMF), 3) wstępny opis ICP. Następnie wygeneruj ICP Card, zbiór 5–10 Job Snapshotów (lub skrypt wywiadu) oraz Problem Matrix z zaproponowanymi eksperymentami. Priorytetyzuj według Impact×Confidence×Ease.
