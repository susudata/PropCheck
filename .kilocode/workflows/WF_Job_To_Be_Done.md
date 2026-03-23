# WF_Job_To_Be_Done

**Cel:** Zidentyfikować rzeczywiste zadania, które użytkownicy próbują zrealizować, oraz warunki sukcesu (desired outcomes). Skonstruowane z myślą o Solo-Deva: szybko, mierzalnie i nastawione na walidację hipotez.

**Jak używać:** Wypełnij sekcje dla jednego ICP (Ideal Customer Profile). Zbierz 5–10 krótkich wywiadów lub obserwacji produktu, a następnie wpisz je w szablon "Job Snapshot". Skup się na kontekście, motywacjach i kryteriach sukcesu.

**Zasady:** Lean First, Distribution First, Solo-Dev Empathy, Data-Driven Skepticism — każdą obserwację traktuj jak hipotezę do przetestowania.

**Struktura pliku:**

**Summary**
- **Hipoteza problemu:** (1 zdanie)
- **Target ICP:** (kto, profil, stanowisko/funkcja)
- **Top insight:** (najważniejsze odkrycie z sesji JTBD)

**JTBD Template (do wypełnienia dla każdego przypadku)**
- **Context (kiedy):** Opisz sytuację, w której użytkownik działał.
- **Motivation (dlaczego):** Co skłoniło go do szukania rozwiązania?
- **Desired Outcome (sukces):** Co musi się stać, żeby użytkownik powiedział "to działa"?
- **Current Solution / Workaround:** Co robi teraz (narzędzia/manualne kroki)?
- **Barriers / Pain Points:** Co najczęściej przerywa lub komplikuje pracę?
- **Trigger (co uruchamia potrzebę):** zdarzenie / KPI / deadline itp.
- **Wartość (w liczbach):** czas oszczędzony, koszty, strata przy błędzie — jeśli możliwe.
- **Confidence (0–10):** jak pewne są dane (opinia vs obserwacja vs telemetry)

**Job Snapshot — przykład wpisu**
- **Context:** "Rano, przed pierwszym meetingiem, kiedy muszę szybko przygotować raport dla klienta."
- **Motivation:** "Nie chcę tracić czasu na formatowanie, muszę mieć gotowy PDF w 10 minut."
- **Desired Outcome:** "Gotowy raport w 10 min, poprawnie sformatowany, z wykresami z ostatnich 30 dni."
- **Current Solution:** "Eksport CSV -> Excel -> ręczne wykresy -> eksport do PDF."
- **Barriers:** "Ręczna praca, błędy w formułach, brak automatyzacji." 
- **Trigger:** "Dzień raportowy co poniedziałek lub nagła prośba klienta."
- **Wartość:** "~2 godziny oszczędności na raporcie, 5 raportów/miesiąc -> 10h/mies.")
- **Confidence:** 7

**Syntetyczna Analiza (po zebraniu 5–10 snapshotów)**
- **Top 3 Jobs:** wypisz najczęściej powtarzające się zadania (1 linia każde).
- **Top 3 Desired Outcomes:** co użytkownicy uznają za sukces (mierzalne kryteria).
- **Primary Pain Drivers:** zidentyfikuj 3 główne przyczyny bólu.
- **Variability:** w jakich sytuacjach job się różni (segmentacja ICP).

**Opportunity Mapping (jak to przekuć w MVP)**
- **Core Job-to-be-Done (wybierz 1):** (najlepsza kombinacja palączości i łatwości rozwiązania)
- **Minimum success criteria:** co musi robić MVP, żeby użytkownik uznał go za wartościowy (3 kryteria).
- **Quick experiments:** 3 krótkie testy do przeprowadzenia (landing page, zapisy, prosty manual concierge, prefill flows).

**Risks [RISKS]**
- **False positives:** użytkownicy deklarują potrzebę, ale nie zapłacą.
- **Edge-case fragmentation:** jobs są mocno specyficzne, trudne do uogólnienia.
- **High manual work:** rozwiązanie wymaga dużo ręcznej konfiguracji/supportu.

**MVP Scope (konkretnie dla Solo-Deva)**
- **Essential:** 1 core flow realizujący Core Job-to-be-Done + 1 integracja (np. import danych) + szybki onboarding.
- **Analytics:** track time-to-first-value i % użytkowników, którzy osiągnęli Desired Outcome.
- **Do not build yet:** enterprise features, custom on-prem, heavy role management.

**Metrics to Track**
- **Activation:** % users reaching desired outcome in first session
- **Engagement:** repeat usage per week
- **Monetization:** percent converting to paid after achieving success
- **Efficiency:** manual hours per successful outcome

**Interview Script (krótki, 7 pytań)**
1. "Opowiedz mi o ostatnim razie, kiedy próbowałeś to zrobić." (Context)
2. "Co wtedy dokładnie robiłeś krok po kroku?" (Current solution)
3. "Co było najgorsze w tym procesie?" (Pain)
4. "Jak rozpoznasz, że to rozwiązanie zadziałało?" (Desired outcome)
5. "Ile czasu/kosztu to zabiera teraz?" (Value)
6. "Co byś zapłacił za prostsze rozwiązanie?" (Willingness-to-pay)
7. "Czy próbowałeś czegoś innego? Dlaczego to nie zadziałało?" (Alternatives)

**Checklista zbierania danych**
- [ ] 5–10 wypełnionych Job Snapshotów
- [ ] Co najmniej 2 przytoczone metryki wartości (czas/koszt)
- [ ] Zidentyfikowany Core Job-to-be-Done
- [ ] 3 propozycje szybkich eksperymentów

**Next Steps**
- **Sugerowany kolejny workflow:** `WF_MVP_Scoping` — zdefiniuj minimalny produkt realizujący Core Job.
- **Szybki eksperyment:** Strona docelowa + prosty formularz pre-signup + outreach do 20 potencjalnych użytkowników.

**Interaktywne pytanie (do Ciebie)**
- Który ICP chcesz zbadać najpierw? Podaj krótki opis lub 3 kontakty użytkowników — mogę przygotować skrypt wywiadu i wypełnić pierwszy zestaw snapshotów.

