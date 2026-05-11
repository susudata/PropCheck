# Business Requirements — PropCheck

## 1. Cel produktu

PropCheck to narzędzie SaaS (Software as a Service) przeznaczone dla:
- **Landlordów** (właściciele mieszkań do wynajmu)
- **Zarządców nieruchomości** (5–50 lokalizacji)
- **Firm wynajmujących** (Airbnb, flipy)

### Problem rozwiązywany
Chaotyczne zarządzanie usterkami w wielu lokalizacjach jednocześnie:
- Setki wiadomości na WhatsApp/Messenger ze zdjęciami
- Brak centralnego rejestru problemów
- Trudna koordynacja z ekipami remontowymi
- Problemy z śledzeniem historii naprawy

### Hipoteza wartości
> Jeśli zarządcy mogą szybko (< 5 minut) dodać usterkę na interaktywnym rzucie, przypisać status i wygenerować raport dla ekipy, oszczędzą co najmniej 2-3 godziny tygodniowo na komunikacji i koordynacji.

## 2. Główne funkcjonalności (MVP)

### Funkcjonalność 1: Zarządzanie nieruchomościami (Dashboard)
- ✅ Dodawanie nieruchomości (nazwa + adres)
- ✅ Wgrywanie rzutu mieszkania (zdjęcie)
- ✅ Widok listy nieruchomości z licznikiem aktywnych usterek
- ✅ Usuwanie nieruchomości

### Funkcjonalność 2: Raportowanie usterek na rzucie (Floorplan)
- ✅ Klikanie na rzucie → dodanie pinezki usterki
- ✅ Podawanie nazwy, opisu, lokalizacji
- ✅ Wgrywanie zdjęć (kompresja do localStorage)
- ✅ Zmiana statusu (Zgłoszone → W trakcie → Rozwiązane)
- ✅ Edycja i usuwanie usterki
- ✅ Przeglądanie zdjęć w galerii

### Funkcjonalność 3: Przegląd wszystkich usterek (Issues Page)
- ✅ Lista wszystkich usterek pogrupowana po nieruchomościach
- ✅ Sortowanie (alfabetycznie, data, status)
- ✅ Filtrowanie po statusie (3 warianty)
- ✅ Złożenie/rozwinięcie grupy nieruchomości
- ✅ Akcje (edycja, usunięcie, mapa)

### Funkcjonalność 4: Export i Raportowanie
- ⚠️ Generowanie PDF raportu (zaplanowana, nie MVP)
- ⚠️ Export danych (zaplanowany)

## 3. User Stories

### Story 1: Dodanie nieruchomości
```
Jako: Landlord/Zarządca
Chcę: Dodać moją nieruchomość do systemu
Żeby: Mogę śledzić wszystkie usterki w tym lokalu
```

**Kryteria akceptacji:**
- Mogę wpisać nazwę (np. "Apartament Słoneczna 15")
- Mogę wpisać adres
- Mogę wgrać zdjęcie/rzut
- Po kliknięciu "Dodaj" pojawia się karta na dashboardzie
- Mogę usunąć nieruchomość po potwierdzeniu

### Story 2: Raportowanie usterki na mapie
```
Jako: Landlord
Chcę: Szybko dodać usterkę klikając na rzucie mieszkania
Żeby: Nie musiałem tworzyć notatek czy wysyłać zdjęć na WhatsApp
```

**Kryteria akceptacji:**
- Widzę interaktywny rzut mieszkania
- Mogę kliknąć na dowolne miejsce i dodać "piniezkę" usterki
- Pinezka pojawia się dokładnie tam, gdzie kliknąłem
- Mogę dodać nazwę (np. "Cieknący kran"), opis i zdjęcia
- Mogę zmienić status (ZGŁOSZONE → W TRAKCIE → GOTOWE)
- Mogę edytować lub usunąć usterkę

### Story 3: Przegląd wszystkich usterek
```
Jako: Zarządca (5+ nieruchomości)
Chcę: Zobaczyć wszystkie usterki w jednym miejscu
Żeby: Mogę szybko sprawdzić co jest najpilniejsze
```

**Kryteria akceptacji:**
- Widzę listę wszystkich usterek z nazwą, lokalizacją, statusem
- Mogę posortować (alfabetycznie, najnowsze, status)
- Mogę filtrować (pokaż tylko zgłoszone / w trakcie / gotowe)
- Usterki są pogrupowane po nieruchomościach
- Mogę złożyć grupę, aby zmniejszyć "szum"
- Mogę szybko przejść do edycji lub mapy z tej listy

### Story 4: Wgrywanie zdjęć bez crash'a
```
Jako: Landlord
Chcę: Dodać kilka zdjęć do usterki
Żeby: Ekipa remontowa wiedziała dokładnie, jaki jest problem
```

**Kryteria akceptacji:**
- Mogę dodać 5+ zdjęć bez błędu "QuotaExceededError"
- Zdjęcia są szybko wgrywane (kompresja client-side)
- Mogę przeglądać zdjęcia w galerii (inline preview)
- Jeśli storage się przepełni, dostanę friendli message, a zdjęcia będą zapisane (bez photos)

## 4. Use Cases

### Use Case 1: Daily workflow zarządcy (Happy Path)
```
1. Landlord otwiera aplikację (rano, sprawdzanie)
2. Klika "Usterki" → widzi listę aktywnych usterek
3. Sortuje po statusie "ZGŁOSZONE" (najnowsze)
4. Klika na usterkę → Opens detail view / mapa
5. Zmienia status na "W TRAKCIE" (wysłał sms do ekipy)
6. Podpisuje offline i powraca po 2 godzinach
7. Zmienia status na "GOTOWE"
8. Ekipa wysyła zdjęcie przed/po → dodaje do usterki
```

### Use Case 2: Nowa usterka zgłoszona przez najemcę
```
1. Najemca wysyła WhatsApp: "Kran cieczy w kuchni!"
2. Landlord otwiera aplikację, przechodzi do nieruchomości
3. Klika na rzucie kuchni → otwiera Add Issue Modal
4. Wpisuje: "Cieknący kran pod zlewem"
5. Dodaje zdjęcie (WhatsApp) → aplikacja kompresuje
6. Podaje status: ZGŁOSZONE
7. Aplikacja automatycznie zapisuje usterę
8. Landlord wysyła zrzut ekranu ekipie remontowej
```

### Use Case 3: Generowanie raportu dla ekipy
```
1. Zarządca ma 3 nieruchomości, każda ma 2-3 usterki
2. Chce wygenerować raport dla ekipy remontowej
3. Klika "Exportuj PDF" na Issues Page
4. Aplikacja generuje raport z wszystkimi usterkkami + zdjęciami
5. Wysyła maila ekipie lub drukuje
```
*⚠️ Funkcjonalność zaplanowana na Phase 2*

## 5. Ograniczenia biznesowe

### Scope MVP
- **Brak:** Role-based access, team collaboration
- **Brak:** Real-time synchronization (sync między urządzeniami)
- **Brak:** Integracja z WhatsApp/Slack
- **Brak:** AI classification of issues
- **Brak:** Predictive maintenance

### Założenia
- Aplikacja pracuje offline (localStorage)
- Jeden użytkownik = jedno urządzenie (na MVP)
- Limit ~5-10MB zdjęć na urządzenie
- Obsługa mobile (bottom-nav) + desktop (sidebar)

## 6. Metryki sukcesu

### Onboarding
- **Time-to-value:** Użytkownik dodaje pierwszą usterkę w < 5 minut
- **Success Rate:** 95% użytkowników zarejestruje się bez błędu

### Retention
- **DAU (Daily Active Users):** Minimum 30% registered users
- **Feature adoption:** Minimum 80% użytkowników używa Issues Page

### Conversion (jeśli freemium)
- **Free → Pro:** Minimum 10% conversion rate
- **ARPU:** Średni przychód na użytkownika > $5/miesiąc

### Product Quality
- **Error Rate:** < 0.1% transakcji z błędem
- **Performance:** 95% operacji < 500ms
- **Stability:** 99.5% uptime

## 7. Monetization (zaplanowana)

### Free Tier
- Do 3 nieruchomości
- Nielimitowana liczba usterek
- Podstawowe funkcjonalności (dodawanie, edycja, usuwanie)

### Pro Tier ($9/miesiąc)
- Do 20 nieruchomości
- Zaawansowane filtrowanie i raporty
- Priority support

### Enterprise
- Powyżej 20 nieruchomości
- Team collaboration
- Custom integrations
- Dedicated account manager

---

**Dokument ostatnio aktualizowany:** 2026-05-11
