## WF_ICP_Persona — Wynik dla PropCheck

---

## 🎯 ICP Card (1-stronicowy profil)

| Element | Opis |
|---------|------|
| **Kto** | Zarządcy nieruchomości (B2B), landlordzi z portfelem 5-50 mieszkań, firmy zajmujące się "flipami" i krótkoterminowym wynajmem. Lokalizacja: Polska/polskojęzyczni użytkownicy. |
| **Co** | Muszą szybko identyfikować, dokumentować i delegować naprawy techniczne w wielu lokalizacjach jednocześnie. |
| **Główny ból** | Setki nieuporządkowanych wiadomości ze zdjęciami na komunikatorach (WhatsApp/Messenger), brak historii usterek, trudność w śledzeniu statusu napraw, chaos przy delegowaniu zadań ekipom. |
| **Decision Criteria** | Szybkość wdrożenia ("działa od razu"), cena niższa niż koszt chaosu (zwrot z inwestycji w czasie), możliwość generowania profesjonalnych raportów dla podwykonawców. |

---

## 📋 Problem Matrix (5 problemów z priorytetyzacją)

| Problem | Trigger | Value Metryki | Current Solution | I | C | E | Priority | Suggested Experiment |
|---------|---------|---------------|------------------|---|---|---|----------|---------------------|
| **Chaos komunikacyjny** — lokatorzy zgłaszają usterki na różne kanały, zdjęcia giną w czacie | Przyjęcie nowego zgłoszenia awarii | 2-3h/tyg. oszczędności na szukaniu info; mniej pomyłek ekip remontowych | WhatsApp grupy, Messenger, e-maile | 9 | 8 | 9 | **648** | Landing page z kalkulatorem "Ile czasu tracisz na chaos?" |
| **Brak historii usterek** — nie wiadomo co było naprawiane, trudno udowodnić winę lokatora | Konflikt z lokatorem o stan mieszkania | Uniknięcie 1-2 kosztownych sporów/rok (2000-5000 PLN) | Brak / pamięć właściciela | 8 | 7 | 9 | **504** | Concierge MVP dla 3 zarządców — ręczne zakładanie kont i test użycia |
| **Trudność w delegowaniu** — ekipy nie rozumieją opisów, trzeba jechać "na miejsce" | Kontakt z nowym podwykonawcą | Oszczędność 1-2 wizyt kontrolnych/usterka (100-300 PLN + czas) | Telefon + wysyłanie zdjęć z opisem | 7 | 8 | 8 | **448** | Interview — 5 rozmów z ekipami remontowymi, czy rozumieją pinezki |
| **Brak profesjonalizmu** — wizerunek "dziadka z kluczami" zamiast firmy | Pierwszy kontakt z nowym lokatorem lub inwestorem | Wyższe czynsze (+5-10%), łatwiejsze pozyskiwanie inwestorów | Brak / osobisty PR | 6 | 5 | 8 | **240** | Case study landing page — "Jak wyglądać profesjonalnie" |
| **Rozproszone informacje** — trzeba logować się do 5 systemów, żeby zobaczyć status | Dzienny przegląd portfela | 30 min/dzień oszczędności; mniejszy stres operacyjny | Excel, różne platformy bookingowe, notatki | 7 | 6 | 7 | **294** | Integrations page — lista "łączymy z..." |

**Core Problem do natychmiastowego testu:** Chaos komunikacyjny (Priority 648, wysoka Ease = 9)

---

## 🎤 Interview Script (7 pytań JTBD)

1. Opowiedz o ostatnim razie, kiedy lokator zgłosił Ci awarię. Co dokładnie się stało?
2. Co robiłeś krok po kroku od momentu otrzymania zgłoszenia? (Gdzie zapisałeś? Jak przekazałeś ekipie?)
3. Co w tym procesie jest najbardziej frustrujące lub najwięcej czasu zabiera?
4. Jak rozpoznasz, że problem został rozwiązany dobrze? (Co oznacza "sukces" dla Ciebie?)
5. Ile czasu miesięcznie tracisz na organizację napraw? A ile na wyjaśnianie ekipom, co mają zrobić?
6. Ile byś był w stanie zapłacić miesięcznie za narzędzie, które uporządkuje Ci ten chaos?
7. Czy próbowałeś już czegoś innego? (Excel, Trello, inne aplikacje?) Dlaczego to nie zadziałało?

---

## [RISKS] Czerwone flagi

| Ryzyko | Poziom | Komentarz |
|--------|--------|-----------|
| **Rynek może być zbyt mały** | 🟡 Średnie | Zarządcy nieruchomości w Polsce — trzeba zweryfikować TAM |
| **Willingness-to-pay** | 🔴 Wysokie | Czy zarządcy faktycznie płacą za narzędzia, czy "jakoś to ogarniają"? |
| **Konkurencja z darmowymi rozwiązaniami** | 🟡 Średnie | WhatsApp + Google Photos + Excel to silny konkurent (zero kosztów) |
| **Skalowalność Solo-Dev** | 🟢 Niskie | Supabase + React to dobry wybór technologiczny |
| **Customer Acquisition Cost (CAC)** | 🔴 Wysokie | Jak dotrzesz do zarządców? To nie grupa z ProductHunt |

---

## ✅ Checklista końcowa

- [x] 1-stronicowa karta ICP
- [x] 5 Job Snapshotów (problemy w tabeli)
- [x] Problem Matrix z priorytetami (Impact × Confidence × Ease)
- [x] 3 propozycje szybkich eksperymentów (Landing page, Interview, Concierge MVP)
- [x] Interview Script (7 pytań JTBD)
- [x] Sekcja [RISKS] — czerwone flagi

### Sugerowany next step:
**Landing page z kalkulatorem czasu** → test komunikacji i willingness-to-pay przed budową MVP.

---

## 💡 Kluczowe pytanie do przemyślenia

> **Czy Twoi potencjalni klienci faktycznie szukają rozwiązania dla "chaosu komunikacyjnego", czy to problem, który akceptują jako "taka branża"?**

Zweryfikuj, czy to "must-have" (płacą za rozwiązanie) czy "nice-to-have" ("fajne, ale mamy WhatsAppa").