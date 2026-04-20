# Workflow: Planowanie pracy dla małej funkcjonalności (AI Developer)

## Cel workflow
Tworzenie planu wdrożenia **jednej małej funkcjonalności**, którą da się zrealizować w **jednej sekcji pracy Agenta AI** (jednym zwartym etapie implementacji).

## Zasada bramki (hard-stop)
- Jeśli funkcjonalność:
  - wymaga wielu niezależnych modułów,
  - wymaga wieloetapowej migracji,
  - nie mieści się w jednym, spójnym wdrożeniu,
  
  to **odrzuć tworzenie planu** i zaproponuj zawężenie zakresu.

## Szablon planu (do użycia przez Agenta)

> Uwaga: Każdy element jest **numerowanym checkboxem**. Po **każdej sekcji** musi wystąpić krok manualnego testu.

### 1) Sekcja: Walidacja zakresu i kryterium sukcesu
- [ ] 1.1 Zdefiniuj jedną małą funkcjonalność (1 zdanie, bez zakresu pobocznego).
- [ ] 1.2 Potwierdź, że wdrożenie mieści się w jednej sekcji pracy Agenta AI.
- [ ] 1.3 Zdefiniuj minimalne kryterium sukcesu (co użytkownik może zrobić po wdrożeniu).
- [ ] 1.4 **Manualny test sekcji:** przejdź ścieżkę użytkownika i potwierdź, że kryterium sukcesu jest mierzalne.

### 2) Sekcja: Implementacja minimalna
- [ ] 2.1 Wprowadź minimalną zmianę w kodzie potrzebną do działania funkcjonalności.
- [ ] 2.2 Dodaj podstawową obsługę błędów i walidację danych wejściowych.
- [ ] 2.3 Upewnij się, że UI/UX nie wydłuża time-to-value.
- [ ] 2.4 **Manualny test sekcji:** wykonaj klik-po-kliku scenariusz użycia i scenariusz błędu.

### 3) Sekcja: Weryfikacja techniczna końcowa
- [ ] 3.1 Uruchom testy projektu.
- [ ] 3.2 Uruchom build aplikacji.
- [ ] 3.3 Sprawdź, czy aplikacja działa poprawnie po zmianie (smoke test).
- [ ] 3.4 **Manualny test sekcji:** potwierdź działanie w krytycznym flow użytkownika.

## Format raportu po wdrożeniu
- Co zostało wdrożone (1–3 punkty).
- Wpływ na użytkownika i time-to-value.
- Co odłożono świadomie (z uzasadnieniem MVP-first).
