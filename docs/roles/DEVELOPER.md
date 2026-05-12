# Role: Developer / Inżynier Oprogramowania

## Odpowiedzialność

Developer odpowiada za:
- Implementację funkcjonalności zgodnie z wymaganiami i projektami
- Pisanie czystego, utrzymywalnego i wydajnego kodu Vanilla JS
- Rozwiązywanie bugów i optymalizację wydajności
- Współpraca z UX/UI Designerem i Architektem Technicznym
- Aktualizację dokumentacji technicznej

## Standardy Pisania kodu Vanilla JS

### 1. Język i funkcje ES6+
- **Używaj const i let** zamiast var dla lepszego zakresu blokowego
- **Funkcje strzałkowe** dla krótkich callbacków i metod obiektów
- **Destrukturyzacja** obiektów i tablic dla czystszej asignacji
- **Template literates** (`) do interpolacji stringów i wieloliniowych tekstów
- **Parametry domyślne** i **rest/spread operator** gdzie odpowiednie
- **Async/await** dla operacji asynchronicznych zamiast łańcuchów .then()
- **Moduły ES6** (import/export) jeśli kod zostanie podzielony na pliki (obecnie jeden plik script.js)

### 2. Struktura i organizacja kodu
- **Modułowy wzorzec** lub prosta funkcja zamykająca (IIFE) aby uniknąć zanieczyszczenia przestrzeni globalnej
- **Podział na logiczne sekcje:**
  - Stałe (CONFIG, SELECTORS, STRINGI)
  - Funkcje pomocnicze (utils)
  - Funkcje stanu i zarządzania danymi
  - Funkcje renderowania i manipulacji DOM
  - Obsługa zdarzeń (event listeners)
  - Inicjalizacja aplikacji
- **Nazewnictwo:**
  - `camelCase` dla zmiennych i funkcji
  - `UPPER_CASE` dla stałych
  - Descriptive nazwy funkcji wyrażających akcję (np. `addProperty()`, `renderIssuesList()`)
  - Prefiksy `is/has` dla wartości booleanowych (np. `isValidForm()`)
  - Prefiksy `get/set` dla funkcji dostępu (np. `getPropertiesFromStorage()`)

### 3. Manipulacja DOM
- **Buforowanie selektorów:** Przechowuj często używane elementy DOM w zmiennych na górze pliku
- **Unikanie częstego dostępu do DOM:** Zbieraj zmiany i aplikuj je partiami
- **Bezpieczne ustawianie treści:** Używaj `textContent` dla tekstu, `innerHTML` tylko dla zaufanego HTML (z poprzednim escapeowaniem)
- **Tworzenie elementów:** Preferuj `document.createElement()` nad `innerHTML` dla złożonych struktur
- **Delegacja zdarzeń:** Przyłączaj nasłuchiwacze do stałych rodziców dla dynamicznie tworzonych elementów

### 4. Zarządzanie stanem (State Management)
- **Prosty obiekt stanu:** Przechowuj stan aplikacji w jednym obiekcie (np. `appState`)
- **Nie modyfikuj stanu bezpośrednio:** Używaj funkcji setterów które aktualizują stan i wywołują renderowanie
- **Immutability:** Gdzie możliwe, traktuj obiekty stanu jako niemutowalne (twórz nowe kopie zamiast modyfikować)
- **Persystencja:** Automatycznie zapisuj stan do localStorage po każdej zmianie (z debounce'em dla częstych operacji)

### 5. Obsługa zdarzeń
- **Delegacja zdarzeń:** Dla list dynamicznych elementów (np. lista usterek) używaj jednego nasłuchiwacza na rodzicu
- **Usuwanie nasłuchiwaczy:** Przy usuwaniu elementów DOM lub zamykaniu modałów, usuwaj nasłuchiwacze aby zapobiec wyciekom pamięci
- **Pasywne nasłuchiwacze:** Używaj `{passive: true}` dla zdarzeń przewijania i dotykowych gdzie odpowiednie
- **Zapobieganie domyślnej akcji:** Wywołuj `event.preventDefault()` tylko gdy konieczne (np. przy przesyłaniu formularza)

### 6. Obsługa błędów
- **Bloki try/catch:** Otaczaj operacje asynchroniczne (np. kompresja obrazów, dostęp do localStorage) blokami try/catch
- **Komunikaty użytkownikowi:** Pokazuj przyjazne komunikaty błędów w interfejsie (nie tylko w konsoli)
- **Walidacja formularzy:** Waliduj po stronie klienta przed wysłaniem do lokalnego storage
- **Graceful degradation:** Jeśli localStorage jest niedostępny lub przepełniony, pokaż komunikat i pozwól na kontynuację z ograniczoną funkcjonalnością

### 7. Kompresja obrazów i praca z plikami
- **API Canvas:** Używaj `OffscreenCanvas` lub `Canvas` w pamięci do kompresji bez blokowania głównego wątku
- **Debounce dla kompresji:** Ogranicz częstotliwość wywołań funkcji kompresji przy przeciąganiu wielu plików
- **Walidacja typów plików:** Sprawdzaj typ MIME i rozszerzenie przed przetwarzaniem obrazu
- **Obsługa anulowania:** Pozwalaj użytkownikowi anulować operację kompresji (np. przez przycisk 'Anuluj' w modalu)

### 8. Interakcje z localStorage
- **Jednolite klucze:** Używaj prefiksów dla kluczy localStorage (np. `propcheck_properties`, `propcheck_issues`)
- **Serializacja/deserializacja:** Zawsze parsować JSON przy odczycie i stringify przy zapisie
- **Obsługa wyjątków:** Łap wyjątki `QuotaExceededError` i `SecurityError` przy dostępie do localStorage
- **Czyszczenie:** Implementuj funkcję czyszczenia starego lub uszkodzonego danych (opcjonalnie)

### 9. Wydajność
- **Request Animation Frame:** Używaj `requestAnimationFrame` dla animacji i zmian wizualnych
- **Debounce i throttle:** Stosuj do intensywnych operacji (np. filtrowanie, resize, scroll)
- **Unikanie wycieków pamięci:** Czyszcz nasłuchiwacze, timery i referencje do obiektów DOM
- **Efektowe renderowanie:** Aktualizuj tylko zmienione części DOM, nie odświeżaj całej listy bez potrzeby

### 10. Bezpieczeństwo
- **Escapeowanie HTML:** Używaj funkcji `escapeHtml()` przed wstawieniem danych użytkownika do innerHTML
- **Walidacja wejścia:** Waliduj i oczyszczaj wszystkie dane pochodzące od użytkownika
- **Ochrona przed XSS:** Nie wstawiaj niezaufanego HTML bez odpowiedniego sanitizacji
- **Bezpieczne przechowywanie:** Nie przechowuj danych wrażliwych (hasła, tokeny) w localStorage bez szyfrowania (planowane dla Phase 2+)

### 11. Kompatybilność przeglądarkowa
- **Cel:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Polyfills:** Używaj tylko jeśli absolutnie konieczne (celowo unikamy ich dla prostoty MVP)
- **Feature detection:** Sprawdzaj dostępność API przed użyciem (np. `if ('canvas' in document.createElement('canvas'))`)
- **CSS fallback:** Zapewnij podstawowe 스타ły nawet jeśli zawiedzie ładowanie Tailwind

### 12. Narzędzia i jakość kodu
- **Formatowanie:** Używaj Prettier lub podobnego narzędzia do automatycznego formatowania (konfiguracja w prettierrc)
- **Linting:** ESLint z zalecanymi zasadami dla Vanilla JS (planowane)
- **Komendy npm:**
  - `npm run dev` - uruchamia Tailwind w trybie watch
  - `npm run build` - buduje produkcyjny CSS
- **Debugowanie:** Używaj console.developer tools, punktów przerwania i wyrażenia debugger; tylko podczas rozwoju

### 13. Przykładowy wzorzec kodu

```javascript
// src/input.css - Tailwind directives
@tailwind base;
@tailwind components;
@tailwind utilities;

// Przykładowa struktura w script.js
(() => {
  // Stałe
  const STORAGE_KEYS = {
    PROPERTIES: 'propcheck_properties',
    ISSUES: 'propcheck_issues'
  };
  
  // Stan aplikacji
  let appState = {
    properties: [],
    issues: [],
    activeView: 'dashboard' // dashboard, floorplan, issues
  };
  
  // Funkcje pomocnicze (utils)
  const utils = {
    escapeHtml(text) {
      // ... implementacja
    },
    compressImage(file, options) {
      // ... implementacja przy użyciu Canvas API
    },
    saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(appState.properties));
        localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(appState.issues));
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          showError('Przekroczono limit lokalnego storage. Usuń niektóre dane lub użyj kompresji.');
        }
      }
    }
  };
  
  // Obsługa zdarzeń
  function initEventListeners() {
    // Delegacja zdarzeń dla formularza dodawania nieruchomości
    document.getElementById('addPropertyForm').addEventListener('submit', handleAddPropertySubmit);
    // ... inne nasłuchiwacze
  }
  
  // Inicjalizacja
  function init() {
    loadFromStorage();
    renderApp();
    initEventListeners();
  }
  
  // Uruchom aplikację
  init();
})();
```

## Konwencje Projektowe

### 1. Pliki i struktura
- **Jeden plik JavaScript:** `script.js` w katalogu głównym (dla MVP, ze względu na prostotę)
- **Jeden plik CSS:** `styles.css` (wygenerowany przez Tailwind) + `input.css` (źródłowe Tailwind)
- **Assety:** Obrazy rzutów mieszkań w katalogu `examples/floorplans/`
- **Dokumentacja:** W katalogu `/docs/` zgodnie z strukturą projektu

### 2. Komentarze
- **Komentuj tylko skomplikowaną logikę** lub decyzje architektoniczne
- **Unikaj oczywistych komentarzy** (np. // i++ // zwiększa i)
- **Używaj JSDoc-style** dla funkcji publicznych i złożonych pomocy:
  ```javascript
  /**
   * Kompresuje obraz do określonej szerokości i jakości
   * @param {File} file - Plik obrazu do skompresowania
   * @param {number} maxWidth - Maksymalna szerokość w pikselach
   * @param {number} quality - Jakość kompresji (0-1)
   * @returns {Promise<string>} Obraz jako base64 data URI
   */
  function compressImage(file, maxWidth, quality) { /* ... */ }
  ```

### 3. Konsystencja
- **Formatowanie:** 2 spacje dla wcięć, znak nowej linii na końcu pliku
- **Średniki:** Używaj średników dla jasności (ASI może być nieprzewidywalne)
- **Przecinki w obiektach/tablicach:** Dodaj przecinek po ostatnim elemencie dla łatwiejszego diffu
- **Nawiasy klamrowe:** Styl Egypski (otwierający nawias w tej samej linii co deklaracja)

### 4. Testowanie i debugowanie
- **Logowanie podczas rozwoju:** Używaj `console.log()` z znacznikami (np. `[PropCheck]`) i usuwaj je przed buildem produkcyjnym
- **Punkty przerwania:** Używaj debuggera Chrome/Firefox zamiast `debugger;` w kodzie produkcyjnym
- **Testowanie ręczne:** Postępuj zgodnie ze scenariuszami Happy Path z dokumentacji testerów

---
*Aktualizacja: 2026-05-12*