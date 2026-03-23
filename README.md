# PropCheck (Apartment Tracker)

## Spis Treści

1.  [Informacje dla użytkownika](#Informacje-dla-użytkownika)
2.  [Główne funkcjonalności](#główne-funkcjonalności)
3.  [Model Biznesowy](#model-biznesowy)
4.  [Informacje dla developera (Architektura)](#informacje-dla-developera)
5.  [Struktura Bazy Danych](#struktura-bazy-danych)
6.  [Kluczowe rozwiązania techniczne](#kluczowe-rozwiązania-techniczne)

-----

## Informacje dla użytkownika

**PropCheck** to innowacyjna platforma typu SaaS (Software as a Service) przeznaczona dla landlordów, zarządców nieruchomości oraz firm zajmujących się wynajmem krótkoterminowym (tzw. flipy, zarządzanie najmem).

Aplikacja rozwiązuje problem chaotycznego zarządzania usterkami w wielu lokalizacjach jednocześnie. Zamiast wymieniać setki wiadomości ze zdjęciami na komunikatorach, zarządca posiada cyfrowy rzut każdego mieszkania, na którym precyzyjnie oznacza problemy techniczne, przypisuje im statusy i generuje gotowe raporty dla ekip remontowych.

### Główne funkcjonalności

  * **Interaktywne rzuty mieszkań:** Wgrywanie planów (lub zdjęć poglądowych) nieruchomości i oznaczanie punktowe usterek za pomocą interaktywnych "pinezek".
  * **Zarządzanie portfelem nieruchomości:** Przejrzysty dashboard grupujący wszystkie posiadane mieszkania z informacją o liczbie aktywnych zgłoszeń.
  * **Śledzenie cyklu życia usterki:** Statusowanie problemów (`Zgłoszone`, `W trakcie naprawy`, `Rozwiązane`).
  * **Kategoryzacja defektów:** Dołączanie opisów oraz zdjęć do konkretnej pinezki na rzucie.
  * **Automatyczne raportowanie (Generowanie PDF):** Eksportowanie listy usterek z danej nieruchomości w formie profesjonalnego dokumentu PDF, gotowego do wysłania podwykonawcom.

### Model Biznesowy

Projekt zakłada monetyzację w modelu subskrypcyjnym (SaaS) w wariantach B2B/B2C:

  * **Plan Basic:** Do 3 nieruchomości (darmowy, zachęcający do przetestowania).
  * **Plan Pro:** Do 20 nieruchomości, nielimitowana liczba usterek i generowania raportów PDF (stała opłata miesięczna).
  * **Plan Enterprise:** Dla dużych zarządców, powyżej 20 nieruchomości.

-----

## Informacje dla developera

Aplikacja została zaprojektowana w oparciu o architekturę klient-serwer, wykorzystując nowoczesny stos technologiczny oparty na ekosystemie JavaScript/TypeScript oraz rozwiązaniach typu BaaS (Backend as a Service).

### Wykorzystane Technologie

  * **Frontend:** React JS (Single Page Application).
  * **Styling & UI:** Tailwind CSS dla szybkiego i responsywnego stylowania, wspomagane biblioteką komponentów **shadcn/ui** (dla zachowania spójnego, natywnego i profesjonalnego wyglądu interfejsu).
  * **Backend & Baza Danych:** Supabase (oparte na PostgreSQL). Zapewnia autoryzację, zarządzanie bazą danych w czasie rzeczywistym oraz Storage do przechowywania rzutów mieszkań i zdjęć usterek.
  * **Eksport danych:** Biblioteka `jspdf` / `html2canvas` do generowania raportów po stronie klienta.

### Struktura Bazy Danych

Zaprojektowano relacyjną strukturę danych w PostgreSQL (Supabase), minimalizującą redundancję i zapewniającą szybki dostęp do informacji o nieruchomościach i usterkach.

| Tabela | Kolumny | Opis |
| :--- | :--- | :--- |
| `users` | `id`, `email`, `created_at`, `subscription_tier` | Tabela autoryzacyjna (obsługiwana natywnie przez Supabase Auth). |
| `properties` | `id`, `user_id` (FK), `name`, `address`, `floor_plan_url` | Przechowuje informacje o danej nieruchomości i link do pliku rzutu z Storage. |
| `pins` (usterki) | `id`, `property_id` (FK), `pos_x`, `pos_y`, `description`, `status`, `photo_url` | Centralna tabela przechowująca dane o usterkach, ich lokalizacji na rzucie i statusie. |

### Kluczowe rozwiązania techniczne

**1. Responsywne mapowanie współrzędnych (Responsive Pin Mapping)**
Największym wyzwaniem inżynieryjnym w interfejsie użytkownika jest zachowanie precyzyjnej lokalizacji "pinezek" na rzucie mieszkania, niezależnie od rozdzielczości ekranu urządzenia. W tym celu zaimplementowano algorytm przeliczający współrzędne kliknięcia (w pikselach) na wartości relatywne (w procentach).

Algorytm zapisu pozycji usterki do bazy:
$$X_{rel} = \left(\frac{X_{click}}{W_{img}}\right) \cdot 100$$
$$Y_{rel} = \left(\frac{Y_{click}}{H_{img}}\right) \cdot 100$$

Gdzie $W_{img}$ i $H_{img}$ to aktualne wymiary renderowanego obrazu w przeglądarce. Przy odczycie z bazy danych pinezki są pozycjonowane za pomocą stylów CSS (`left: X%`, `top: Y%`), co gwarantuje pełną responsywność interfejsu bez utraty spójności danych przestrzennych.

**2. Zarządzanie stanem i optymalizacja zapytań**
Aplikacja minimalizuje ilość zapytań do bazy danych. Rzuty mieszkań i przypisane do nich usterki są pobierane przy wejściu w widok detali i trzymane w stanie lokalnym komponentu. Aktualizacje (np. zmiana statusu) korzystają z optymistycznego UI (Optimistic UI Update) – interfejs reaguje natychmiast, a zapytanie aktualizujące do Supabase wysyłane jest w tle.

-----# PropCheck
