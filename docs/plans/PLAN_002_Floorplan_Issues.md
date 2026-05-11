# PLAN_002: Rzut mieszkania — Dodawanie i edytowanie usterek

## 1. Cel

Umożliwić użytkownikowi dodawanie usterek poprzez klikanie na interaktywny rzut mieszkania, ze szczegółami (nazwa, opis, zdjęcia) i zmianą statusu.

## 2. Zakres

**Co wchodzi w zakres:**
- Wyświetlanie rzutu mieszkania w powiększeniu
- Klikanie na rzut → dodawanie pinezki usterki
- Responsywne mapowanie współrzędnych (% zamiast px)
- Dodawanie szczegółów: nazwa, opis, lokalizacja, zdjęcia
- Zmiana statusu usterki (3 warianty)
- Edycja istniejącej usterki
- Usuwanie usterki
- Przeglądanie zdjęć w galerii (lightbox)

**Co nie wchodzi w zakres:**
- Rysowanie na rzucie (drawing tools)
- Wielowarstwowe rzuty (multiple floors)
- OCR detekcji tekstu na planie
- 3D floorplan

## 3. Wymagania funkcjonalne

### RF-001: Wyświetlanie rzutu
- Rzut wyświetla się w 100% szerokości (responsive)
- Zachowuje aspect ratio
- Pinezki są pozycjonowane relatywnie (% nie px)

### RF-002: Dodawanie usterki
- User klika na rzut → otwiera się modal "Dodaj usterkę"
- Formularz zawiera:
  - Input: Nazwa usterki (obowiązkowe)
  - Input: Lokalizacja (np. "Kuchnia", opcjonalne)
  - Textarea: Opis
  - Select: Status (ZGŁOSZONE / W TRAKCIE / GOTOWE)
  - File input: Zdjęcia (wielokrotne)
  - Przycisk: "Zapisz"
- Po kliknięciu "Zapisz" → pinezka pojawia się na rzucie

### RF-003: Pinezka na mapie
- Pinezka ma kolor zależny od statusu:
  - Czerwona (ZGŁOSZONE)
  - Pomarańczowa (W TRAKCIE)
  - Zielona (GOTOWE)
- Hover → tooltip z nazwą usterki

### RF-004: Edycja usterki
- User klika na pinezę → otwiera się modal edycji
- Wszystkie pola są wypełnione aktualnymi danymi
- User może zmienić wszystko (nazwa, status, dodać więcej zdjęć)
- Po kliknięciu "Gotowe" → zmiany są zapisane
- Pinezka zmienia kolor jeśli zmienił się status

### RF-005: Usuwanie usterki
- User klika przycisk Delete w modalu → potwierdzenie
- Po potwierdzeniu → pinezka znika

### RF-006: Galeria zdjęć
- User klika na zdjęcie w formularzu (lub miniatury) → otwiera się lightbox
- Może nawigować między zdjęciami (previous/next)
- Klika X lub ESC → zamyka się

## 4. Wymagania niefunkcjonalne

### Wydajność
- Render rzutu: < 500ms
- Kompresja zdjęcia: < 1s per image
- Zmiana statusu: < 100ms

### Responsywność
- Desktop: pinezki warte dokładnie gdzie kliknięto
- Mobile: przecisk dodatkowy modal (bo touch bardziej niedokładny)
- Tablet: hybrydowe

### Bezpieczeństwo
- Input sanitization (escapeHtml)
- File validation (tylko image/* MIME types)
- Size limit: max 5MB per file (pre-compression)

### UX
- Natychmiastowa wizualna feedback (pinezka pojawia się)
- Graceful error handling (np. zdjęcie się nie wgrało)
- Cofnięcie akcji (ESC zamyka modal bez zapisania)

## 5. Kontekst techniczny

### Komponenty
- `dashboard.html`: Sekcja floorplan, modal Add/Edit Issue
- `dashboard.js`: Funkcje `addIssue()`, `updateIssue()`, `deleteIssue()`, `renderFloorplan()`
- `dashboard.css`: Style pinezki, modala, galerii

### Algorytm mapowania współrzędnych

**Zapis pozycji:**
```javascript
function getRelativeCoords(clickEvent, imageElement) {
  const rect = imageElement.getBoundingClientRect();
  const x = (clickEvent.clientX - rect.left) / rect.width * 100;
  const y = (clickEvent.clientY - rect.top) / rect.height * 100;
  return { x, y };
}
```

**Wyświetlanie pinezki:**
```javascript
pinElement.style.left = issue.pos_x + '%';
pinElement.style.top = issue.pos_y + '%';
```

### Dane przechowywane
```javascript
{
  id: "issue-{uuid}",
  property_id: "prop-{uuid}",
  name: string,
  description: string,
  location: string,
  status: enum ("new" | "in_progress" | "resolved"),
  pos_x: number (0-100),
  pos_y: number (0-100),
  photos: [base64, base64, ...],
  created_at: timestamp,
  updated_at: timestamp
}
```

### localStorage key
`propcheck_issues` → JSON array

## 6. Kroki implementacji

1. **HTML struktura:** Modal Add Issue, modal Edit Issue, galeria lightbox
2. **Click handler:** `document.addEventListener('click on floorplan')`
3. **Funkcja mapowania:** `getRelativeCoords()` do obliczenia % pozycji
4. **Add/Edit/Delete functions:** CRUD dla issues
5. **Kompresja zdjęć:** `compressImageToBase64()` dla każdego uploaded file
6. **Rendering pinezek:** Loop po issues i pozycjonowanie absolutne
7. **Status colors:** CSS classes w zależności od `issue.status`
8. **Lightbox:** Simple modal z prev/next navigation
9. **Error handling:** QuotaExceededError, file validation

## 7. Kryteria akceptacji

- [ ] Rzut wyświetla się responsywnie
- [ ] Klikanie na rzut otwiera modal Add Issue
- [ ] User może dodać nazwę, opis, zdjęcia
- [ ] Pinezka pojawia się dokładnie tam, gdzie kliknięto (responsywnie)
- [ ] Pinezka ma kolor odpowiadający statusowi
- [ ] User może kliknąć pinezę → otwiera się modal edycji
- [ ] User może zmienić status → pinezka zmienia kolor
- [ ] User może usunąć usterkę
- [ ] Zdjęcia są kompresowane (DevTools console log)
- [ ] Galeria zdjęć otwiera się i pozwala nawigować
- [ ] Dane persystują w localStorage i wrócą po refresh
- [ ] Mobile view działa (modal zamiast click na rzut)

## 8. Testy

### Manualny test — Happy path
1. Otwórz nieruchomość (widok floorplan)
2. Klika na rzut w kuchni (np. wg. pozycji X=35%, Y=42%)
3. Otwiera się modal "Dodaj usterkę"
4. Wpisz: "Cieknący kran pod zlewem"
5. Wpisz lokalizację: "Kuchnia"
6. Wpisz opis: "Woda cieka z baterii..."
7. Wgraj zdjęcie
8. Wybierz status: "ZGŁOSZONE"
9. Klika "Zapisz"
10. Modal zamyka się, na rzucie pojawia się czerwona pinezka w dokładnym miejscu
11. Klika pinezę → otwiera się modal edycji
12. Zmienia status na "W TRAKCIE" → pinezka zmienia kolor na pomarańczowy
13. Klika "Gotowe"
14. Refresh strony → pinezka wraca w tym samym miejscu z tym samym statusem

### Test responsywności
1. Otwórz floorplan na mobile
2. Rzut powinien pasować do ekranu
3. Kliknięcie powinno być dokładne (+-2%)
4. Pinezka powinna być dobrze widoczna na mobile

### Test edge cases
- Dodanie usterki bez zdjęcia (powinno działać)
- Dodanie bez opisu (powinno działać, nazwa obowiązkowa)
- Wgranie dużego zdjęcia (powinno się skompresować)
- Wiele usterek na jednym rzucie (wszystkie powinny być widoczne)

## 9. Dependency i integracja

| Komponenta | Zależność |
|---|---|
| Dashboard | Potrzebuje properties na liście (zależna od PLAN_001) |
| Issues Page | Wyświetla same usterki (niezależna) |
| Floorplan | Jest ją częścią tej feature |

---

**Status:** Ready for implementation
**Priorytet:** HIGH (core feature)
**Szacunkowy nakład:** 4-5 godzin
