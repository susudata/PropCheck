# PLAN_001: Dashboard — Zarządzanie nieruchomościami

## 1. Cel

Umożliwić użytkownikowi szybkie dodawanie i zarządzanie portfolio nieruchomości z możliwością wgrywania rzutów pięter.

## 2. Zakres

**Co wchodzi w zakres:**
- Dodawanie nieruchomości (nazwa + adres)
- Wgrywanie rzutu mieszkania (zdjęcie/plan)
- Wyświetlanie listy nieruchomości z licznikiem aktywnych usterek
- Usuwanie nieruchomości z potwierdzeniem
- Persystencja w localStorage

**Co nie wchodzi w zakres:**
- Edycja szczegółów nieruchomości (np. zmiana nazwy bez usunięcia)
- Zmiana rzutu już wgranego
- Bulk operations (usuwanie wielu naraz)
- Archiwizacja nieruchomości

## 3. Wymagania funkcjonalne

### RF-001: Dodawanie nieruchomości
- User widzi przycisk "Dodaj nieruchomość"
- Klika → otwiera się modal z formularzem
- Formularz zawiera:
  - Input: Nazwa nieruchomości (obowiązkowe)
  - Input: Adres (obowiązkowe)
  - File input: Rzut/zdjęcie (opcjonalne)
- Po wpisaniu i kliknięciu "Dodaj" → nieruchomość pojawia się na liście

### RF-002: Wyświetlanie listy
- Każda nieruchomość ma kartę z:
  - Nazwą
  - Adresem (skróconym)
  - Miniatură rzutu (jeśli dostarczone)
  - Licznikiem aktywnych usterek
  - Przyciskami: Widok, Usuń

### RF-003: Usuwanie nieruchomości
- User klika ikonkę kosza → potwierdza akcję w modalu
- Po potwierdzeniu nieruchomość znika z listy
- Wszystkie usterki powiązane są usuwane

### RF-004: Pusty stan
- Jeśli nie ma nieruchomości → empty state z message i CTA

## 4. Wymagania niefunkcjonalne

### Wydajność
- Dodanie nieruchomości: < 500ms
- Render listy: < 300ms
- Kompresja zdjęcia: < 1s

### Bezpieczeństwo
- HTML input sanitization (escapeHtml)
- Walidacja po stronie klienta (HTML5 required)
- Error handling dla localStorage quota

### UX
- Jeden klik do dodania (bez wielokrokowego wizard'a)
- Natychmiast widoczna zwrotna (card pojawia się)
- Mobile-friendly (full width na mobile)

## 5. Kontekst techniczny

### Komponenty
- `Dashboard.html`: Sekcja "overview", lista kart, modal
- `dashboard.js`: Funkcje `addProperty()`, `renderProperties()`, `deleteProperty()`
- `dashboard.css`: Style kart, modala, responsive grid

### Dane przechowywane
```javascript
{
  id: "prop-{uuid}",
  name: string,
  address: string,
  floor_plan_url: string (base64),
  created_at: timestamp,
  updated_at: timestamp,
  issues_count: number (derived from issues array)
}
```

### localStorage key
`propcheck_properties` → JSON array

## 6. Kroki implementacji

1. **Struktura HTML:** Dodaj sekcję dashboard z modal'ami
2. **Event listeners:** Przyciski "Dodaj nieruchomość", "Usuń"
3. **Funkcje JS:** `addProperty()`, `renderProperties()`, `deleteProperty()`
4. **Kompresja zdjęcia:** Wgrywanie → `compressImageToBase64()`
5. **localStorage:** Zapis/odczyt `propcheck_properties`
6. **Styling CSS:** Responsive grid, modal styling
7. **Error handling:** Try-catch dla localStorage

## 7. Kryteria akceptacji

- [ ] User może dodać nieruchomość z nazwą i adresem
- [ ] User może wgrać zdjęcie (kompresja bezautomatyczna)
- [ ] Nieruchomość pojawia się na liście
- [ ] Licznik aktywnych usterek się pokazuje (0 dla nowych)
- [ ] User może usunąć nieruchomość po potwierdzeniu
- [ ] Dane persystują w localStorage i wrócą po refresh
- [ ] Empty state pojawia się gdy nie ma nieruchomości
- [ ] Mobile view jest responsywny

## 8. Testy

### Manualny test — Happy path
1. Otwórz aplikację (fresh)
2. Widać empty state z przyciskiem "Dodaj nieruchomość"
3. Klika przycisk → modal się otwiera
4. Wpisz: "Apartament Słoneczna 15" i "ul. Słoneczna 15, Gdańsk"
5. Wgraj zdjęcie z pliku (DevTools powinien pokazać compression log)
6. Klika "Dodaj" → modal zamyka się, karta pojawia się
7. Karta pokazuje: nazwa, adres, miniatura, licznik "0 usterek"
8. Klika kosza → modal potwierdzenia
9. Klika "Usuń" → karta znika
10. Refresh → empty state wraca

### Test edge cases
- Dodanie bez zdjęcia (powinno działać)
- Dodanie bez opisu (powinno działać, adres obowiązkowy)
- Duplikat nazwy (powinno być dozwolone)
- Wgranie dużego zdjęcia (kompresja powinno zmniejszyć do < 500KB)

## 9. Dependency i integracja

| Komponenta | Zależność |
|---|---|
| Dashboard | Jest niezależna (nie wymaga issues) |
| Issues | Wyświetla licznik z tej funkcjonalności |
| Floorplan | Otwiera z tej karty |

---

**Status:** Ready for implementation
**Priorytet:** HIGH (blocker dla MVP)
**Szacunkowy nakład:** 2-3 godziny
