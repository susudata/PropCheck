# Role: Architekt Techniczny / Tech Lead

## Odpowiedzialność

Architekt Techniczny odpowiada za:
- Podejmowanie decyzji dotyczących stosu technologicznego i architektury systemu
- Zapewnienie skalowalności, wydajności i bezpieczeństwa rozwiązania
- Utrzymanie jakości kodu i konwencji programistycznych
- Optymalizację pod kątem ograniczeń solo-developera (czas, zasoby)

## Kluczowe Decyzje Techniczne

### 1. Wybór Stosu Technologicznego

| Warstwa | Technologia | Uzasadnienie |
|---------|-------------|-------------|
| **Frontend** | HTML5 + CSS3 + Vanilla JavaScript (ES6+) | Brak zależności frameworkowych, szybkie ładowanie, pełna kontrola nad kodem, odpowiednie dla solo-developera |
| **Stylowanie** | Tailwind CSS v3.4.3 | Utility-first CSS, szybkie prototypowanie, responsywność out-of-the-box, małe rozmiary plików przez purging |
| **Komponenty UI** | Custom shadcn/ui-like components | Wysoka jakość, dostępność (a11y), możliwość dostosowania bez nadmiernego ciężaru frameworku |
| **Storage (MVP)** | localStorage | Prototypowanie bez backendu, prostota implementacji, wystarczające dla ograniczonego użytkowania indywidualnego |
| **Storage (Produkcja)** | Supabase PostgreSQL + Storage | Gotowe BaaS, uwierzytelnianie, real-time, skalowalne, niski koszt dla małych projektów |
| **Kompresja Obrazów** | Canvas API (client-side) | Natywna obsługa w przeglądarce, brak dodatkowych bibliotek, skuteczna redukcja rozmiaru (85-90%) |
| **Eksport PDF** | jspdf + html2canvas | Lekkie biblioteki, generowanie po stronie klienta, brak potrzeby backendu |
| **Routing** | Vanilla JS (showSection) | Prostota aplikacji jednostronicowej, brak potrzeby ciężkiego routera |
| **Build** | npm + Tailwind CSS + PostCSS | Standardowe narzędzia, łatwa konfiguracja, możliwość rozszerzenia |

### 2. Decyzja o localStorage jako Głównym Storage (MVP)

**Dlaczego localStorage:**
- Pozwoliło na szybkie stworzenie MVP bez konfigurowania backendu
- Dostępne w wszystkich nowoczesnych przeglądarkach
- Prostota API (getItem/setItem/removeItem)
- Wystarczające dla ograniczonego liczby nieruchomości i usterek (po kompresji)

**Ograniczenia i mitigacje:**
- Limit 5-10MB na pochodzenie → **mitigacja:** agresywna kompresja zdjęć (800x800px, quality 0.6)
- Brak synchronizacji między urządzeniami → **akceptowalne dla MVP**, planowana migracja do Supabase
- Brak automatycznego backupu → **mitigacja:** eksport danych jako JSON (planowane)
- Ryzyko QuotaExceededError → **mitigacja:** obsługa błędu i komunikat użytkownikowi

### 3. Architektura Komponentowa

Aplikacja podzielona na logiczne moduły:
- **State Management:** Prosty obiekt stanu w lokalnym scope (nie użyto Redux/Zustand ze względu na prostotę)
- **Komponenty UI:** Funkcje tworzące elementy DOM (np. `createPropertyCard()`, `createIssuePin()`)
- **Modały:** Funkcje pokazujące/ukrywające overlay z fokusem zarządzanym
- **Utils:** Funkcje pomocnicze (kompresja obrazów, walidacja, escapowanie HTML, generowanie UUID)

### 4. Bezpieczeństwo

**Obecny stan (MVP):**
- Brak uwierzytelniania (aplikacja jednoosobowa)
- Dane przechowywane w czystym виде w localStorage
- Brak szyfrowania

**Planowane улучшения (Phase 2+):**
- Integracja z Supabase Auth (email/passwd, social login)
- HTTPS w produkcji
- Rozważenie szyfrowania poufnych danych na frontendzie (jeśli wymagane)

### 5. Wydajność i Optymalizacje

**Cel:** < 500ms operacje CRUD, < 2s czas ładowania

**Zastosowane techniki:**
- Kompresja obrazów przed zapisaniem (zmniejsza ilość danych w localStorage)
- Debounce dla intensywnych operacji (np. filtrowanie listy)
- Efektywne renderowanie: tylko zmienione części DOM (użycie innerHTML lub textContent gdzie możliwe)
- Lazy loading zdjęć w galerii (tylko widoczne miniaturki)
- Minimalizacja i purging CSS przez Tailwind (usuwanie nieużywanych klas)

### 6. Responsywność i Dostępność

**Responsywność:**
- Mobile-first podejście w Tailwind
- Dodatkowe własne punkty przerywania dla specyficznych komponentów (floorplan, galerie)
- Testowane na podstawowych rozmiarach: 320px, 768px, 1024px, 1440px

**Dostępność (a11y):**
- Semantyczne HTML5 (nav, main, section, button, label)
- Wszystkie elementy interaktywne obsługują klawiaturę (tabindex, enter/space)
- Etykiety ARIA dla komponentów niestandardowych (modały, tooltipy)
- Kontrast kolorów zgodny z WCAG AA (testowane narzędziami typu axe)
- Rozmiar czcionki bazowej 16px, skalowanie za pomocą rem

### 7. Konwencje Kodowania

**JavaScript (ES6+):**
- Const/let zamiast var
- Funkcje strzałkowe dla krótkich callbacków
- Destrukturyzacja obiektów i tablic
- Template literales dla stringów
- Obsługa błędów przez try/catch gdzie asynchroniczne operacje
- Komentowanie tylko przy skomplikowanej logice (samodokumentujący się kod przez nazwy)

**CSS/Tailwind:**
- Klasy Tailwind w logicznej kolejności (layout → typografia → efekty → interakcje)
- Własne klasy tylko gdy absolutnie konieczne (w pliku styles.css lub poprzez @layer)
- Komponenty powinny być niezależne (uniknięcie !important)
- Użycie zmiennych CSS dla kolorów stanu (--color-success, --color-danger itp.)

**HTML:**
- Semantyczne elementy zgodne z treścią
- Dostępne formularze (label połączone z input przez for/id)
- Unikanie divitis - użycie odpowiednich elementów sekcji

### 8. Narzędzia i Proces Rozwoju

**Dev Tools:**
- Chrome DevTools do debugowania i profilowania
- Lighthouse do audytu wydajności i dostępności
- Tailwind IntelliSense w VS Code dla autouzupełniania
- ESLint (planowane) dla utrzymania jakości kodu

**Workflow:**
- Rozwój gałęzi feature z częstymi commitami
- Pull Request do recenzji (samorecenzja lub z pomocą AI)
- Testowanie ręczne według scenariuszy Happy Path
- Aktualizacja dokumentacji po każdej znaczącej zmianie

---
*Aktualizacja: 2026-05-12*