# PropCheck System Overview

## 1. Wprowadzenie

PropCheck to aplikacja SaaS (Software as a Service) przeznaczona dla zarządców nieruchomości i landlordów. Rozwiązuje problem chaotycznego zarządzania usterkami w wielu lokalizacjach poprzez:

- Interaktywne rzuty mieszkań z oznaczaniem usterek
- Centralne zarządzanie portefelem nieruchomości
- Śledzenie cyklu życia usterki (zgłoszona → w trakcie naprawy → rozwiązana)
- Generowanie raportów PDF dla ekip remontowych
- Przechowywanie zdjęć i dokumentacji technicznych

## 2. Architektura wysokopoziomowa

PropCheck wykorzystuje **architekturę klient-serwer** z podziałem na warstwy:

```
┌─────────────────────────────────────┐
│      Warstwa Prezentacji (UI)       │
│   React JS / Vanilla JS + HTML      │
│  (Dashboard, Floorplans, Modals)    │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│   Warstwa Logiki Biznesowej         │
│   (State Management, Filtrowanie)   │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│   Backend as a Service (BaaS)       │
│   Supabase PostgreSQL + Storage     │
│  (Auth, DB, Files)                  │
└─────────────────────────────────────┘
```

## 3. Główne komponenty systemu

### 3.1 Warstwa klienta (Frontend)

**Technologie:** HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript, shadcn/ui components

**Główne widoki:**
- **Dashboard:** Przegląd nieruchomości, liczba aktywnych usterek
- **Floorplan View:** Interaktywna mapa mieszkania z pinezkami usterek
- **Issues Page:** Lista wszystkich usterek z sortowaniem i filtrowaniem
- **Settings:** Zarządzanie kontem, demo data

**Kluczowe modały:**
- Add Property Modal (dodawanie nieruchomości)
- Add Issue Modal (dodawanie usterki z zdjęciami)
- Edit Issue Modal (edycja, zmiana statusu)
- Photo Gallery Modal (przeglądanie zdjęć)
- Floor Plan Modal (interaktywna mapa)

### 3.2 Storage (Przechowywanie danych)

**Warstwa przechowywania danych** utiliza wiele mechanizmów:

1. **localStorage:** Główne przechowywanie (properties, issues, users)
2. **IndexedDB:** Zaplanowane dla przyszłych zdjęć (nieograniczona pojemność)
3. **Supabase Storage:** Przechowywanie plików (zdjęcia, rzuty mieszkań)
4. **Supabase PostgreSQL:** Przechowywanie strukturalne (jeśli będzie backend)

**Obecny stan:** Aplikacja wykorzystuje localStorage jako główny storage z fallbackiem do error handling.

### 3.3 Bezpieczeństwo i kompresja

**Kompresja zdjęć:**
- Issue photos: 800x800px, quality 0.6 (≈90% redukcja rozmiaru)
- Floorplans: 1200x1200px, quality 0.7 (≈85% redukcja)
- Funkcja: `compressImageToBase64(file, maxWidth, maxHeight, quality)`

**Walidacja:**
- HTML5 required fields w formularzach
- Escapeowanie HTML w output (`escapeHtml()`)
- QuotaExceededError handling z graceful fallback

## 4. Przepływ danych

### 4.1 Dodawanie usterki (Issue)

```
Użytkownik
  ↓
Add Issue Modal (formularz)
  ↓
Validacja (obowiązkowe pola)
  ↓
Kompresja zdjęć (if any)
  ↓
Zapisanie do localStorage
  ↓
Odświeżenie UI (dashboard, floorplan)
  ↓
Rerender Issues Page (jeśli widoczna)
```

### 4.2 Zarządzanie nieruchomościami

```
Add Property Modal
  ↓
Validacja (nazwa, adres)
  ↓
Wgranie rzutu (jeśli dostarczone)
  ↓
Kompresja floorplanu
  ↓
Zapis do localStorage
  ↓
Pojawienie się karty na Dashboard
```

### 4.3 Filtrowanie i sortowanie usterek

```
Issues Page
  ↓
Zmiana filtrów (status) / sortu (alfabetycznie, data, status)
  ↓
Filtracja listy usterek
  ↓
Sortowanie (stabilne)
  ↓
Grupowanie po nieruchomościach
  ↓
Rendering listy z aktualizacją licznika
```

## 5. Baza danych — struktura logiczna

### 5.1 Properties (Nieruchomości)

```javascript
{
  id: "prop-{uuid}",
  name: string,              // "Apartament Słoneczna 15"
  address: string,           // "ul. Słoneczna 15, 80-001 Gdańsk"
  floor_plan_url: string,    // data URI (base64 zdjęcia/planu)
  created_at: timestamp,
  updated_at: timestamp
}
```

### 5.2 Issues (Usterki)

```javascript
{
  id: "issue-{uuid}",
  property_id: "prop-{uuid}", // FK
  name: string,               // "Cieknący kran w kuchni"
  description: string,        // Szczegółowy opis
  location: string,           // "Kuchnia"
  status: enum,               // "new" | "in_progress" | "resolved"
  pos_x: number,              // 35 (%)
  pos_y: number,              // 42 (%)
  photos: [base64, ...],      // Tablica zdjęć
  created_at: timestamp,
  updated_at: timestamp
}
```

### 5.3 Users (Użytkownicy — zaplanowane dla Supabase Auth)

```javascript
{
  id: "user-{uuid}",
  email: string,
  subscription_tier: enum,    // "free" | "pro" | "enterprise"
  created_at: timestamp,
  updated_at: timestamp
}
```

## 6. Technologie i uzasadnienia

| Warstwa | Technologia | Uzasadnienie |
|---------|-------------|-------------|
| Frontend | HTML5 + CSS3 + Vanilla JS | Minimalne zależności, szybkie ładowanie, pełna kontrola nad UI |
| Styling | Tailwind CSS | Utility-first CSS, szybkość prototypowania, responsywność |
| UI Components | shadcn/ui | Komponenty high-quality, dostosowalne, a11y |
| Storage | localStorage | Prototypowanie, brak backendu na etapie MVP |
| Compression | Canvas API | Natywne wsparcie, brak dodatkowych bibliotek |
| PDF Export | jspdf + html2canvas | Lekka biblioteka, generowanie po stronie klienta |
| Routing | Vanilla JS (showSection) | Brak frameworku, proste toggle widoków |

## 7. Ograniczenia i assumptions

1. **localStorage:** Limit ~5-10MB na przeglądarkę
   - Mitigation: Kompresja zdjęć, error handling z fallback
   
2. **Brak backendu (MVP):**
   - Dane nie są synchronizowane między urządzeniami
   - Brak real-time collaboration
   - Zaplanowana migracja na Supabase w Phase 2
   
3. **Responsywność:** Aplikacja obsługuje mobile (bottom-nav) oraz desktop (sidebar)

4. **Bezpieczeństwo:** Brak szyfrowania na lokalnym storage
   - Zaplanowane: Supabase Auth + HTTPS w production

## 8. Future Roadmap

- **Phase 2:** Supabase backend (Auth, PostgreSQL, Storage)
- **Phase 3:** Real-time synchronization (WebSockets)
- **Phase 4:** Mobile app (React Native)
- **Phase 5:** Team collaboration, role-based access
- **Phase 6:** AI-powered issue classification, predictive maintenance

---

**Dokument ostatnio aktualizowany:** 2026-05-11
