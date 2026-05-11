# Plan: Pinezki usterek na rzucie mieszkania

## Sekcja 1: Walidacja zakresu i kryterium sukcesu

- [x] 1.1 Funkcjonalność: Użytkownik może w oknie szczegółów nieruchomości wejść w tryb mapy, umieszczać pinezki powiązane z usterkami, przesuwać je (tryb edycji), a w trybie widoku klikać je i widzieć szczegóły usterki w dymku.
- [x] 1.2 Zakres mieści się w jednej spójnej sekcji pracy — wszystkie zmiany dotyczą `dashboard.html`, `dashboard.js`, `dashboard.css` w katalogu `examples/`.
- [x] 1.3 Kryterium sukcesu: użytkownik może (a) wejść w tryb mapy z okna nieruchomości, (b) kliknąć na plan by dodać/przenieść pinezkę, (c) najechać na pinezkę i zobaczyć dymek z nazwą i statusem usterki, (d) kliknąć pinezkę w trybie widoku by otworzyć szczegóły usterki.
- [x] 1.4 **Manualny test:** zdefiniowany flow: nieruchomość ma zdjęcie planu → przycisk „Mapa usterek" → klik na plan = pinezka → dymek po hoverze → tryb widoku → klik = widok usterki.

---

## Sekcja 2: Implementacja minimalna

### 2.1 Rozszerzenie modelu danych

Usterka (`issue`) dostaje nowe pole:
```js
pinPosition: { x: number, y: number } | null
// x, y to wartości procentowe (0-100) względem szerokości/wysokości obrazka
```

Zapis i odczyt przez istniejący `localStorage` (`propcheck_issues`).

---

### 2.2 HTML — nowe elementy

**W `dashboard.html`:**

1. **Modal mapy** (`id="floorplanMapModal"`) — duże okno (`.modal-xl`) wyświetlające plan mieszkania z pinezkami nad nim:
   ```
   [X] Mapa usterek — Apartament Słoneczna 15
   ┌─────────────────────────────────────────────┐
   │         [obraz planu mieszkania]            │
   │  (pinezki SVG jako absolute-positioned)     │
   └─────────────────────────────────────────────┘
   [Tryb edycji toggle]   [Zamknij]
   ```

2. **Przycisk „Mapa usterek"** w `property-actions` — dodany obok „Zobacz usterki" i „Dodaj usterkę". Pojawia się tylko gdy nieruchomość ma `floorplanPhoto`.

3. **Dymek tooltip** (`.pin-tooltip`) — element `div` z pozycją `absolute` wewnątrz kontenera mapy.

4. **Checkbox „Przypnij na mapie"** w formularzu `addIssueForm` — pojawia się gdy nieruchomość ma plan; po zaznaczeniu tryb dodawania pinezki aktywuje się po zapisaniu/edytowaniu usterki.

---

### 2.3 CSS — nowe style (`dashboard.css`)

```
/* Mapa usterek */
.modal-xl { max-width: 900px; }

.floorplan-map-container {
  position: relative;
  display: inline-block;  /* dopasowanie do obrazu */
  line-height: 0;
  cursor: crosshair;      /* tryb edycji */
  user-select: none;
}

.floorplan-map-container.view-mode {
  cursor: default;
}

.floorplan-map-img {
  max-width: 100%;
  max-height: 70vh;
  display: block;
}

/* Pinezka */
.map-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2.5px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.28);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  z-index: 10;
}

.map-pin.pin-critical { background: #C45C3E; }
.map-pin.pin-normal   { background: #D4A24C; }

.map-pin:hover {
  transform: translate(-50%, -50%) scale(1.25);
  box-shadow: 0 4px 14px rgba(0,0,0,0.35);
  z-index: 20;
}

/* Wykrzyknik w środku pinezki */
.map-pin::after {
  content: '!';
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
}

/* Dymek */
.pin-tooltip {
  position: absolute;
  background: #1C1C1E;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 30;
  opacity: 0;
  transition: opacity 0.15s ease;
  max-width: 220px;
}

.pin-tooltip.visible { opacity: 1; }

.pin-tooltip-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

/* Tryb: pinezka aktualnie umieszczana — pozostałe przyciemnione */
.map-pin.dimmed {
  opacity: 0.35;
  pointer-events: none;
}

/* Przycisk trybu */
.map-mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.map-mode-label {
  font-weight: 500;
}
```

---

### 2.4 JavaScript — nowe funkcje (`dashboard.js`)

#### Stan globalny (dodatkowy)
```js
let mapMode = 'edit';         // 'edit' | 'view'
let activePinIssueId = null;  // id usterki w trybie przypinania z formularza
let isDraggingPin = false;
let currentMapPropertyId = null;
```

#### `openFloorplanMapModal(propertyId)`
- Otwiera modal mapy dla podanej nieruchomości
- Wczytuje `property.floorplanPhoto` jako `<img>` w kontenerze
- Renderuje pinezki (`renderMapPins`)
- Ustawia `mapMode = 'edit'`
- Podpina event listenery (klik na plan = dodaj pinezkę, hover = dymek, drag = przesuń)

#### `renderMapPins(propertyId, highlightIssueId = null)`
- Usuwa wszystkie istniejące pinezki z kontenera
- Dla każdej usterki danej nieruchomości, która ma `pinPosition`, tworzy element `.map-pin`
- Kolor: `.pin-critical` jeśli `issue.status === 'critical'`, inaczej `.pin-normal`
- Jeśli `highlightIssueId != null`: pinezka o tym id ma normalną widoczność, pozostałe `.dimmed`
- W trybie `edit`: pinezki są draggable
- W trybie `view`: kliknięcie pinezki otwiera `openEditIssueModal(issueId)` i zamyka mapę

#### Obsługa kliknięcia na plan (tryb edycji)
- Jeśli kliknięto na pinezkę: nie twórz nowej, rozpocznij drag
- Jeśli kliknięto na puste miejsce: 
  - Jeśli `activePinIssueId != null` (tryb z formularza): ustaw `pinPosition` dla tej usterki
  - Jeśli `activePinIssueId == null`: otwórz `openAddIssueModal(propertyId)` z flagą `pendingPin = {x, y}`

#### `startPinDrag(issue, pinEl, e)`
- `mousedown` / `touchstart` na pinezce w trybie edycji
- Oblicza nową pozycję (x%, y%) na podstawie pozycji myszy względem kontenera
- Aktualizuje `issue.pinPosition` po `mouseup` / `touchend`
- Zapisuje do localStorage

#### Hover / tooltip
- `mouseenter` na `.map-pin` → pokaż `.pin-tooltip` z `issue.name` i kolorową kropką
- `mouseleave` → ukryj tooltip

#### Przycisk trybu edycji / widoku
- Toggle z labelką „Edycja" / „Widok"
- W trybie edycji: `cursor: crosshair` na kontenerze, drag aktywny
- W trybie widoku: `cursor: default`, klik = szczegóły usterki

#### Opcja „Przypnij na mapie" w formularzu usterki
- `form-checkbox` z `id="issuePinOnMap"` widoczny tylko gdy `currentPropertyId` ma `floorplanPhoto`
- Po zapisaniu usterki (nowej lub edytowanej): jeśli checkbox zaznaczony → `activePinIssueId = newIssueId`, zamknij formularz, otwórz `openFloorplanMapModal(propertyId)` w zmodyfikowanym trybie (pozostałe pinezki `.dimmed`, strzałka wskazuje: „kliknij aby umieścić pinezkę")
- Po kliknięciu w plan: `pinPosition` ustawione → `activePinIssueId = null`, powrót do normalnego trybu edycji

---

### 2.5 Integracja z istniejącym kodem

| Istniejąca funkcja | Zmiana |
|---|---|
| `addProperty` | Bez zmian — `floorplanPhoto` już jest w modelu |
| `createPropertyCard` | Dodaj przycisk „Mapa usterek" (widoczny gdy `property.floorplanPhoto`) |
| `addIssue` | Po dodaniu: jeśli checkbox „Przypnij" zaznaczony, wywołaj `openFloorplanMapModal` |
| `updateIssue` | Zachowaj `pinPosition` (nie nadpisuj jeśli nie zmieniono) |
| `deleteIssue` | Brak zmian — usunięcie usterki usunie też pinezkę (brak danych = brak renderowania) |
| `openPropertyIssuesModal` | Opcjonalnie: przy usterach z pinezką pokaż ikonkę 📍 |

---

### 2.6 Walidacja i obsługa błędów

- Jeśli nieruchomość nie ma `floorplanPhoto`: przycisk mapy jest ukryty, toast: „Dodaj plan mieszkania, aby korzystać z mapy"
- Jeśli obraz nie załadował się: fallback — brak mapy, komunikat w modalu
- Pinezki poza granicami (x/y < 0 lub > 100): clamp do [1, 99]%
- Drag na urządzeniach dotykowych: obsługa `touchstart`, `touchmove`, `touchend`

---

### 2.7 Manualny test sekcji (2.4)
Ścieżka pozytywna:
1. Dodaj nieruchomość ze zdjęciem planu.
2. Dodaj usterkę → zaznacz „Przypnij na mapie" → zapisz → otworzy się mapa w trybie przypinania.
3. Kliknij na planie → pinezka pojawia się → tryb wraca do normalnego.
4. Przełącz do trybu widoku → najedź na pinezkę → dymek z nazwą.
5. Kliknij pinezkę w trybie widoku → otwiera się formularz edycji usterki.

Ścieżka błędu:
1. Nieruchomość bez planu → przycisk „Mapa usterek" jest niewidoczny.
2. Pinezka poza obszarem → zaokrąglenie do krawędzi.

---

## Sekcja 3: Weryfikacja techniczna końcowa

- [ ] 3.1 Projekt nie ma osobnego zestawu testów — weryfikacja ręczna w przeglądarce (otwarcie `examples/dashboard.html` bezpośrednio).
- [ ] 3.2 `npm run build` (Tailwind) — jeśli klasy Tailwind nie są używane w nowych elementach, build nie jest wymagany (style są w `dashboard.css`).
- [ ] 3.3 Smoke test: dodaj nieruchomość, usterkę, pinezkę, zapisz, odśwież — dane w `localStorage` mają `pinPosition`.
- [ ] 3.4 **Manualny test:** flow krytyczny: nieruchomość → mapa → pinezka → dymek → tryb widoku → klik usterki → formularz edycji.

---

## Format raportu po wdrożeniu (do uzupełnienia po implementacji)

- **Co wdrożono:**
  - Modal mapy usterek z obrazem planu
  - Pinezki (klik/drag/hover/tooltip) powiązane z usterkami
  - Tryb edycji i tryb widoku
  - Opcja „Przypnij na mapie" w formularzu usterki
- **Wpływ na użytkownika:** użytkownik może w < 10 sekund zobaczyć, gdzie są usterki na planie; zmniejsza time-to-context dla ekipy remontowej.
- **Co odłożono świadomie:**
  - Pokazywanie pinezek w raporcie PDF (second pass)
  - Pinezki na mobile z touch drag (pełna wersja — podstawowy touch działa)
  - Historia przesunięć pinezek (brak potrzeby MVP)

---

## Pliki do edycji

| Plik | Rodzaj zmiany |
|---|---|
| `examples/dashboard.html` | Nowy modal mapy, checkbox w formularzu, przycisk w property-actions |
| `examples/dashboard.js` | Nowe funkcje: `openFloorplanMapModal`, `renderMapPins`, drag, tooltip, tryb |
| `examples/dashboard.css` | Nowe style: `.map-pin`, `.pin-tooltip`, `.floorplan-map-container`, `.modal-xl` |
