# WF_Job_To_Be_Done — PropCheck

---

## Summary

- **Hipoteza problemu:** Zarządcy nieruchomości i landlordzi tracą 2-3 godziny tygodniowo na organizowaniu zgłoszeń usterek z różnych kanałów (WhatsApp, Messenger, SMS), co powoduje chaos komunikacyjny, utratę zdjęć i opóźnienia w naprawach.

- **Target ICP:** Zarządcy nieruchomości (B2B) i landlordzi z portfelem 5-50 mieszkań w Polsce. Osoby odpowiedzialne za delegowanie napraw technicznych, prowadzące komunikację z lokatorami i ekipami remontowymi.

- **Top insight:** Użytkownicy nie szukają "systemu do zarządzania nieruchomościami" — szukają sposobu na uporządkowanie chaosu ze zgłoszeniami awarii w 5 minut, bez uczenia się nowego narzędzia. Ich obecne rozwiązanie to WhatsApp + Google Photos + Excel, które kosztuje 0 PLN i nie wymaga wdrożenia.

---

## JTBD Template — Job Snapshots

### Job Snapshot #1: "Szybkie zgłoszenie od lokatora"

| Element | Opis |
|---------|------|
| **Context** | Poniedziałek rano, zarządca otrzymuje wiadomość od lokatora: "Pani, cieknie kran w łazience, proszę o naprawę" + 2 zdjęcia w WhatsApp. |
| **Motivation** | Chce szybko zareagować, nie pogorszyć relacji z lokatorem, ale jednocześnie nie tracić czasu na organizację. |
| **Desired Outcome** | Zgłoszenie zapisane w jednym miejscu, z zdjęciami, z terminem i statusem "do zlecenia" — w ciągu 2 minut od otrzymania. |
| **Current Solution** | Przekazuje zdjęcia na Google Photos, pisze notatkę w Excelu, wysyła zdjęcie do ekipy przez WhatsApp. |
| **Barriers** | Zdjęcia giną w czacie, brak historii kiedy co było naprawiane, trudno śledzić status. |
| **Trigger** | Nowe zgłoszenie awarii od lokatora (SMS/WhatsApp/Messenger). |
| **Wartość** | ~15-20 min na zgłoszenie × 20 zgłoszeń/miesiąc = 5-6h/mies. oszczędności + mniej pomyłek ekip. |
| **Confidence** | 8 (oparte na ICP_Persona interview script i problem matrix) |

---

### Job Snapshot #2: "Delegowanie zlecenia do ekipy"

| Element | Opis |
|---------|------|
| **Context** | Zarządca ma 3 usterki do zlecenia tego samego dnia: cieknący kran, niedziałający bojler, pęknięta szyba. Ekipa przyjeżdża jutro rano. |
| **Motivation** | Chce, żeby ekipa wiedziała dokładnie co i gdzie naprawić, bez konieczności jechania samemu na wizytę lokalizacyjną. |
| **Desired Outcome** | Jasne instrukcje z zdjęciami i adresem dla każdej usterki, wysłane w jeden klik — gotowe do pokazania ekipie. |
| **Current Solution** | Wysyła 3 osobne wiadomości WhatsApp z opisem + zdjęcia, dodaje adresy w osobnej wiadomości. |
| **Barriers** | Ekipa nie rozumie opisów, pyta "gdzie to jest?", trzeba dzwonić i tłumaczyć. |
| **Trigger** | Planowanie wizyty ekipy remontowej, zwykle dzień przed lub w dniu wizyty. |
| **Wartość** | Oszczędność 1-2 wizyt lokalizacyjnych na usterkę = 100-300 PLN + czas. Przy 10 usterkach/mies = 1000-3000 PLN oszczędności. |
| **Confidence** | 7 (oparte na problem matrix "Trudność w delegowaniu") |

---

### Job Snapshot #3: "Sprawdzenie historii napraw przed wynajmem"

| Element | Opis |
|---------|------|
| **Context** | Nowy najemca wchodzi do mieszkania. Zarządca chce udowodnić, że stan mieszkania był dobry przy przekazaniu, a ewentualne zużycie to wina lokatora. |
| **Motivation** | Uniknąć sporu o zwrot kaucji, mieć profesjonalny dowód stanu technicznego. |
| **Desired Outcome** | Raport z historią wszystkich napraw w tym mieszkaniu, z datami i kosztami — gotowy w 30 sekund. |
| **Current Solution** | Przeszukuje własne notatki, zdjęcia w telefonie, próbuje sobie przypomnieć. Często: "nie wiem, nie mam tego". |
| **Brak historii usterek** | Nie wiadomo co było naprawiane, trudno udowodnić winę lokatora. |
| **Trigger** | Konflikt z lokatorem o stan mieszkania, koniec najmu, przekazanie mieszkania. |
| **Wartość** | Uniknięcie 1-2 kosztownych sporów/rok = 2000-5000 PLN oszczędności. |
| **Confidence** | 7 (oparte na problem matrix "Brak historii usterek") |

---

### Job Snapshot #4: "Generowanie raportu dla podwykonawcy"

| Element | Opis |
|---------|------|
| **Context** | Nowa ekipa remontowa będzie robić generalny remont mieszkania. Zarządca chce im dać profesjonalny dokument z wszystkimi usterkami do naprawienia. |
| **Motivation** | Budować profesjonalny wizerunek, nie być "dziadkiem z kluczami". Ułatwić ekipie wycenę i pracę. |
| **Desired Outcome** | Profesjonalny PDF z listą usterek, zdjęciami, lokalizacją na rzutach — gotowy w 2 minuty. |
| **Current Solution** | Robi screenshoty z WhatsApp, łączy w Wordzie, drukuje lub wysyła pliki. Wygląda amatorsko. |
| **Barriers** | Brak profesjonalizmu, trudno zebrać wszystko w jeden dokument, różne formaty zdjęć. |
| **Trigger** | Nowy podwykonawca, generalny remont, pierwszy kontakt z nową ekipą. |
| **Wartość** | Wyższe czynsze (+5-10%), łatwiejsze pozyskiwanie inwestorów, lepsze relacje z profesjonalnymi ekipami. |
| **Confidence** | 5 (oparte na problem matrix "Brak profesjonalizmu") |

---

### Job Snapshot #5: "Poranny przegląd statusu napraw"

| Element | Opis |
|---------|------|
| **Context** | Środa rano, przed pierwszym spotkaniem. Zarządca chce w 2 minuty zobaczyć: ile jest aktywnych zgłoszeń, które czekają na ekipę, które są w trakcie. |
| **Motivation** | Kontrolować sytuację, wiedzieć co się dzieje w portfelu nieruchomości, nie być zaskoczonym przy rozmowie z właścicielem. |
| **Desired Outcome** | Dashboard z statusami wszystkich usterek: nowe → w trakcie → do sprawdzenia → zakończone. Wszystko w jednym widoku. |
| **Current Solution** | Przeszukuje WhatsApp, sprawdza różne wątki, próbuje sobie przypomnieć status. Często: "chyba jeszcze nie naprawili". |
| **Barriers** | Rozproszone informacje, brak centralnego widoku, trzeba logować się do wielu systemów. |
| **Trigger** | Codzienny przegląd portfela, spotkanie z właścicielem nieruchomości, raportowanie. |
| **Wartość** | 30 min/dzień oszczędności = ~10h/mies. + mniejszy stres operacyjny. |
| **Confidence** | 6 (oparte na problem matrix "Rozproszone informacje") |

---

## Syntetyczna Analiza

### Top 3 Jobs (najczęstsze zadania)

1. **Szybkie uporządkowanie zgłoszenia od lokatora** — "muszę to gdzieś zapisać i nie zgubić"
2. **Delegowanie zlecenia do ekipy** — "muszę jasno przekazać co i gdzie naprawić"
3. **Sprawdzenie historii napraw** — "co było już naprawiane w tym mieszkaniu?"

### Top 3 Desired Outcomes (mierzalne kryteria sukcesu)

1. **"W 2 minuty mam zgłoszenie zapisane z zdjęciami i statusem"** — time-to-first-value < 2 min
2. **"Jeden klik = gotowy PDF dla ekipy"** — instant professional report
3. **"Widzę wszystkie statusy w jednym widoku"** — dashboard z wszystkimi usterkami

### Primary Pain Drivers (główne przyczyny bólu)

1. **Rozproszenie kanałów** — WhatsApp, Messenger, SMS, e-mail, zdjęcia w różnych miejscach
2. **Brak historii** — nie da się sprawdzić co było naprawiane, kiedy, za ile
3. **Brak wizualizacji** — trudno pokazać ekipie "gdzie to jest" bez wizyty

### Variability (segmentacja ICP)

| Segment | Specyfika job |
|---------|---------------|
| **Micro-landlordzi (5-15 mieszkań)** | Samodzielne zarządzanie, niski próg bólu, akceptują chaos |
| **Średni zarządcy (15-50 mieszkań)** | Pierwsze oznaki bólu, gotowi płacić za porządek |
| **Firmy PM / flipperzy** | Wysokie wymagania, profesjonalizm kluczowy, wyższa cena akceptowalna |

---

## Opportunity Mapping

### Core Job-to-be-Done (wybierz 1)

**"Szybkie uporządkowanie zgłoszenia od lokatora"** — to jest najlepsza kombinacja:
- Najwyższy priorytet (648 w ICE)
- Najwyższa łatwość (Ease = 9)
- Najszybciej walidowalne (2 min time-to-value)

### Minimum success criteria (3 kryteria dla MVP)

1. **Otrzymanie zgłoszenia** — użytkownik może w 2 minuty dodać zgłoszenie z zdjęciem (upload lub przeklej z WhatsApp)
2. **Status tracking** — widać status: nowe → w trakcie → zakończone
3. **Historia** — można sprawdzić historię napraw w danym mieszkaniu

### Quick experiments (3 szybkie testy)

1. **Landing page z kalkulatorem** — "Ile czasu tracisz na chaos?" → pre-signup z emailem
2. **Concierge MVP** — dla 3 zarządców: ręczne zakładanie kont, oni testują, Ty obserwujesz
3. **Manualny flow** — Ty jako "asystent" przyjmujesz zgłoszenia przez WhatsApp, wprowadzasz do systemu, wysyłasz raporty — symulacja przed budową

---

## [RISKS] — Czerwone flagi

| Ryzyko | Poziom | Komentarz |
|--------|--------|-----------|
| **False positives** — użytkownicy deklarują potrzebę, ale nie zapłacą | 🔴 Wysokie | Landlordzi w Polsce przyzwyczajeni do darmowych rozwiązań (WhatsApp + Excel). Test: czy faktycznie zostawią email na landing page? |
| **Edge-case fragmentation** — jobs są mocno specyficzne | 🟡 Średnie | Micro-landlordzi vs firmy PM to różne potrzeby. MVP musi obsłużyć oba lub wybrać jeden segment. |
| **High manual work** — rozwiązanie wymaga dużo ręcznej konfiguracji | 🟡 Średnie | Jeśli onboarding trwa > 10 min, użytkownicy zrezygnują. Musi działać "od razu". |
| **Zero willingness-to-pay** | 🔴 Wysokie | "Przecież mam WhatsAppa za darmo" — główna bariera. MVP musi pokazać wartość w 2 minuty. |
| **Konkurencja copy** | 🟡 Średnie | RentRedi może dodać pinezkowanie w 3-6 miesięcy. Trzeba być pierwszym na rynku PL. |

---

## MVP Scope (konkretnie dla Solo-Deva)

### Essential (buduj)

1. **Core flow:** Upload rzutu mieszkania → dodaj pinezkę z usterką → statusy (nowe/w trakcie/gotowe)
2. **Szybki onboarding:** Konto w 1 krok, dodaj pierwsze mieszkanie w 30 sekund
3. **Integracja importu:** Przeciągnij zdjęcia z WhatsApp / wklej link

### Analytics (śledź)

- **Time-to-first-value:** Ile czasu od rejestracji do pierwszego zgłoszenia?
- **% użytkowników osiągających Desired Outcome:** Ilu dodało 3+ zgłoszenia w pierwszym tygodniu?
- **Retention:** Ilu wraca po 7 dniach?

### Do NOT build yet (nie buduj)

- Role management (admin/user/ekipa)
- SSO / SAML
- API
- Marketplace ekip
- On-premise wersja
- Wielojęzyczność (na start tylko PL)

---

## Metrics to Track

| Metryka | Cel | Jak mierzyć |
|---------|-----|-------------|
| **Activation** | 50% użytkowników dodaje zgłoszenie w pierwszej sesji | Event: first_report_created |
| **Engagement** | 3x użycia tygodniowo po aktywacji | Event: report_created, session_start |
| **Monetization** | 5% konwersji na płatny po 14 dniach | Stripe webhook, trial_ended |
| **Efficiency** | < 2 min na dodanie zgloszenia | Time tracking w aplikacji |

---

## Interaktywne pytanie

**Który segment ICP chcesz zbadać jako pierwszy?**

1. **Micro-landlordzi (5-15 mieszkań)** — najłatwiej dotrzeć, najniższy próg wejścia, ale najniższa gotowość do płacenia
2. **Średni zarządcy (15-50 mieszkań)** — balans między bólem a budżetem, prawdopodobnie najlepszy segment MVP
3. **Firmy PM / flipperzy** — najwyższa gotowość do płacenia, ale wyższe wymagania produktowe

**Sugerowany next step:** `WF_MVP_Scoping` — zdefiniuj minimalny produkt realizujący Core Job "szybkie uporządkowanie zgłoszenia".

---

## Checklista zbierania danych

- [x] 5 Job Snapshots (syntetyczne, oparte na ICP_Persona)
- [x] 3 metryki wartości (czas oszczędności, koszty uniknięcia sporów, wizyty lokalizacyjne)
- [x] Zidentyfikowany Core Job-to-be-Done
- [x] 3 propozycje szybkich eksperymentów
- [x] Sekcja [RISKS] — czerwone flagi
- [x] MVP Scope dla Solo-Deva

