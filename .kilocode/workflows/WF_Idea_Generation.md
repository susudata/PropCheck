# WF_Idea_Generation

**Cel:** Wygenerowanie 8-10 wysokiej jakości, zweryfikowanych wstępnie koncepcji SaaS, które rozwiązują realne problemy i są możliwe do dowiezienia przez jedną osobę.

### **1. Faza Wywiadu (Context Gathering)**

Zanim zaczniesz generować pomysły, musisz zrozumieć "narzędzia", jakimi dysponuje deweloper. Zacznij od pytania o doświadczenie użytkownika - następnie posługuj się odpowiednim wariantem wywiadu

#### **Rozbudowana Ankieta dla Standardowego Użytkownika**
Aby lepiej dopasować pomysły, użyj poniższej ankiety (zadaj pytania sekwencyjnie, maksymalnie 5-7 pytań na raz, aby nie przytłoczyć):

1. **Doświadczenie w programowaniu:** Na skali 1-10, jak oceniasz swoje umiejętności w kodowaniu? (1 - zupełny początkujący, 10 - ekspert).
2. **Ulubiony język/stack:** Jaki język programowania lub framework używasz najczęściej? (np. Python, React, Node.js).
3. **Dostępne zasoby:** Czy masz dostęp do narzędzi AI (np. OpenAI API, Hugging Face)? Jakie masz ograniczenia czasowe lub finansowe?
4. **Branżowe zainteresowania:** Jakie branże Cię interesują? (np. zdrowie, edukacja, finanse – podaj przykłady problemów, które Cię irytują).
5. **Cele biznesowe:** Czy chcesz zarabiać natychmiast, czy budować portfolio? Jaki jest Twój docelowy model monetyzacji (subskrypcja, jednorazowa opłata)?
6. **Ryzyka i preferencje:** Czy wolisz pomysły niskiego ryzyka (łatwe do zbudowania) czy wysokiego wpływu (potencjalnie skalowalne)?
7. **Inspiracje:** Opisz aplikację lub narzędzie, które ostatnio Cię zainspirowało – dlaczego?

#### **Wariant Ankiety dla Mocno Niedoświadczonego Twórcy (Studenta Budującego Pierwszą Aplikację z AI)**
Dla studentów bez doświadczenia, uprość język, wyjaśnij terminy i skup się na edukacji oraz małych krokach. Zadaj pytania w przyjazny sposób, zachęcając do eksperymentowania. Użyj tej ankiety zamiast standardowej:

1. **Co już wiesz o kodowaniu?** Opisz, co już próbowałeś robić z komputerem – może jakieś proste programy, strony internetowe lub gry? (Nie martw się, jeśli nic – to normalne na początku!).
2. **Ulubione narzędzia:** Czy używałeś już czegoś związanego z AI, jak ChatGPT, czy jakieś aplikacje do rysowania obrazów? Jeśli nie, co Cię ciekawi w AI (np. pisanie tekstów, generowanie pomysłów)?
3. **Czas i zasoby:** Ile czasu tygodniowo możesz poświęcić na projekt? Masz dostęp do komputera i internetu? Czy masz jakieś pieniądze na narzędzia (np. darmowe wersje są OK)?
4. **Co Cię interesuje?** Jakie tematy lub problemy Cię denerwują? Na przykład: szkoła, hobby, praca dorywcza, zdrowie? Opisz jeden problem, który chciałbyś rozwiązać za pomocą aplikacji.
5. **Dlaczego AI?** Dlaczego chcesz użyć AI w swojej pierwszej aplikacji? Czy to dla zabawy, nauki, czy może zarobku? Co chcesz osiągnąć (np. portfolio, pomoc znajomym)?
6. **Pomoc i nauka:** Czy masz mentora lub kolegów, którzy mogą pomóc? Jakie umiejętności chcesz zdobyć (np. programowanie, design, biznes)?
7. **Mały cel:** Wyobraź sobie prostą aplikację – co by robiła? Na przykład: generator pomysłów na prezenty, tłumacz dla studentów, czy coś innego?

Po zebraniu odpowiedzi z ankiety, przejdź do generowania pomysłów, dostosowując je do poziomu użytkownika (np. dla studentów – proste projekty z AI, jak chatboty lub narzędzia edukacyjne).

### **2. Frameworki Generowania Pomysłów**

Korzystaj z poniższych filtrów, aby unikać generycznych pomysłów:

- **"Boring Business" Automation:** Szukaj nudnych, powtarzalnych procesów w niszowych branżach (np. zarządzanie certyfikatami dla instruktorów nurkowania).
- **Sidecar SaaS:** Tworzenie narzędzi obudowanych wokół dużych ekosystemów (Shopify Apps, Chrome Extensions dla LinkedIn, Slack Apps).
- **Programmatic SEO Potential:** Pomysły na narzędzia generujące dużą ilość stron z danymi (np. "Kalkulator kosztów X dla branży Y").
- **Micro-SaaS:** Rozwiązania typu "single-feature", które robią jedną rzecz perfekcyjnie (np. narzędzie tylko do anonimizacji danych w PDF).

### **3. Kryteria Oceny (Internal Audit)**

Każdy wygenerowany przez Ciebie pomysł musi przejść test "Solo-Dev":

1. **Low Support:** Czy produkt wymaga wsparcia 24/7? (Jeśli tak – odrzuć).
2. **High Pain:** Czy rozwiązuje problem "palących się pieniędzy" lub "straty czasu", a nie tylko "estetyki"?
3. **No Viral Dependency:** Czy produkt ma wartość bez efektu sieciowego (musi być użyteczny dla pierwszego użytkownika)?
4. **Monetization Clarity:** Czy od razu widać, za co użytkownik miałby zapłacić?

### **4. Struktura Outputu**

Dla każdego pomysłu przedstaw tabelę/blok zawierający:

- **Nazwa Robocza & One-Liner:** Jasna definicja wartości.
- **The "Why Now":** Dlaczego to jest dobre dzisiaj (trendy, zmiany w prawie, nowe API).
- **Target Audience:** Kto dokładnie jest klientem (zawód/branża).
- **Unfair Advantage dla Solo-Dev:** Dlaczego jedna osoba może to zbudować i wygrać.
- **Monetization Idea:** Propozycja modelu (np. 29$/mo).

### **5. Mechanizm Selekcji**

Na końcu prezentacji pomysłów wymuś interakcję:
_"Wybierz jeden pomysł, który najbardziej Cię intryguje, a ja natychmiast uruchomię procedurę `WF_Kill_The_Idea`, abyśmy sprawdzili, gdzie kryją się pułapki, zanim napiszesz pierwszą linię kodu."_

---

### **6. Dodatkowe uwagi**

> Kiedy użytkownik wywoła `WF_Idea_Generation`, porzuć ogólne sugestie. Skup się na "High Intensity Niches". Nie proponuj systemów CRM, Project Managementu ani niczego, co konkuruje z gigantami (Google, Microsoft, Notion). Szukaj "pęknięć w systemie" – miejsc, gdzie duże firmy są zbyt wolne lub zbyt drogie dla małych nisz.
