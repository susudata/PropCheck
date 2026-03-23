# WF_User_Journey_Map — PropCheck

**Cel:** Zaprojektowanie precyzyjnej ścieżki użytkownika od wejścia do aplikacji do momentu "sukcesu" (pierwszy raport wygenerowany, wartość potwierdzona).

---

## **1. Fundamentalna Zasada (The Success Equation)**

> **User Success = First Touch Value + Minimal Friction + Moment of Aha**

PropCheck = **"WhatsApp dla usterek — jedno miejsce na zgłoszenia, statusy i raporty dla ekip"**

Jeśli użytkownik po pierwszych 2 minutach nie widzi, że produkt rozwiązuje jego problem z WhatsApp-chaosem, odejdzie. Jeśli gubi się w UX, zrezygnuje. Jeśli nie widzi "punktu, w którym się stanie lepiej", nie zapłaci 49 PLN/mies.

---

## **2. Definiowanie "Success Metrics" (Co jest sukcesem użytkownika?)**

### **Pytanie: "Jaki konkretny wynik chcemy, żeby osiągnął użytkownik?"**

| Produkt | Success Metric |
|---------|---|
| PropCheck | **Dodanie zgłoszenia usterki z 1 zdjęciem w < 2 minuty** — od wejścia na landing do widoku "zgłoszenie zapisane" |
| PropCheck | **Wygenerowanie listy usterek dla ekipy w 1 klik** — PDF/print view zamiast screenshotów z WhatsApp |

**Success Metric (MVP):**
→ *Użytkownik będzie uważać, że narzędzie warte jest 49 PLN/mies, jeśli wygeneruje pierwszy raport dla ekipy w < 5 minut od rejestracji i zaoszczędzi min. 15 minut na jednym zgłoszeniu.*

**Red Flag:** Jeśli success metric to "Użytkownik spędzi 30 minut konfigurując upload rzutu mieszkania", to nie jest success – to jest pain.

---

## **3. Mapa 7-Punktowa Journey'u (The Core Stages)**

---

### **Stage 1: Landing (0-30 sekund)**

_Użytkownik wchodzi na stronę_

**Cel:** Zrozumieć, czy to dla niego — czy rozwiązuje jego problem z chaosem w WhatsApp.

**Krytyczne elementy:**
- [x] Headline: **"Jedno miejsce na wszystkie zgłoszenia usterek. Koniec z szukaniem zdjęć w WhatsApp."**
- [x] Value prop: "Zgłoś → Śledź status → Wyślij raport ekipie" (3 kroki, jasne)
- [x] CTA: **"Wypróbuj bezpłatnie"** (nie "Dowiedz się więcej")
- [x] Proof: "Zarządzasz 5-50 mieszkaniami? To dla Ciebie."

**Friction Points:**
- [ ] Zawiła grafika zamiast jasnego textu → **POPRAWKA:** Minimalistyczny design, focus na value prop
- [ ] "Learn more" zamiast "Sign up free" → **POPRAWKA:** CTA na hero section
- [ ] Zbyt wiele opcji (Free vs Pro vs Enterprise) → **POPRAWKA:** Na landing page tylko 1 CTA, ceny na pricing page

**Aha Moment:** "To dokładnie rozwiązuje mój problem z WhatsApp" (zapada w 10 sekund).

**CTA:** `Załóż darmowe konto →`

---

### **Stage 2: Sign-Up (1-2 minuty)**

_Rejestracja / onboarding wstępny_

**Cel:** Wejść do aplikacji bez bólu głowy, zobaczyć pusty dashboard.

**Krytyczne elementy:**
- [x] Email + Password (nie wymagaj telefonu, nazwy firmy, itp.)
- [x] Potwierdź email (instant link)
- [x] Skip onboarding survey — **KLUCZOWE:** Nie pytaj o liczbę mieszkań, budżet, itp.
- [x] Progress bar: "Krok 1 z 1" (tylko rejestracja)

**Friction Points:**
- [ ] 10+ pytań w formularzu sign-up → **POPRAWKA:** Tylko email + hasło
- [ ] Wymaganie weryfikacji 2FA zaraz po rejestracji → **POPRAWKA:** Brak 2FA w v1
- [ ] Redirect do dokumentacji zamiast do aplikacji → **POPRAWKA:** Redirect na dashboard
- [ ] "Zaproś kolegów" zanim użytkownik zobaczy value → **POPRAWKA:** Single-user w v1

**Aha Moment:** Wejście w aplikację i widok pustego dashboardu z dużym przyciskiem "Dodaj pierwszą usterkę".

**Follow-up Email (5 min after):**
```
Subject: Witaj w PropCheck! Dodaj pierwszą usterkę w 2 minuty.
Body: [Link do dashboard] "Kliknij tutaj, aby dodać pierwsze zgłoszenie — np. ten cieknący kran, o którym zapomniałeś wczoraj wieczorem."
```

---

### **Stage 3: First Data Input (2-5 minut)**

_Użytkownik dostarcza swoje dane / pierwsze zgłoszenie_

**Cel:** Przekazać minimalny zestaw danych, aby zobaczyć "magia" — zgłoszenie zapisane w jednym miejscu.

**Input type:** Formularz dodawania usterki

**Required fields:**
- [ ] **Mieszkanie** (dropdown, opcja "Dodaj nowe"): Lista z przykładem "np. Mieszkanie Kraków, ul. Floriańska 5"
- [ ] **Tytuł usterki**: "np. Cieknący kran w łazience" (placeholder z przykładem)
- [ ] **Zdjęcie**: Drag & drop lub click to upload (opcjonalne w v1)
- [ ] **Status**: Automatycznie "Nowe" (nie wymagaj wyboru)

**Pre-filled example:**
```
Mieszkanie: [Mieszkanie testowe - kliknij, aby użyć]
Tytuł: [Cieknący kran]
Zdjęcie: [Przykładowe zdjęcie kranu - kliknij, aby zobaczyć]
```

**Krytyczne elementy:**
- [x] Jasna instrukcja, co należy wpisać
- [x] Przykład danych pre-filled (user może od razu kliknąć "Zapisz")
- [x] Validacja real-time (błędy pojawiają się na żywo)
- [x] Opcja uploadu ze schowka (przydatne dla copy-paste z WhatsApp)

**Friction Points:**
- [ ] Zbyt długi formularz ("Opisz dokładnie problem, lokalizację, priorytet, termin...") → **POPRAWKA:** Tylko 3 pola: mieszkanie, tytuł, zdjęcie
- [ ] Brak instrukcji, co wpisać → **POPRAWKA:** Placeholder z przykładami
- [ ] Error message "Invalid input" zamiast "Podaj tytuł usterki, np. 'Cieknący kran'" → **POPRAWKA:** Human-friendly errors

**Aha Moment:** System akceptuje dane i pokazuje "Zgłoszenie #1 zapisane!" z przyciskiem "Dodaj kolejne".

---

### **Stage 4: Processing / Waiting (1-3 sekundy)**

_Aplikacja zapisuje dane_

**Cel:** Natychmiastowy feedback, brak frustrującego czekania.

**UX:** 
- Animowany checkmark: "✓ Zapisano"
- Przekierowanie na listę zgłoszeń (< 1 sekunda)

**Error Handling:** 
- Jeśli błąd: "Ups! Coś poszło nie tak. Spróbuj ponownie." z opcją "Zapisz offline"
- Offline mode: zgłoszenie zapisuje się lokalnie, synchronizuje gdy internet wróci

**Friction Points:**
- [ ] Biały ekran ze spinnerem > 2 sekundy → **POPRAWKA:** Optimistic UI (pokazuj od razu, zapisuj w tle)
- [ ] Brak informacji, co się dzieje → **POPRAWKA:** Instant feedback "Zapisano"

**Aha Moment:** Transfer do listy zgłoszeń z wizualnym potwierdzeniem.

---

### **Stage 5: First Output / AHA MOMENT (5-10 sekund po zapisaniu)**

_Użytkownik widzi swoje pierwsze zgłoszenie na liście_

**Cel:** "Wow, to jest w jednym miejscu! Nigdy więcej szukania w WhatsApp!"

**Output format:** Lista zgłoszeń z filtrami

**Visual Design:**
- User can instantly see: **"Mieszkanie Kraków - Cieknący kran - Status: Nowe - 2 minuty temu"**
- User can instantly do: **Zmień status, Dodaj zdjęcie, Wyślij do ekipy**

**Quick Actions:**
- [x] Zmień status (przycisk "→ W trakcie")
- [x] Dodaj więcej zdjęć
- [x] Wyeksportuj listę (Print View / PDF)

**Export Options:**
- [ ] Print View (Ctrl+P) — darmowe, szybkie
- [ ] PDF Download (Tier 2, zaawansowane)
- [ ] Email do siebie / ekipy

**Friction Points:**
- [ ] Piękny output, ale nie praktyczny → **POPRAWKA:** Focus na actions, nie tylko wizualizację
- [ ] "Upgrade do Pro, aby zobaczyć pełny rezultat" → **POPRAWKA:** Free tier = 3 mieszkania, wszystkie funkcje dostępne
- [ ] Brak opcji pobrania / udostępnienia → **POPRAWKA:** Print View jako MVP

**Aha Moment:** User myśli: **"Mogę to wysłać ekipie zamiast screenshotów z WhatsApp — wygląda profesjonalnie!"**

**⏱️ TOTAL TIME FROM LANDING TO AHA:** **< 5 minut** (target: < 5 min ✅)

---

### **Stage 6: Second Action (24-48 godzin później)**

_Czy użytkownik wraca do aplikacji bez prompta?_

**Cel:** Zweryfikować, że Aha Moment był rzeczywisty — czy użytkownik sam wraca, żeby dodać kolejne zgłoszenie.

**Trigger:** Email 24h po pierwszym zgłoszeniu

**Message:**
```
Subject: Jak poszło z tym cieknącym kranem?

Cześć [Name],

Widzimy, że dodałeś zgłoszenie "Cieknący kran" wczoraj.

Czy ekipa już go naprawiła? Kliknij tutaj, aby zmienić status na "Naprawione" →
[kliknij, aby zaktualizować]

Ps. W tym tygodniu dodałeś 1 zgłoszenie. Średnio nasi użytkownicy mają 8 zgłoszeń miesięcznie — sprawdź, czy nie masz więcej usterek do dodania →
```

**Goal:** User robi drugą akcję (zmiana statusu LUB dodanie nowego zgłoszenia) **z własnej inicjatywy**.

**Success Metric:** 
- Day 1 Return Rate: > 40%
- Oznacza: użytkownik wraca sam, bez emaila

**Friction Points:**
- [ ] Brak follow-up emaila → **POPRAWKA:** SendGrid / automatyczny email 24h po
- [ ] App, która po 24h wygląda tak samo (user zapomina, po co wrócił) → **POPRAWKA:** Dashboard pokazuje "Ostatnia aktywność: 24h temu"
- [ ] Jeśli drugi upload jest trudniejszy niż pierwszy, user rezygnuje → **POPRAWKA:** Drugie zgłoszenie jeszcze szybsze (mieszkanie pre-filled)

**Aha Moment:** User sam wraca do aplikacji, żeby dodać kolejne zgłoszenie "z pamięci".

---

### **Stage 7: Conversion to Paid (7-14 dni)**

_Decyzja o płatności_

**Cel:** Zamiana free tier (3 mieszkania) na płacący Pro (20 mieszkaní, 49 PLN/mies).

**Trigger:** 
1. **Limit reached:** "Użyłeś 3 z 3 dostępnych mieszkań. Upgrade, aby dodać więcej."
2. **Trial reminder:** Email 7 dni przed (jeśli trial)

**Message (In-App + Email):**
```
Subject: Zostało Ci 3 mieszkania. A co, jeśli potrzebujesz więcej?

Hej [Name],

Używasz PropCheck już [X] dni! ✅
Dodałeś [Y] zgłoszeń — to [Z] godzin zaoszczędzonego czasu szukania w WhatsApp. ⏱️

Ale zauważyliśmy, że masz już 3 mieszkania w systemie. Jeśli zarządzasz większym portfelem, Pro pozwala na:
✓ Nielimitowaną liczbę mieszkań (do 20)
✓ Nielimitowane raporty PDF
✓ Priorytet wsparcia

Cena: 49 PLN/mies = ~1.5h oszczędności tygodniowo.

[Wypróbuj Pro przez 14 dni za darmo →]

Pamiętaj: Free tier nadal działa, możesz wrócić kiedy chcesz.
```

**Pricing:**
| Plan | Cena | Limit |
|------|------|-------|
| **Free** | 0 PLN | 3 mieszkania |
| **Pro** | 49 PLN/mies | 20 mieszkań |
| **Enterprise** | 149 PLN/mies | Nielimitowane |

**CTA Button:** `Rozpocznij 14-dniowy trial Pro →`

**Friction Points:**
- [ ] Surprise pricing ("Only 49 PLN, но zawiera N licencji") → **POPRAWKA:** Jasna tabela cen, brak hidden fees
- [ ] Wymaganie informacji korporacyjnych → **POPRAWKA:** Tylko email + karta
- [ ] "Upgrade teraz, aby odblokować Feature X" (jeśli X nie jest w MVP) → **POPRAWKA:** Free = wszystkie funkcje, tylko limit mieszkań
- [ ] Chaos w komunikacji: "Free forever" vs "Free trial ends soon" → **POPRAWKA:** Free = free forever, upgrade = opcja

**Aha Moment:** User widzi, że **"Jeśli nie zapłacę, stracę dostęp do narzędzia, które właśnie zmieniło moją pracę — wrócę do WhatsApp-chaosu"**

---

## **4. User Journey Map — Wypełniona**

```
## 🎯 User Journey Map: PropCheck

### Success Metric (Co to jest "sukces użytkownika"?)
_Użytkownik będzie uważać, że narzędzie warte jest 49 PLN/mies, jeśli:_
→ Wygeneruje pierwszy raport dla ekipy w < 5 minut od rejestracji
→ Zaoszczędzi min. 15 minut na jednym zgłoszeniu (zamiast szukać w WhatsApp)
→ Zobaczy wszystkie usterki w jednym miejscu zamiast w 10 wątkach

---

### Stage 1: Landing (0-30s)

**What they see:**
- Headline: "Jedno miejsce na wszystkie zgłoszenia usterek. Koniec z szukaniem zdjęć w WhatsApp."
- Value prop: "Zgłoś → Śledź status → Wyślij raport ekipie"
- Proof: "Zarządzasz 5-50 mieszkaniami? To dla Ciebie."

**Friction Points:**
- [ ] Issue: Too much information, user doesn't know where to start
  - Solution: Simplify to 3-step value prop + 1 CTA
- [ ] Issue: "Learn more" instead of "Start free"
  - Solution: Primary CTA on hero section

**Aha Moment:** User thinks "_To dokładnie rozwiązuje mój problem z WhatsApp i chaosem zdjęć_"

**CTA:** `Załóż darmowe konto →`

---

### Stage 2: Sign-Up (1-2 min)

**Flow:**
1. Email + Password
2. Confirm email (instant link)
3. Skip survey — GO STRAIGHT TO DASHBOARD
4. Enter app

**Friction Points:**
- [ ] Issue: Long forms with company name, phone, etc.
  - Solution: Email + Password only, nothing else

**Aha Moment:** User sees empty dashboard with big "Dodaj pierwszą usterkę" button

**Follow-up Email (5 min after):** "Witaj w PropCheck! Dodaj pierwszą usterkę w 2 minuty." with link to dashboard

---

### Stage 3: First Data Input (2-5 min)

**Input type:** Simple form (mieszkanie, tytuł, zdjęcie)

**Required fields:**
- [ ] **Mieszkanie**: Dropdown z opcją "Dodaj nowe" + pre-filled example "Mieszkanie testowe"
- [ ] **Tytuł**: "Cieknący kran" (placeholder z przykładem)
- [ ] **Zdjęcie**: Drag & drop lub click (opcjonalne)

**Pre-filled (one-click flow):**
```
Mieszkanie: [Mieszkanie testowe]
Tytuł: [Cieknący kran]
Zdjęcie: [Pomiń]
→ Kliknij "Zapisz" →
```

**Friction Points:**
- [ ] Issue: Too many fields to fill
  - Solution: 3 fields max, rest optional
- [ ] Issue: No idea what to write
  - Solution: Placeholder examples

**Aha Moment:** System shows "✓ Zgłoszenie #1 zapisane!"

---

### Stage 4: Processing (1-3s)

**UX:** Instant feedback: "✓ Zapisano" → redirect to list

**Error Handling:** "Ups! Spróbuj ponownie" with retry button

---

### Stage 5: First Output (5-10s) ⭐ MOST CRITICAL

**Output format:** List view with filters (status, mieszkanie)

**Visual Design:**
- User can instantly see: "Mieszkanie Kraków - Cieknący kran - Nowe - 2 min temu"
- User can instantly do: Change status, Add photo, Print list

**Export Options:**
- [x] Print View (Ctrl+P) — FREE in MVP
- [ ] PDF Download — Tier 2
- [ ] Email share

**Friction Points:**
- [ ] Issue: "Upgrade to see full results"
  - Solution: Free tier = all features, just limit of 3 properties

**Aha Moment:** User thinks: "_Mogę to wysłać ekipie zamiast screenshotów z WhatsApp — wygląda profesjonalnie!_" (bez tego nie ma konwersji)

**⏱️ TOTAL TIME FROM LANDING TO AHA:** < 5 minutes (target: < 5 ✅)

---

### Stage 6: Second Action (24-48h later)

**Trigger:** Email 24h after first report

**Message:** 
```
Subject: Jak poszło z tym cieknącym kranem?

Cześć [Name],

Widzimy, że dodałeś zgłoszenie "Cieknący kran" wczoraj.
Czy ekipa już go naprawiła? Kliknij tutaj, aby zmienić status →
```

**Goal:** User performs second action WITHOUT email reminder (returns organically)

**Success:** Day 1 Return Rate > 40%

**Friction Points:**
- [ ] Issue: User forgets about the app
  - Solution: Dashboard shows "Ostatnia aktywność: 24h temu" + daily email tip

---

### Stage 7: Conversion (7-14 days)

**Trigger:** Hitting limit (3 of 3 properties used) OR manual upgrade

**Message (Email + In-App):**
```
Subject: Zostało Ci 3 mieszkania. A co, jeśli potrzebujesz więcej?

Hej [Name],

Używasz PropCheck już [X] dni! ✅
Dodałeś [Y] zgłoszeń — to [Z] godzin zaoszczędzonego czasu. ⏱️

Pro pozwala na:
✓ Nielimitowaną liczbę mieszkań (do 20)
✓ Nielimitowane raporty PDF

Cena: 49 PLN/mies = ~1.5h oszczędności tygodniowo.

[Wypróbuj Pro przez 14 dni za darmo →]
```

**Pricing:**
| Plan | Cena | Limit |
|------|------|-------|
| Free | 0 PLN | 3 mieszkania |
| Pro | 49 PLN/mies | 20 mieszkań |

**CTA Button:** "Rozpocznij 14-dniowy trial Pro →"

**Friction Points:**
- [ ] Issue: Surprise pricing
  - Solution: Transparent pricing table, no hidden fees

**Aha Moment:** User realizes: "_Without this I go back to WhatsApp chaos — I don't want that_" (np. "Bez tego wrócę do szukania zdjęć w WhatsApp, nie ma mowy")

---

### Summary Metrics

- [ ] Landing → Sign-up conversion: ____% (target: > 5%)
- [ ] Sign-up → First Output: ___% (target: > 70%) ✅
- [ ] First Output → Day 1 Return: ___% (target: > 40%)
- [ ] Trial → Paid: ___% (target: > 5%)

### Biggest Friction Point (The ONE thing killing conversions)
→ **[STAGE 3] First Data Input — jeśli formularz ma > 5 pól, użytkownik rezygnuje przed Aha Moment**

### Quick Wins (Changes that'll improve conversion in < 4h)
1. Pre-filled example data (one-click to save first report)
2. Remove all optional fields from sign-up
3. Add instant "✓ Zapisano" feedback after save
```

---

## **5. Critical Checkpoints (Czerwone Flagi)**

Jeśli którekolwiek z poniższych jest prawdą, journey jest zepsuta:

| 🚩 Red Flag | PropCheck Status |
|-------------|------------------|
| **Aha Moment pojawia się po >5 minutach** | ✅ OK: < 5 min (target: < 5 min) |
| **Output wymaga klikania w settings zanim widać wartość** | ✅ OK: Dashboard = lista zgłoszeń, żadnych settings |
| **Second return rate <30%** | ❓ TBD: wymaga pomiaru po launch |
| **Conversion rate <3%** | ❓ TBD: wymaga pomiaru po launch |
| **Support tickets o "Jak to używać?"** | ❓ TBD: wymaga monitoringu |
| **Users say "Pretty, but not useful"** | ❓ TBD: wymaga feedback loop |

---

## **6. Post-Launch Monitoring (Metryki)**

```
Daily Metrics:
□ Landing → Sign-up: ___% (target: > 5%)
□ Sign-up → First Output completion: ___% (target: > 70%)
□ Time from sign-up to first output: ___ min (target: < 5)
□ Aha Moment survey response: ___% said "Yes, this is useful" (target: > 80%)

Weekly Metrics:
□ Day 1 Return Rate: ___% (target: > 40%)
□ Day 7 Return Rate: ___% (target: > 30%)
□ Trial-to-Paid Conversion: ___% (target: > 5%)

Monthly Metrics:
□ Churn Rate: ___% (target: < 5%)
□ Feature adoption: Which features are used most?
□ Support load: How many "I don't understand how to..." tickets?
```

---

## **7. Common Journey Mistakes (Anti-Patterns) — PropCheck Assessment**

| Mistake | Why It Fails | PropCheck Status |
|---------|-----------|------------------|
| "Sign up → Settings → Dashboard → Upload Data" | User leaves before seeing value | ✅ OK: Dashboard first, add data second |
| "Download extension first" | Friction before value | ✅ OK: Web app only |
| "Invite team members before first success" | Solo user doesn't see why they'd invite | ✅ OK: Single-user v1 |
| "Free forever with aggressive upsells" | No clear path to paid | ✅ OK: Free tier + clear upgrade moment |
| "Beautiful onboarding slides (7+ screens)" | Users skip all slides | ✅ OK: Skip onboarding, go straight to app |
| "Complex permission/role system" | Solo user feels overwhelmed | ✅ OK: Every user = Admin in MVP |

---

## **8. The ONE Thing (Konkluzja)**

### **Primary Focus: Stage 3 (First Data Input)**

> **Jeśli użytkownik nie doda pierwszego zgłoszenia w < 2 minuty, journey jest martwy.**

**Krytyczne zmiany do implementacji:**
1. **Pre-filled form:** "Mieszkanie testowe + Cieknący kran + [Pomiń zdjęcie]" → jeden guzik "Zapisz"
2. **Zero friction:** Tylko 3 pola (mieszkanie, tytuł, zdjęcie), reszta opcjonalna
3. **Instant feedback:** "✓ Zapisano" w < 1 sekundę
4. **Clear next step:** "Dodaj kolejne zgłoszenie" LUB "Zmień status na 'W trakcie'"

**Jeśli to działa:**
- Sign-up → First Value: > 70%
- Time-to-First-Value: < 3 minuty
- Day 1 Return: > 40%

**Jeśli to NIE działa:**
- Użytkownik nigdy nie zobaczy Aha Moment (Stage 5)
- Konwersja na paid: 0%

---

## **Checklista Gotowości do Startu**

- [x] Success Metric zdefiniowany: < 5 min od landing do first report
- [x] 7 stadiów journey zmapowane
- [x] Friction points zidentyfikowane (9 punktów do poprawy)
- [x] Primary bottleneck: Stage 3 (First Data Input)
- [x] Quick wins zdefiniowane (3 zmiany w < 4h)
- [x] Metryki do śledzenia po launch
- [ ] ~~Metryki rzeczywiste po launch~~ (wymaga wdrożenia analytics)

---

## **Sugerowany Next Step**

**WF_Retention_Loop** — zaprojektować mechanizmy retencji użytkowników po pierwszym tygodniu:
1. Email sequence (dzień 1, 3, 7)
2. In-app notifications (status changes, reminders)
3. "Success story" prompts ("Czy wiesz, że możesz...?")

LUB

**WF_GTM_Strategy** — zaplanować acquisition channele dla pierwszych 10 użytkowników (cold DM do landlordów na Facebook grupach, Polish PropTech community).
