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

## 2. Backend

### Supabase (Implemented - Phase 2)
- **Baza danych:** PostgreSQL
- **Auth:** Supabase Auth (Email, OAuth)
- **Storage:** Base64 encoded strings in database (photos stored as `photos` JSON column)
- **Real-time:** PostgreSQL LISTEN/NOTIFY
- **Status:** ✅ Production ready

**Migracja:**
```
localStorage (Phase 1, fallback)
    ↓
Supabase PostgreSQL + Auth (Phase 2) ✅
```

## 3. Storage (Przechowywanie danych)

### Supabase PostgreSQL (Primary - Phase 2)
- **Tabela `properties`:** Dane nieruchomości
- **Tabela `issues`:** Usterki z kolumną `photos` (JSON array base64 strings)
- **Auth:** Supabase Auth z tabelą `users`
- **Realtime:** Subskrypcje PostgreSQL

**Przykład struktury tabeli issues:**
```sql
issues {
  id: uuid (PK)
  property_id: uuid (FK)
  title: string
  description: text
  status: enum
  photos: jsonb[] -- base64 encoded images
  created_at: timestamp
  updated_at: timestamp
}
```

### localStorage (Fallback/Minimal mode)
- **Limit:** ~5-10MB na przeglądarkę
- **Format:** JSON (Serializable objects)
- **Keys używane:**
  - `propcheck_properties`
  - `propcheck_issues`
  - `propcheck_user`
  - `propcheck_current_user` (auth session fallback)


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
- **Storage:** localStorage inspection, Supabase tab monitoring
- **Network:** Supabase API calls inspection
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

**Supabase Error Handling:**
```javascript
try {
  await supabase.from('issues').insert(issueData);
} catch (error) {
  console.error('Supabase error:', error.message);
  // Fallback to localStorage
  saveLocally(issueData);
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

### Phase 1 (MVP) - Completed
- Static hosting (Netlify) ✅
- localStorage fallback mode
- Demo data preloaded

### Phase 2 (Current) - Active
- Supabase backend ✅
- PostgreSQL with `properties` and `issues` tables
- Supabase Auth implemented
- Photos stored as base64 in `photos` column
- Realtime subscriptions enabled

### Production
- HTTPS enforcement ✅
- CORS setup ✅
- Error monitoring (Sentry - planned)
- Analytics (Plausible - planned)

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

**Dokument ostatnio aktualizowany:** 2026-05-12
