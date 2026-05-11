# Tech Stack — PropCheck

## 1. Frontend

### HTML5
- **Wersja:** HTML5 standard
- **Użycie:** Struktura DOM, accessibility (aria-labels, semantic HTML)
- **Konwencja:** Semantic HTML (`<main>`, `<section>`, `<button>` zamiast `<div>`)

### CSS3 + Tailwind CSS
- **Wersja:** Tailwind CSS v3.4.3
- **Build:** PostCSS + Autoprefixer
- **Podejście:** Utility-first CSS
- **Konfiguracja:** `tailwind.config.js`
- **Build command:** `npm run build` (minified) lub `npm run dev` (watch)

**Zmienne CSS (Design System):**
```css
--space-xs: 0.25rem
--space-sm: 0.5rem
--space-md: 0.875rem
--space-lg: 1rem
--space-xl: 1.5rem
--space-2xl: 2rem
--space-3xl: 3rem

--color-bg: #f9f5f0
--color-cream: #f5ebe0
--color-text: #2c2416
--color-text-secondary: #6b6259
--color-border: #d9cfc0
--color-critical: #c45c3e
--color-warning: #d4a24c
--color-success: #7a9e7a
```

### Vanilla JavaScript (ES6+)
- **Framework:** Brak frameworku (VanillaJS)
- **Moduły:** Singleton pattern dla managementu stanu
- **Async:** Promise-based, async/await gdzie potrzeba
- **DOM API:** Direct manipulation (document.getElementById, querySelector, etc.)

**Przykład struktury:**
```javascript
// State management (global)
let properties = [];
let issues = [];
let currentUser = null;

// Moduł (logika biznesowa)
function addIssue(issue) {
  issues.push(issue);
  saveIssues();
  renderIssuesPage();
}

// Event listeners
document.addEventListener('DOMContentLoaded', initializeApp);
```

### UI Components (shadcn/ui)
- **Biblioteka:** shadcn/ui-like custom components
- **Komponenty:** Buttons, Modals, Forms, Cards
- **Styl:** Tailwind CSS based, custom CSS również wspierana
- **Accessibility:** ARIA labels, keyboard navigation

**Przykład komponentu:**
```html
<!-- Modal -->
<div id="addIssueModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Dodaj usterkę</h2>
      <button class="modal-close-btn">✕</button>
    </div>
    <form id="addIssueForm">
      <!-- Input fields -->
      <input type="text" placeholder="Nazwa usterki" required>
      <!-- Photo upload -->
      <input type="file" accept="image/*" multiple>
    </form>
  </div>
</div>
```

## 2. Backend (MVP: Brak, zaplanowany Supabase Phase 2)

### Planned: Supabase
- **Baza danych:** PostgreSQL
- **Auth:** Supabase Auth (Email, OAuth)
- **Storage:** Supabase Storage (S3-compatible)
- **Real-time:** PostgreSQL LISTEN/NOTIFY
- **Wersja:** Będzie zdefiniowana w Phase 2

**Zaplanowana migracja:**
```
localStorage (Phase 1)
    ↓
Supabase PostgreSQL + Auth (Phase 2)
    ↓
Real-time sync WebSockets (Phase 3)
```

## 3. Storage (Przechowywanie danych)

### localStorage (Primary, MVP)
- **Limit:** ~5-10MB na przeglądarkę
- **Format:** JSON (Serializable objects)
- **Keys używane:**
  - `propcheck_properties`
  - `propcheck_issues`
  - `propcheck_user` (jeśli będzie auth)
  
**Przykład:**
```javascript
// Zapis
localStorage.setItem('propcheck_issues', JSON.stringify(issues));

// Odczyt
const issues = JSON.parse(localStorage.getItem('propcheck_issues') || '[]');
```

### IndexedDB (Planned)
- **Limit:** ~50MB+
- **Use:** Przechowywanie zdjęć oddzielnie od metadanych
- **Status:** Infrastruktura przygotowana (`initPhotoDB()` w dashboard.js), nie aktywnie używana
- **Plan:** Zaplanowana na Phase 2

## 4. Kompresja i optimizacja

### Canvas API (Image Compression)
```javascript
function compressImageToBase64(file, maxWidth, maxHeight, quality) {
  // Zmienia rozmiar obrazu z zachowaniem aspect ratio
  // Konwertuje na JPEG (lepsze compression niż PNG)
  // Zwraca base64 data URI
  
  // Użycie:
  const compressed = await compressImageToBase64(file, 800, 800, 0.6);
}
```

**Parametry:**
- Issue photos: 800x800, quality 0.6 (≈90% redukcja)
- Floorplans: 1200x1200, quality 0.7 (≈85% redukcja)

## 5. Narzędzia developerskie

### Build System
```bash
npm run dev   # Tailwind watch mode
npm run build # Tailwind minify
```

### Package.json
```json
{
  "name": "propcheck",
  "version": "1.0.0",
  "main": "script.js",
  "scripts": {
    "dev": "tailwindcss -i ./src/input.css -o ./dist/styles.css --watch",
    "build": "tailwindcss -i ./src/input.css -o ./dist/styles.css --minify"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.3",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

### Browser DevTools
- **Console:** Sprawdzanie błędów, compression logs
- **Storage:** localStorage inspection, quota monitoring
- **Network:** Sprawdzanie (jeśli będzie backend)
- **Performance:** Profiling operacji DOM

## 6. Konwencje projektowe

### Naming
```javascript
// Zmienne (camelCase)
const currentProperty = { ... }
const isEditMode = true

// Funkcje (camelCase, czasowniki)
function addIssue() { ... }
function renderIssuesPage() { ... }
function getStatusColor(status) { ... }

// Stałe (UPPER_SNAKE_CASE)
const STORAGE_KEY_ISSUES = 'propcheck_issues'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// IDs w HTML (kebab-case)
id="add-issue-modal"
id="issues-count-total"
data-section="issues-page"
```

### CSS Classes (BEM-like)
```css
/* Blok */
.issues-page { }

/* Element */
.issues-page-header { }
.issues-page-controls { }

/* Modifier */
.issues-page.is-loading { }
.issues-group[data-collapsed="true"] { }
```

### DOM Struktura
```html
<!-- Semantyczne -->
<main>
  <section id="overviewSection">
    <!-- Dashboard -->
  </section>
  
  <section id="issuesPageSection">
    <!-- Issues Page -->
  </section>
</main>

<!-- Modały na koniec body -->
<div id="addIssueModal" class="modal"></div>
<div id="photoGalleryModal" class="modal"></div>
```

### Error Handling
```javascript
try {
  localStorage.setItem('propcheck_issues', JSON.stringify(issues));
} catch (QuotaExceededError) {
  console.error('Storage full');
  alert('Storage jest pełny. Zdjęcia nie zostały zapisane.');
  // Fallback: zapis bez zdjęć
  saveIssuesWithoutPhotos(issues);
}
```

### Bezpieczeństwo (Security)
```javascript
// Escape HTML w output
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Użycie
element.innerHTML = escapeHtml(userInput);
```

## 7. Ścieżka wdrażania (Deployment)

### MVP (Phase 1)
- Static hosting (GitHub Pages, Netlify, Vercel)
- Brak backendu
- localStorage only
- Demo data preloaded

### Phase 2
- Supabase backend
- PostgreSQL migration
- Auth setup
- Storage bucket

### Production
- HTTPS enforcement
- CORS setup
- CDN caching
- Error monitoring (Sentry)
- Analytics (Plausible)

## 8. Performance Targets

| Metryka | Target | Aktualne |
|---------|--------|----------|
| Ładowanie strony | < 2s | N/A |
| DOM interaction | < 500ms | N/A |
| Zapis do localStorage | < 100ms | ✅ |
| Kompresja zdjęcia | < 1s | ✅ |
| Rendering listy | < 300ms | ✅ |

## 9. Kompatybilność przeglądarek

| Przeglądarka | Min. wersja | Status |
|---|---|---|
| Chrome | 90+ | ✅ Supported |
| Firefox | 88+ | ✅ Supported |
| Safari | 14+ | ✅ Supported |
| Edge | 90+ | ✅ Supported |
| IE 11 | - | ❌ Not supported |

---

**Dokument ostatnio aktualizowany:** 2026-05-11
