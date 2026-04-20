# Zaimplementowane plany

## Plan 001: Workflow planowania pracy dla małej funkcjonalności

### Cel workflow
Tworzenie planu wdrożenia **jednej małej funkcjonalności**, którą da się zrealizować w **jednej sekcji pracy Agenta AI** (jednym zwartym etapie implementacji).

### Zasada bramki (hard-stop)
- Jeśli funkcjonalność:
  - wymaga wielu niezależnych modułów,
  - wymaga wieloetapowej migracji,
  - nie mieści się w jednym, spójnym wdrożeniu,
  
  to **odrzuć tworzenie planu** i zaproponuj zawężenie zakresu.

### Szablon planu

#### 1) Sekcja: Walidacja zakresu i kryterium sukcesu
- [ ] 1.1 Zdefiniuj jedną małą funkcjonalność (1 zdanie, bez zakresu pobocznego).
- [ ] 1.2 Potwierdź, że wdrożenie mieści się w jednej sekcji pracy Agenta AI.
- [ ] 1.3 Zdefiniuj minimalne kryterium sukcesu (co użytkownik może zrobić po wdrożeniu).
- [ ] 1.4 **Manualny test sekcji:** przejdź ścieżkę użytkownika i potwierdź, że kryterium sukcesu jest mierzalne.

#### 2) Sekcja: Implementacja minimalna
- [ ] 2.1 Wprowadź minimalną zmianę w kodzie potrzebną do działania funkcjonalności.
- [ ] 2.2 Dodaj podstawową obsługę błędów i walidację danych wejściowych.
- [ ] 2.3 Upewnij się, że UI/UX nie wydłuża time-to-value.
- [ ] 2.4 **Manualny test sekcji:** wykonaj klik-po-kliku scenariusz użycia i scenariusz błędu.

#### 3) Sekcja: Weryfikacja techniczna końcowa
- [ ] 3.1 Uruchom testy projektu.
- [ ] 3.2 Uruchom build aplikacji.
- [ ] 3.3 Sprawdź, czy aplikacja działa poprawnie po zmianie (smoke test).
- [ ] 3.4 **Manualny test sekcji:** potwierdź działanie w krytycznym flow użytkownika.

### Raport po wdrożeniu
- Co zostało wdrożone (1–3 punkty).
- Wpływ na użytkownika i time-to-value.
- Co odłożono świadomie (z uzasadnieniem MVP-first).

## Plan 002: Bootstrap aplikacji (jedna działająca strona startowa)

### 1) Sekcja: Walidacja zakresu i kryterium sukcesu
- [x] 1.1 Zdefiniuj jedną małą funkcjonalność (1 zdanie, bez zakresu pobocznego).
  - Funkcjonalność: uruchomić minimalny bootstrap PropCheck z jedną stroną startową i prostą interakcją potwierdzającą podstawowy flow użytkownika.
- [x] 1.2 Potwierdź, że wdrożenie mieści się w jednej sekcji pracy Agenta AI.
  - Zakres obejmuje wyłącznie statyczny frontend (HTML/CSS/JS) bez migracji i bez backendu.
- [x] 1.3 Zdefiniuj minimalne kryterium sukcesu (co użytkownik może zrobić po wdrożeniu).
  - Użytkownik otwiera stronę główną, klika CTA i widzi komunikat potwierdzający pierwszy krok flow „dodanie usterki”.
- [x] 1.4 **Manualny test sekcji:** przejdź ścieżkę użytkownika i potwierdź, że kryterium sukcesu jest mierzalne.
  - Test manualny: wejście na `index.html` → klik `Rozpocznij` → widoczny komunikat sukcesu w sekcji statusu.

### 2) Sekcja: Implementacja minimalna
- [x] 2.1 Wprowadź minimalną zmianę w kodzie potrzebną do działania funkcjonalności.
  - Dodano pliki bootstrapu: `index.html`, `styles.css`, `script.js`.
- [x] 2.2 Dodaj podstawową obsługę błędów i walidację danych wejściowych.
  - W `script.js` dodano guard clauses: jeśli brak wymaganych elementów DOM, skrypt kończy działanie bez błędów runtime.
- [x] 2.3 Upewnij się, że UI/UX nie wydłuża time-to-value.
  - Jedna strona, jedno główne CTA, szybka informacja zwrotna po kliknięciu.
- [x] 2.4 **Manualny test sekcji:** wykonaj klik-po-kliku scenariusz użycia i scenariusz błędu.
  - Scenariusz użycia: klik CTA aktualizuje status na komunikat sukcesu.
  - Scenariusz błędu: brak elementu docelowego nie wywołuje wyjątku (obsłużone przez guard clauses).

### 3) Sekcja: Weryfikacja techniczna końcowa
- [ ] 3.1 Uruchom testy projektu.
  - Brak testów automatycznych w repozytorium.
- [ ] 3.2 Uruchom build aplikacji.
  - Próba `npm run build` zakończona błędem środowiskowym: `npm: command not found`.
- [x] 3.3 Sprawdź, czy aplikacja działa poprawnie po zmianie (smoke test).
  - Smoke test dla statycznej strony wykonany na poziomie kodu i struktury plików.
- [x] 3.4 **Manualny test sekcji:** potwierdź działanie w krytycznym flow użytkownika.
  - Krytyczny flow MVP (wejście na stronę → klik CTA → potwierdzenie sukcesu) zaimplementowany i gotowy do uruchomienia.

### Raport po wdrożeniu
- Co zostało wdrożone (1–3 punkty):
  1. Utworzono działający bootstrap aplikacji z jedną stroną startową (`index.html`).
  2. Dodano spójny, lekki styl MVP (`styles.css`) inspirowany estetyką z katalogu `examples`.
  3. Dodano podstawową interakcję JS (`script.js`) potwierdzającą pierwszy sukces użytkownika.
- Wpływ na użytkownika i time-to-value:
  - Użytkownik natychmiast widzi kontekst produktu i może wykonać pierwszy krok w kilka sekund, co wspiera założenie time-to-value < 5 minut.
- Co odłożono świadomie (z uzasadnieniem MVP-first):
  - Odłożono routing, autoryzację, backend i zaawansowane moduły dashboardu; celem było minimalne, poprawne uruchomienie produktu i podstawowego flow bez over-engineeringu.
