# Role: Tester / Osoba odpowiedzialna za zapewnienie jakości

## Odpowiedzialność

Tester odpowiada za:
- Weryfikację poprawności działania funkcjonalności zgodnie z wymaganiami
- Przeprowadzanie testów manualnych zgodnie ze zdefiniowanymi scenariuszami
- Identyfikowanie i raportowanie błędów
- Weryfikację poprawki błędów
- Zapewnienie, że produkt spełnia kryteria akceptacji przed wydaniem

## Strategia testów manualnych (Happy Path)

Scenariusz Happy Path opisuje podstawowy przepływ użytkownika przez kluczowe funkcjonalności aplikacji bez napotykania błędów lub odchyleń. Jest to podstawowy test weryfikujący, czy główne ścieżki użytkownika działają poprawnie.

### Scenariusz Happy Path – PropCheck

```
1. Add Property → pojawia się na dashboardzie ✓
2. Upload floorplan → kompresja + display ✓
3. Click floorplan → Add Issue modal ✓
4. Add issue details + photos → pinezka na mapie ✓
5. Change status → kolor pinezki zmienia się ✓
6. Go to Issues Page → lista pogrupowana ✓
7. Sort/filter → lista się reordeuje ✓
8. Delete issue → pinezka znika ✓
9. Refresh page → dane wrócą ✓
```

### Szczegółowe kroki testowe

#### Test 1: Dodawanie nieruchomości (Property)
- **Wejście:** Na dashboardzie kliknij przycisk "Add Property" lub podobny
- **Akcja:** Wypełnij formularz (nazwa, adres, opcjonalnie upload floorplan)
- **Sprawdź:** 
  - Formularz akceptuje dane i wyświetla komunikat o sukcesie
  - Po zamknięciu modału nowa nieruchomość pojawia się na dashboardzie jako karta
  - Jeśli został wgrany floorplan, jest on wyświetlany na karcie (lub jako miniaturka)

#### Test 2: Upload i wyświetlanie floorplanu
- **Wejście:** Podczas dodawania nieruchomości lub w trybie edycji
- **Akcja:** Prześlij obraz rzutu mieszkania (obsługiwane formaty: JPG, PNG)
- **Sprawdź:**
  - Obraz jest akceptowany i poddawany kompresji (widoczne w konsoli: "Image compressed: ...")
  - Po zapisaniu, floorplan jest wyświetlany w widoku nieruchomości (na karcie dashboardu lub w osobnym widoku)
  - Floorplan jest responsywny i dobrze skaluje się na różnych rozmiarach ekranu

#### Test 3: Dodawanie usterki na floorplanie
- **Wejście:** Na dashboardzie kliknij na nieruchomość, aby przejść do widoku floorplanu (lub użyj przycisku "View Floorplan")
- **Akcja:** Kliknij w dowolnym miejscu na floorplanie, aby otworzyć modal "Add Issue"
- **Sprawdź:**
  - Modal pojawia się z polami do wypełnienia (nazwa, opis, lokalizacja, upload zdjęć)
  - Współrzędne kliknięcia (pos_x, pos_y) są automatycznie wypełnione lub przechowywane wewnętrznie
  - Po wypełnieniu formularza i zaakceptowaniu, pojawia się pinezka na floorplanie w miejscu kliknięcia

#### Test 4: Szczegóły usterki i zdjęcia
- **Wejście:** W modalu "Add Issue"
- **Akcja:** Wypełnij wszystkie obowiązkowe pola (nazwa, opis, lokalizacja) i opcjonalnie załącz zdjęcia
- **Sprawdź:**
  - Formularz waliduje pola (np. nie pozwala na wysłanie pustej nazwy)
  - Załączone zdjęcia są poddawane kompresji przed zapisaniem (sprawdź komunikaty w konsoli)
  - Po zapisaniu, modal zamyka się i na floorplanie pojawia się pinezka reprezentująca usterkę
  - Pinezka ma kolor odpowiadający początkowemu statusowi (np. czerwony dla "nowe")

#### Test 5: Zmiana statusu usterki
- **Wejście:** Na floorplanie kliknij na istniejącą pinezke usterek
- **Akcja:** W otwartym modalu zmień status usterki (np. z "ZGŁOSZONE" na "W TRAKCIE")
- **Sprawdź:**
  - Status zostaje zaktualizowany w modalu
  - Kolor pinezki na floorplanie zmienia się zgodnie z nowym statusem (zielony dla "gotowe", pomarańczowy dla "w trakcie")
  - Po zamknięciu modału zmiana jest widoczna na floorplanie

#### Test 6: Przejście do strony Issues i grupowanie
- **Wejście:** Z dowolnego widoku użyj nawigacji (np. pasek boczny lub bottom nav) aby przejść do "Issues Page"
- **Sprawdź:**
  - Strona Issues wyświetla listę wszystkich usterek z różnych nieruchomości
  - Lista jest pogrupowana według nieruchomości (każda nieruchomość jako nagłówek z listą swoich usterek)
  - Przy każdej usterce widoczne są: nazwa, lokalizacja, status (kolor i tekst), data utworzenia
  - Licznik usterek przy każdej nieruchomości odpowiada liczbie wyświetlonych usterek w grupie

#### Test 7: Sortowanie i filtrowanie
- **Wejście:** Na stronie Issues Page
- **Akcja:** 
  - Użyj rozwijanej listy "Sortuj przez" (opcje: alfabetycznie A-Z, alfabetycznie Z-A, data (najstarsze pierwsze), data (najnowsze pierwsze), status)
  - Użyj filtrów statusu (checkboxy lub przyciski dla: Wszystkie, ZGŁOSZONE, W TRAKCIE, GOTOWE)
- **Sprawdź:**
  - Lista usterek zostaje przeсортовana zgodnie z wybraną opcją (potwierdź kilka przypadków)
  - Lista zostaje ograniczona do tylko tych usterek, które mają zaznaczony status w filtrze
  - Połączenie sortowania i filtrowania działa poprawnie (najpierw filtruj, potem sortuj wynik)
  - Grupowanie po nieruchomościach pozostaje zachowane (nagłówki nieruchomości są nadal obecne, ale mogą być puste jeśli nieruchomość nie ma usterek pasujących do filtru)

#### Test 8: Usuwanie usterki
- **Wejście:** Na stronie Issues Page lub bezpośrednio na floorplanie (zależnie od implementacji)
- **Akcja:** Znajdź usterkę i wybierz opcję "Usuń" (ikona kosza lub przycisk w modalu)
- **Sprawdź:**
  - Po potwierdzeniu usunięcia, usterka znika z listy na Issues Page
  - Jeśli usuwasz z floorplanu, pinezka znika z mapy
  - Usterka jest również usuwana z localStorage (sprawdź w devtools → Application → localStorage)
  - Operacja nie powoduje błędów w konsoli

#### Test 9: Persystencja danych po odświeżeniu strony
- **Wejście:** Na dowolnej stronie aplikacji (dashboard, floorplan, issues)
- **Akcja:** Odśwież stronę przeglądarki (F5 lub ikona odświeżania)
- **Sprawdź:**
  - Po przeładowaniu wszystkie wcześniej dodane nieruchomości są nadal obecne na dashboardzie
  - Wszystkie usterek (z ich pozycjami, opisami, zdjęciami i statusami) są nadal widoczne na odpowiednich floorplanach
  - Strona Issues Page pokazuje te same grupy i listy usterek co przed odświeżeniem
  - Żadne dane nie zostały utracone ani nie pojawiły się przypadkowe duplikaty

### Dodatkowe uwagi dla testera

#### Środowisko testowe
- **Przeglądarki:** Chrome (zalecane), Firefox, Safari, Edge (testować przynajmniej dwie różne)
- **Rozmiary ekranu:** Testuj na szerokościach reprezentujących mobile (<=768px), tablet (768px-1024px) i desktop (>=1024px)
- **Tryb incognito/prywatny:** Aby wyczyścić localStorage między sesjami testowymi (lub ręcznie czyść localStorage przez devtools)

#### Narzędzia deweloperskie
- **Console:** Sprawdzaj komunikaty o kompresji obrazów, błędy, ostrzeżenia
- **Application > localStorage:** Weryfikuj struktury danych `propcheck_properties` i `propcheck_issues`
- **Network:** Choć aplikacja nie wymaga backendu w MVP, sprawdzaj, czy nie ma nieoczekiwanych żądań sieciowych
- **Performance:** Używaj zakładki Performance do nagrywania i analizowania czasu kluczowych operacji (np. dodawanie dużej liczby zdjęć)

#### Raportowanie błędów
Jeśli napotkasz odstępstwo od oczekiwanego zachowania:
1. **Odtwórz:** Upewnij się, że błąd można powtórzyć konsekwentnie
2. **Izoluj:** Spróbuj znaleźć najprostsze kroki prowadzące do błędu
3. **Zadbaj o środowisko:** Zanotuj wersję przeglądarki, rozmiar ekranu, ewentualnie rozszerzenia które mogą wpływać
4. **Zbierz dane:** Zrzut ekranu, konsola (błędy, ostrzeżenia), stan localStorage w momencie błędu
5. **Zgłoś:** Przekaż raport developerowi wraz z sugestią priorytetu (blokujący, wysoki, średni, niski)

#### Częstotliwość testów
- **Po każdej zmianie kodu:** Przynajmniej podstawowy scenariusz Happy Path
- **Przed wydaniem/demo:** Pełny przebieg wszystkich scenariuszy testowych (Happy Path + edge cases jeśli zdefiniowane)
- **Podczas eksploracyjnego testowania:** Losowe ścieżki użytkownika w celu znalezienia nieoczekiwanych zachowań

---
*Aktualizacja: 2026-05-12*