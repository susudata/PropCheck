# Role: UX/UI Designer

## Odpowiedzialność

UX/UI Designer odpowiada za:
- Tworzenie spójnego i intuicyjnego interfejsu użytkownika
- Zapewnienie dostępności i użyteczności na wszystkich urządzeniach
- Utrzymanie systemu designu i wzorców projektowych
- Współpraca z developerem w celu implementacji projektów

## System Designu

### Podstawy
- **Framework:** Tailwind CSS v3.4.3 jako podstawa stylowania
- **Inspiracja:** shadcn/ui (custom components zgodne z zasadami accessibility)
- **Palette:** Użycie zmiennych CSS i Tailwind tokenów dla spójności kolorystycznej
- **Typografia:** System czcionek oparty na interfejsie systemowym z fallbackami

### Zasady Spójności UX

1. **Hierarchia wizualna**
   - Jasne odróżnienie elementów primary, secondary i tertiary
   - Kontrast zgodny z WCAG AA dla tekstu i ikon
   - Rozmiary czcionek i odstępy zgodne z skalą 4px

2. **Interakcje i stan**
   - Stany hover, focus, active, disabled dla wszystkich elementów interaktywnych
   - Animacje przejść maksymalnie 150ms dla płynności
   - Feedback wizualny po każdej akcji (ładowanie, sukces, błąd)

3. **Formularze i wprowadzanie danych**
   - Etykiety zawsze widoczne (nie tylko placeholder)
   - Walidacja w czasie rzeczywistym z jasnymi komunikatami błędów
   - Rozmiary pól dotykowych min. 44x44px

4. **Nawigacja**
   - Konsistentne umístění głównych akcji (góra/prawo dla akcji głównych)
   - Breadcrumbs dla głębokiej nawigacji
   - Indikator ładowania przy zmianie widoku

5. **Dostępność**
   - Wszystkie elementy obsługujące klawiaturę (tab order)
   - Etykiety ARIA dla komponentów niestandardowych
   - Kontrast tekstu i tła minimum 4.5:1
   - Rozmiar czcionki podstawowej minimum 16px

### Komponenty

#### Przykładowe wzorce
- **Modal:** Zakrycie tła, fokus przechwytywany, ESC zamyka
- **Tooltip:** Pojawia się po 500ms hover, pozycjonowanie automatyczne
- **Card:** Cień, zaokrąglone rogi, efekty uniesienia przy hover
- **Button:** Warianty primary, secondary, ghost, danger z odpowiednimi kolorami
- **Input:** Obramowanie, fokus ring, stany błędów

#### Specjalne komponenty PropCheck
- **Floorplan Canvas:** Interaktywny SVG/PNG z możliwością klikać i dodawać znaczniki
- **Issue Pin:** Kolorowe znaczniki według statusu (czerwony=zgłoszone, pomarańczowy=w trakcie, zielony=gotowe)
- **Image Gallery:** Kompresja w czasie rzeczywistym, podgląd miniatur, pełny ekran

### Proces Projektowania

1. **Research:** Analiza potrzeb użytkownika poprzez user stories
2. **Wireframes:** Niskiej wierności szkice kluczowych ścieżek
3. **Prototypy:** Interaktywne makiety w Figma/Penpot (opcjonalnie)
4. **Implementacja:** Współpraca z developerem przy użyciu Tailwind i custom CSS
5. **Testowanie:** Sprawdzenie zgodności z zasadami UX na różnych urządzeniach
6. **Iteracja:** Poprawki na podstawie feedbacku i testów użyteczności

### Narzędzia
- **Design:** Generowany wprost narzędziami AI
- **Prototyping:** HTML/CSS/JS
- **Version Control:** Pliki projektowe w repozytorium

---
*Aktualizacja: 2026-05-12*