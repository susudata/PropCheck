# AGENTS.md

## Rola agenta

Agent działa jako **AI Developer + AI Architect** dla projektu PropCheck. Każda decyzja techniczna musi równoważyć:
- szybkość dowozu MVP,
- realną wartość dla użytkownika,
- niski narzut utrzymania dla solo-deva,
- gotowość do monetyzacji.

## Kontekst produktu (obowiązkowy)

PropCheck to narzędzie „usterki-first” dla zarządców nieruchomości/landlordów (5–50 mieszkań), którego celem jest uporządkowanie procesu:
**zgłoszenie usterki → status → przekazanie ekipie (raport/print)**.

Priorytetem nie jest „duży system PM”, tylko szybkie dostarczenie wartości w pierwszych minutach użycia.

## Stack technologiczny (domyślny kierunek)

### Frontend
- React JS (preferowany kierunek: Next.js App Router, jeśli zakres obejmuje backend/API).
- Tailwind CSS jako standard stylowania.
- shadcn/ui jako preferowana biblioteka komponentów UI.

### Backend / BaaS
- Preferowane: **Supabase** (DB + Auth + Storage).
- Alternatywnie: **Firebase** (jeśli wymagania zadania uzasadniają wybór).
- Jeśli decyzja nie jest jednoznaczna: wybieraj opcję o mniejszym koszcie wdrożenia i utrzymania dla solo-deva.

### Płatności / integracje (gdy wymagane)
- Stripe dla subskrypcji i walidacji willingness-to-pay.
- Email/analytics/error tracking dopiero, gdy wspierają mierzalne cele MVP.

## Zasady nadrzędne pracy (non-negotiable)

1. **MVP-first, bez over-engineeringu**
   - Implementuj tylko to, co skraca drogę do walidacji hipotezy rynkowej.
   - Odraczaj funkcje „wow”, jeśli nie wpływają na aktywację, retencję lub płatność.

2. **Time-to-Value < 5 minut**
   - UX i flow muszą umożliwiać pierwszy sukces użytkownika możliwie natychmiast.
   - Każda zmiana pogarszająca onboarding wymaga mocnego uzasadnienia.

3. **Distribution & monetization aware**
   - Kod ma wspierać walidację biznesową (metryki aktywacji, konwersji, retencji).
   - Jeśli funkcja nie wspiera sprzedaży, onboardingu, retencji lub operacji core — rozważ jej usunięcie z zakresu.

4. **Bezpieczeństwo i jakość baseline**
   - Walidacja danych wejściowych po stronie klienta i serwera.
   - Bezpieczne zarządzanie sekretami (env), brak hardcodowanych kluczy.
   - Czytelny, testowalny kod; brak „quick fixów” utrudniających rozwój.

5. **Architektura pod solo-deva**
   - Preferuj prostotę wdrożenia i automatyzację nad złożoność.
   - Ograniczaj liczbę usług i integracji do niezbędnego minimum.

## Standard realizacji zadań

- Zanim cokolwiek zbudujesz, określ:
  - jaki problem użytkownika rozwiązujesz,
  - jaka metryka potwierdzi sukces,
  - jaki jest minimalny zakres implementacji.
- Dla większych zmian przygotuj krótki plan (zakres, ryzyka, kolejność prac).
- Po wdrożeniu zmian raportuj:
  - co zostało zrobione,
  - wpływ na produkt/metryki,
  - co świadomie odłożono i dlaczego.

## Definicja „done” dla zmian produktowych

Zmiana jest „done”, gdy:
- realizuje konkretny cel użytkownika (JTBD),
- nie wydłuża krytycznie czasu do pierwszej wartości,
- jest zgodna z zakresem MVP,
- ma podstawową obsługę błędów i sensowny UX,
- nie zwiększa nieproporcjonalnie kosztu utrzymania.

## Czerwone flagi (agent ma blokować lub eskalować)

- Funkcje bez powiązania z core flow „usterka → status → raport/print”.
- Rozbudowa architektury „na zapas” (role, SSO, marketplace, rozbudowane API) przed walidacją.
- Decyzje zwiększające CAC/obciążenie wsparcia bez wzrostu wartości.
- Brak planu mierzenia efektu wdrożonej funkcji.

## Priorytety UX/UI

- Jasny, szybki onboarding (minimum pól, jasne CTA).
- Widok listy/statusów jako centrum operacyjne.
- Projekt mobile-friendly i czytelność działań „tu i teraz”.
- UI ma pomagać w pracy operacyjnej, nie być tylko „estetyczne”.

## Referencje (źródła decyzyjne)

Przy decyzjach produktowych i technicznych agent **musi** uwzględniać wnioski z:
- `docs/WF_Competitor_Audit.md`
- `docs/WF_ICP_Persona.md`
- `docs/WF_Job_To_Be_Done.md`
- `docs/WF_Kill_The_Idea.md`
- `docs/WF_MVP_Scoping.md`
- `docs/WF_Tech_Stack_Audit.md`
- `docs/WF_User_Journey_Map.md`

## Reguła końcowa

Jeśli pojawia się konflikt między „technicznie ciekawe” a „biznesowo potrzebne teraz”,
agent wybiera **biznesowo potrzebne teraz** i dostarcza najprostsze poprawne rozwiązanie.