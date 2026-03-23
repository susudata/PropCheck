# WF_User_Journey_Map

**Cel:** Zaprojektowanie precyzyjnej ścieżki użytkownika od wejścia do aplikacji do momentu "sukcesu" (czyli when they get real value and consider renewing subscription), z identyfikacją każdego friction point'u, który może spowodować churn.

---

## **1. Fundamentalna Zasada (The Success Equation)**

> **User Success = First Touch Value + Minimal Friction + Moment of Aha**

Jeśli użytkownik po pierwszych 5 minutach nie widzi, że produkt rozwiązuje jego problem, odejdzie. Jeśli gubi się w UX, zrezygnuje. Jeśli nie widzi "punktu, w którym się stanie lepiej", nie zapłaci.

Twoim zadaniem jest zmapowanie każdej z tych trzech rzeczy.

---

## **2. Definiowanie "Success Metrics" (Co jest sukcesem użytkownika?)**

Zanim mapcjesz journey, musisz odpowiedzieć na jedno pytanie:

### **Pytanie: "Jaki konkretny wynik chcemy, żeby osiągnął użytkownik?"**

Nie mów "być produktywnym" – to za ogólne. Mów: _"Wygenerować jeden raport w 5 minut"_ lub _"Zaoszczędzić 3 godziny tygodniowo"_.

**Przykłady Success Metrics (nie Features):**

| Produkt | Success Metric |
|---------|---|
| Tool do automatyzacji emaili | Wysłanie 100 emaili bez manualnej pracy w ciągu 24h |
| PDF generator | Wygenerowanie i wysłanie jednego PDF report'u w 3 minuty |
| Data validator | Wczytanie i zwalidowanie 1000+ rekordów bez błędów |
| Analytics tool | Zobaczenie trendu wzrostu na własnych danych (minimum 7 dni danych) |
| Scheduling app | Zarezerwowanie 1 spotkania bez konfliktu czasowego |

**Red Flag:** Jeśli success metric to "Użytkownik spędzi 2 godziny konfigurując narzędzie", to nie jest success – to jest pain.

---

## **3. Mapa 7-Punktowa Journey'u (The Core Stages)**

Każdy user journey składa się z 7 stadiów. Dla każdego musisz zidentyfikować **Aha Moment**, **Friction Points** i **Exit Ramps**.

### **Stage 1: Landing (0-30 sekund)**
_Użytkownik wchodzi na stronę_

**Cel:** Zrozumieć, czy to dla niego.

**Krytyczne elementy:**
- [ ] Headline wyjaśnia, co robi produkt (nie "AI-Powered Solution", ale "Automatycznie generuje raporty z Twojego excela")
- [ ] Value prop widoczny bez scrollowania
- [ ] CTA do sign-up jasny i agresywny

**Friction Points:**
- Zawiła grafika zamiast jasnego textu
- "Learn more" zamiast "Sign up free"
- Zbyt wiele opcji (Free vs Pro vs Enterprise)

**Aha Moment:** "To dokładnie rozwiązuje mój problem" (powinno zapaść w 10 sekund).

---

### **Stage 2: Sign-Up (1-3 minuty)**
_Rejestracja / onboarding wstępny_

**Cel:** Wejść do aplikacji bez bólu głowy.

**Krytyczne elementy:**
- [ ] Email + Password (nie wymagaj numeru telefonu, niestandardowych pól)
- [ ] Potwierdź email (instant link, nie kod PIN)
- [ ] Opcja Quick Start – skip zbędnych pytań
- [ ] Progress bar: "2 of 3 steps"

**Friction Points:**
- 10+ pytań w formularzu sign-up (Job title, Company size, Budget, itp.)
- Wymaganie weryfikacji 2FA zaraz po rejestracji
- Redirect do dokumentacji zamiast do aplikacji
- Strona "Zaproś kolegów" zanim użytkownik zobaczy value

**Aha Moment:** Wejście w aplikację i widok głównego dashboardu/feature'u (NIE widok onboardingu).

**Post-Sign-Up Email:** Powinien zapaść w ciągu 5 minut z jednym linkiem: "Tutaj możesz dodać swoje pierwsze dane".

---

### **Stage 3: First Data Input (5-15 minut)**
_Użytkownik dostarcza swoje dane / problem_

**Cel:** Przekazać minimalny zestaw danych, aby zobaczyć magic.

**Krytyczne elementy:**
- [ ] Jasna instrukcja, co należy wpisać
- [ ] Przykład danych pre-filled (user może od razu kliknąć "Proceed")
- [ ] Opcja uploadowania CSV (backup plan)
- [ ] Validacja real-time (błędy pojawiają się na żywo, nie po submitzie)

**Friction Points:**
- Zbyt długi formularz ("Tell us about your business strategy")
- Brak instrukcji, co wpisać
- Error message "Invalid input" zamiast "Powinno to być liczbą, np. 1000"
- UI, które wyglądają jak kompleksowe settings zamiast prostego input-output

**Aha Moment:** System akceptuje dane i przechodzi do processing.

---

### **Stage 4: Processing / Waiting (15-20 sekund)**
_Aplikacja przetwarza dane_

**Cel:** Nie frustować użytkownika czekaniem.

**Krytyczne elementy:**
- [ ] Progress bar z tekstem ("Analyzing your data...", nie csak spinner)
- [ ] Szacunkowy czas ("This usually takes <10 seconds")
- [ ] Jeśli procesu nie da się zrobić w 5 sekund, pokaż placeholder output'u lub preview

**Friction Points:**
- Biały ekran ze spinnером
- Loading time >15 sekund
- Brak informacji, co się dzieje

**Aha Moment:** Transfer do następnego stage'u.

---

### **Stage 5: First Output / AHA MOMENT (20-60 sekund)**
_Użytkownik widzi wynik swoją pracą_

**Cel:** "Wow, to działa! To jest dokładnie to, czego chciałem!"

**Krytyczne elementy:**
- [ ] Output jest możliwy do czytania i praktyczny (nie generyczna demo)
- [ ] Rezultat jest bezpośredni do ich inputu (nie abstrakcyjny)
- [ ] Możliwość natychmiastowego eksportu / udostępnienia (Download, Email, Copy link)
- [ ] Jasna wizualizacja: "To zaoszczędziło Ci 30 minut pracy"

**Friction Points:**
- Piękny output, ale nie praktyczny
- "Upgrade do Pro, aby zobaczyć pełny rezultat"
- Brak opcji pobrania / udostępnienia
- Output jest w formacie, który user nie może użyć (np. PDF, kiedy potrzebuje CSV)

**Aha Moment:** TUTAJ użytkownik myśli: "Mogę to sprzedać szefowi jako uzasadnienie subskrypcji" lub "Mogę to używać każdego dnia".

**Timing:** Ta ścieżka powinna trwać maksymalnie **3-5 minut od wejścia**.

---

### **Stage 6: Second Action (1-3 dni później)**
_Czy użytkownik wraca do aplikacji bez prompta?_

**Cel:** Zweryfikować, że Aha Moment był rzeczywisty.

**Krytyczne elementy:**
- [ ] Email 24h po sign-up: "Gotów na następny krok? [Link do uploadu #2]"
- [ ] W aplikacji: Widget "Spróbuj z innymi danymi"
- [ ] Historyjka sukcesów / templates, które user może skopiować

**Friction Points:**
- Brak follow-up emaila
- App, która po 24h wygląda tak samo (user zapomina, po co wrócił)
- Jeśli second upload jest trudniejszy niż first, user rezygnuje

**Aha Moment:** User robi drugą akcję **z własnej inicjatywy** (nie bo dostał email).

---

### **Stage 7: Conversion to Paid (7-30 dni)**
_Decyzja o płatności_

**Cel:** Zamiana trial'u lub free-mium'u na płacący user.

**Krytyczne elementy:**
- [ ] Clear messaging: "Free trial ends on [DATE]. Upgrade by then to keep access"
- [ ] CTA nie terroryzuje ("We'll charge $29/mo"), ale justifies ("For unlimited reports")
- [ ] 1-click upgrade (nie formularz, nie wskaźniki kredytowe)
- [ ] Brak surprise charges (jedno cena, nie dynamiczna)

**Friction Points:**
- Surprise pricing ("Only $9/mo, но zawiera N licencji")
- Wymaganie informacji korporacyjnych
- "Upgrade teraz, aby odblokować Feature X" (jeśli X nie jest w MVP, ta ścieżka jest błędna)
- Chaos w komunikacji: "Free forever" vs "Free trial ends soon"

**Aha Moment:** User widzi, że "Jeśli nie zapłacę, stracę dostęp do narzędzia, które właśnie zmieniło moją pracę".

---

## **4. Szablon User Journey Map (Do Wypełnienia)**

```
## 🎯 User Journey Map: [Produktu]

### Success Metric (Co to jest "sukces użytkownika"?)
_Użytkownik będzie uważać, że narzędzie warte jest $X/miesiąc, jeśli:_
→ [Konkretna akcja i wynik, np. "Wygeneruje report w <2 minuty i wyśle do szefa"]

---

### Stage 1: Landing (0-30s)
**What they see:**
- Headline: "[WPISZ]"
- Value prop: "[WPISZ]"

**Friction Points:**
- [ ] Issue: [OPISZ]
  - Solution: [CO ZMIENIĆ]
  
**Aha Moment:** User thinks "_[MYŚL KTÓRA POWINNA ZAPAŚĆ]_"

**CTA:** [BUTTON TEXT]

---

### Stage 2: Sign-Up (1-3 min)
**Flow:**
1. Email + Password
2. Confirm email (instant link)
3. Skip survey / Quick start
4. Enter app

**Friction Points:**
- [ ] Issue: [OPISZ]
  - Solution: [CO ZMIENIĆ]

**Aha Moment:** User sees main feature (dashboard, editor, itp.)

**Follow-up Email (5 min after):** "[Subject line]" with link to Stage 3

---

### Stage 3: First Data Input (5-15 min)
**Input type:** [CSV upload / Form / API connection / itp.]

**Required fields:**
- [ ] [Field name]: [Instruction/Example]
- [ ] [Field name]: [Instruction/Example]

**Friction Points:**
- [ ] Issue: [OPISZ]
  - Solution: [CO ZMIENIĆ]

**Aha Moment:** System accepts data & shows processing

---

### Stage 4: Processing (15-20s)
**UX:** Progress bar with text: "[MESSAGE]"

**Error Handling:** [JAK OBSŁUGUJESZ BŁĘDY?]

---

### Stage 5: First Output (20-60s) ⭐ MOST CRITICAL
**Output format:** [PDF / CSV / JSON / Dashboard View]

**Visual Design:**
- User can instantly see: [CO WIDZI?]
- User can instantly do: [CO MOŻE ZROBIĆ?]

**Export Options:**
- [ ] Download as [FORMAT]
- [ ] Email to [USER EMAIL]
- [ ] Share link (copy to clipboard)

**Friction Points:**
- [ ] Issue: [OPISZ]
  - Solution: [CO ZMIENIĆ]

**Aha Moment:** User thinks: "_[MYŚL KTÓRA POWINNA ZAPAŚĆ]_" (bez tego nie ma konwersji)

**⏱️ TOTAL TIME FROM LANDING TO AHA:** [X] minutes (target: <5)

---

### Stage 6: Second Action (1-3 days later)
**Trigger:** [Email sent at 24h? Widget in-app? Notification?]

**Message:** "[SUBJECT LINE / CTA TEXT]"

**Goal:** User performs second action WITHOUT email reminder

**Success:** [Jak mierzyć Return Rate?]

**Friction Points:**
- [ ] Issue: [OPISZ]
  - Solution: [CO ZMIENIĆ]

---

### Stage 7: Conversion (7-30 days)
**Trigger:** Free trial ends OR hitting limit (e.g., "Used 5 of 5 free exports")

**Message (Email + In-App):** "[SUBJECT] Your free trial ends [DATE]. Upgrade to keep using [FEATURE]"

**Pricing:** [PRICE / FEATURES]

**CTA Button:** "[BUTTON TEXT]"

**Friction Points:**
- [ ] Issue: [OPISZ]
  - Solution: [CO ZMIENIĆ]

**Aha Moment:** User realizes: "_[MYŚL KTÓRA POWINNA ZAPAŚĆ]_" (np. "Without this I lose access to something I need now")

---

### Summary Metrics
- [ ] Landing → Sign-up conversion: ____%
- [ ] Sign-up → First Output: ___% (target: >70%)
- [ ] First Output → Day 1 Return: ___% (target: >40%)
- [ ] Trial → Paid: ___% (target: >5%)

### Biggest Friction Point (The ONE thing killing conversions)
→ [WPISZ JEDEN PUNKT]

### Quick Wins (Changes that'll improve conversion in <4h)
1. [ZMIANA #1]
2. [ZMIANA #2]
3. [ZMIANA #3]
```

---

## **5. Critical Checkpoints (Czerwone Flagi)**

Jeśli którekolwiek z poniższych jest prawdą, journey jest zepsuta:

- 🚩 **Aha Moment pojawia się po >5 minutach** → Użytkownik odejdzie zanim to zobaczy.
- 🚩 **Output wymaga klikania w settings zanim widać wartość** → Zbyt dużo friction'u.
- 🚩 **Second return rate <30%** → Aha Moment był iluzoryczny.
- 🚩 **Conversion rate <3%** → Problem nie w pricing, ale w journey.
- 🚩 **Support tickets o "Jak to używać?"** → Onboarding nie wyjaśnia.
- 🚩 **Users say "Pretty, but not useful"** → Piękny design, zły UX.

---

## **6. Post-Launch Monitoring (Metryki, które śledz)**

```
Daily Metrics:
□ Landing → Sign-up: ___% (target: >5%)
□ Sign-up → First Output completion: ___% (target: >70%)
□ Time from sign-up to first output: ___ min (target: <5)
□ Aha Moment survey response: ___% said "Yes, this is useful" (target: >80%)

Weekly Metrics:
□ Day 1 Return Rate: ___% (target: >40%)
□ Day 7 Return Rate: ___% (target: >30%)
□ Trial-to-Paid Conversion: ___% (target: >5%)

Monthly Metrics:
□ Churn Rate: ___% (target: <5%)
□ Feature adoption: Which features are used most? (design follow-ups)
□ Support load: How many "I don't understand how to..." tickets?
```

---

## **7. Common Journey Mistakes (Anti-Patterns)**

| Mistake | Why It Fails | Fix |
|---------|-----------|-----|
| "Sign up → Settings → Dashboard → Upload Data" | User leaves before seeing value | Reorganize: Upload → Output → Then settings |
| "Download extension first" | Friction before value | Offer web version in MVP |
| "Invite team members before first success" | Solo user doesn't see why they'd invite | Let solo user win first, then suggest |
| "Free forever with aggressive upsells" | No clear path to paid; feature-gating frustrates | Free trial + clear upgrade moment |
| "Beautiful onboarding slides (7+ screens)" | Users skip all slides | 1 tip after sign-up, rest learned by doing |
| "Complex permission/role system" | Solo user feels overwhelmed | Every user = Admin in MVP |

---

## **Instrukcja dla Agentów (do wklejenia w system prompt):**

> Kiedy użytkownik wywoła `WF_User_Journey_Map`, Twoim celem jest znalezienie **THE bottleneck** – jednego punktu, w którym większość użytkowników odchodzi. Nie rozmawiaj o pięknym designie czy feature roadmap'ie. Skupiaj się na sekwencji czasowej: ile czasu od wejścia do Aha Moment'u? Jeśli > 5 minut, powiedz to wprost: "To za długo, użytkownik zrezygnuje". Jeśli Second Return Rate jest poniżej 40%, Aha Moment jest fałszywy – redesign go. Bądź data-driven: metryki są faktem, opinie to hałas.
