# Plan: Podstrona "Usterki" — Lista wszystkich usterek z sortowaniem i filtrowaniem

## Sekcja 1: Walidacja zakresu i kryterium sukcesu

- [x] 1.1 **Funkcjonalność:** Użytkownik z dashboardu klika przycisk „Usterki" w sidebar → otworzy się dedykowana podstrona zawierająca listę WSZYSTKICH usterek z możliwością:
  - Sortowania (alfabetycznie, daty, statusu)
  - Filtrowania po statusie (trzy checkboxy: zgłoszone, w trakcie, rozwiązane)
  - Grupowania po nieruchomościach (każda grupa ma nagłówek z nazwą, licznikiem, i strzałeczką do złożenia/rozwinięcia grupy)

- [x] 1.2 **Zakres:** Zmiana dotyka głównie `dashboard.html` (nowa strona/tab), `dashboard.js` (rendering, logika sortowania/filtrowania), `dashboard.css` (style listy, grup, sortowania).

- [x] 1.3 **Kryterium sukcesu:**
  - (a) Użytkownik widzi wszystkie usterki pogrupowane po nieruchomościach
  - (b) Może zmienić sortowanie (menu dropdown: „Alfabetycznie", „Daty", „Statusu")
  - (c) Może zaznaczać/odznaczać checkboxy statusu (zgłoszone, w trakcie, rozwiązane) → lista się filtruje
  - (d) Może złożyć grupę klikając strzałeczkę → usterki danego mieszkania są ukryte
  - (e) Lista pokazuje dla każdej usterki: nazwę, lokalizację, status (badge + kolor), datę, i ikonkę zdjęcia (jeśli są)
  - (f) Kliknięcie na usterkę → otwiera detail modal lub przywraca stan z dashboardu

- [x] 1.4 **Manualny test:** Przejście ze strony głównej → klik „Usterki" w sidebar → widoczna lista; zmiana sortu → lista się przesortu­je; zaznaczenie filtrów → usterki znikają; klik strzałki przy nieruchomości → grupa się złożyła; klik na usterkę → detail view.

---

## Sekcja 2: Implementacja minimalna

### 2.1 Struktura nawigacji — nowa strona/sekcja

**Architektura:** Strona "Usterki" będzie zaimplementowana jako **sekcja (tab) w obrębie dashboard.html** zamiast całkowicie osobnego pliku. Będzie ukryta domyślnie i pokazana po kliknie linknaków w sidebar/bottom-nav.

```html
<!-- main.main-content -->
  <!-- section id="overviewSection" (obecna, domyślnie visible) -->
  <!-- section id="issuesPageSection" (nowa, hidden) -->
    .issues-page-container
      .issues-page-header
      .issues-page-controls (sorting + filtering)
      .issues-list-grouped (output)
```

**Routing (JavaScript-side):**
```js
function showSection(sectionName) {
  document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
  document.getElementById(`${sectionName}Section`).style.display = 'block';
  
  // Aktualizuj active state w navigation
  updateActiveNav(sectionName);
  
  // Jeśli Issues → odśwież rendering
  if (sectionName === 'issuesPage') {
    renderIssuesPage();
  }
}
```

Sidebar i bottom-nav będą mieć event listenery, które wywoływują `showSection('issuesPage')`.

---

### 2.2 HTML — sekcja Issues Page

**W `dashboard.html`, dodajemy nową sekcję:`**

```html
<!-- Issues Page Section -->
<section id="issuesPageSection" class="issues-page-section" style="display: none;">
  
  <!-- Header -->
  <header class="issues-page-header">
    <div class="header-left">
      <button class="mobile-menu-btn" id="issuesPageMenuBtn" aria-label="Otwórz menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <h1 class="page-title">Usterki</h1>
    </div>
  </header>

  <!-- Controls: Sorting + Filtering -->
  <div class="issues-page-controls">
    <!-- Sortowanie -->
    <div class="control-group">
      <label for="issuesSortDropdown" class="control-label">Sortuj:</label>
      <select id="issuesSortDropdown" class="form-input form-select">
        <option value="date-desc">Najnowsze pierwsz</option>
        <option value="date-asc">Najstarsze pierwsze</option>
        <option value="name-asc">Alfabetycznie (A–Z)</option>
        <option value="name-desc">Alfabetycznie (Z–A)</option>
        <option value="status">Według statusu</option>
      </select>
    </div>

    <!-- Filtrowanie statusów -->
    <div class="control-group">
      <div class="filter-label">Pokaż:</div>
      <div class="filter-checkboxes">
        <label class="form-checkbox">
          <input type="checkbox" class="status-filter" value="new" checked>
          <span class="checkbox-mark"></span>
          <span class="checkbox-label">Zgłoszone</span>
        </label>
        <label class="form-checkbox">
          <input type="checkbox" class="status-filter" value="in_progress" checked>
          <span class="checkbox-mark"></span>
          <span class="checkbox-label">W trakcie</span>
        </label>
        <label class="form-checkbox">
          <input type="checkbox" class="status-filter" value="resolved" checked>
          <span class="checkbox-mark"></span>
          <span class="checkbox-label">Rozwiązane</span>
        </label>
      </div>
    </div>

    <!-- Licznik usterek -->
    <div class="control-group">
      <span class="issues-count">Razem: <strong id="issuesCountTotal">0</strong></span>
    </div>
  </div>

  <!-- Lista usterek (grouped by property) -->
  <div class="issues-list-grouped" id="issuesListGrouped">
    <!-- Renderuje się dynamicznie -->
  </div>

  <!-- Empty state -->
  <div class="empty-state" id="issuesPageEmpty" style="display: none;">
    <div class="empty-state-icon">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>
        <path d="M24 16V26M24 32H24.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <h3 class="empty-state-title">Brak usterek do wyświetlenia</h3>
    <p class="empty-state-text">Zmieniłeś filtry i żaden wynik się nie pojawił. Sprawdź czy wszystkie usterki są rozwiązane!</p>
  </div>

</section>
```

---

### 2.3 HTML — struktura grupy usterek

```html
<!-- Jedna grupa (property) — renderowana dynamicznie -->
<div class="issues-group">
  <!-- Nagłówek grupy (property) -->
  <div class="issues-group-header" data-property-id="prop-123">
    <button class="group-toggle-btn" aria-expanded="true">
      <svg class="toggle-icon" width="16" height="16" viewBox="0 0 20 20" fill="none">
        <!-- Strzałka w dół (rotate: 0 = rozwinięta, rotate: -90 = złożona) -->
        <path d="M5 7L10 12L15 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <div class="group-header-content">
      <h3 class="group-title">Apartament Słoneczna 15</h3>
      <span class="group-count">(4 usterki)</span>
    </div>
  </div>

  <!-- Lista usterek w grupie -->
  <div class="issues-group-list">
    <!-- Usterki tej nieruchomości -->
    <div class="issue-item">
      <!-- Zawartość usterki (patrz sekcja 2.4) -->
    </div>
    <!-- ... more issues ... -->
  </div>
</div>

<!-- Następna grupa (nieruchomość) -->
<div class="issues-group">
  ...
</div>
```

---

### 2.4 HTML — struktura pojedynczej usterki w liście

```html
<div class="issue-item" data-issue-id="iss-456">
  <!-- Status indicator (dot) -->
  <div class="issue-status-dot" style="background: var(--color-critical);">
  </div>

  <!-- Główna zawartość -->
  <div class="issue-content">
    <div class="issue-header">
      <h4 class="issue-title">Cieknący kran w kuchni</h4>
      <span class="issue-badge badge-critical">ZGŁOSZONE</span>
    </div>
    <div class="issue-meta">
      <span class="issue-location">Kuchnia</span>
      <span class="issue-date">15 maja 2026</span>
    </div>
    <p class="issue-description">Woda cieka z baterii pod zlewem. Wymaga natychmiastowej naprawy.</p>
  </div>

  <!-- Zdjęcie (jeśli istnieje) -->
  <div class="issue-photo-preview" title="Pokaż zdjęcia">
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3 14L7 10L10 13L17 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="7.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>
    <!-- Tooltip on hover: "4 zdjęcia" -->
  </div>

  <!-- Akcje (pin na mapie, edytuj, usuń) -->
  <div class="issue-actions">
    <button class="issue-action-btn" title="Mapa" data-action="map">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="10" cy="10" r="2" fill="currentColor"/>
      </svg>
    </button>
    <button class="issue-action-btn" title="Edytuj" data-action="edit">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M3 17L13 7L15 5L19 1M3 17L5 19L3 17Z" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    </button>
    <button class="issue-action-btn" title="Usuń" data-action="delete">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M6 3V15H14V3M4 3H16M8 3V1H12V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</div>
```

---

### 2.5 CSS — style strony Issues Page

**Nowe klasy w `dashboard.css`:**

```css
/* === ISSUES PAGE SECTION === */

.issues-page-section {
  animation: fadeIn 0.2s ease;
}

.issues-page-header {
  padding: var(--space-xl) var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.issues-page-header .page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
}

/* === CONTROLS === */

.issues-page-controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
  background: var(--color-cream);
  border-bottom: 1px solid var(--color-border-light);
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.control-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

/* Dropdown sortowania */
#issuesSortDropdown {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
  min-width: 180px;
}

/* Checkboxy filtrowania */
.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-right: var(--space-md);
}

.filter-checkboxes {
  display: flex;
  gap: var(--space-md);
}

.filter-checkboxes .form-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
}

.filter-checkboxes .checkbox-label {
  font-size: 0.875rem;
}

/* Licznik */
.issues-count {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.issues-count strong {
  color: var(--color-text);
  font-weight: 600;
}

/* Responsive controls */
@media (max-width: 768px) {
  .issues-page-controls {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .control-group {
    width: 100%;
  }

  #issuesSortDropdown {
    width: 100%;
  }

  .filter-checkboxes {
    flex-wrap: wrap;
    gap: var(--space-sm);
  }
}

/* === GROUPED LIST === */

.issues-list-grouped {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-xl) var(--space-xl);
}

/* === ISSUE GROUP === */

.issues-group {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.issues-group-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg) var(--space-lg);
  background: var(--color-cream-light);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background var(--transition-fast);
  user-select: none;
}

.issues-group-header:hover {
  background: var(--color-cream);
}

.group-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.group-toggle-btn .toggle-icon {
  transition: transform var(--transition-fast);
  color: var(--color-text);
}

/* Złożona grupa — obrót strzałki */
.issues-group-header[aria-expanded="false"] .toggle-icon {
  transform: rotate(-90deg);
}

.group-header-content {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
}

.group-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.group-count {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

/* Ukrywanie listy gdy grupa złożona */
.issues-group[data-collapsed="true"] .issues-group-list {
  display: none;
}

/* === ISSUE ITEM === */

.issues-group-list {
  display: flex;
  flex-direction: column;
  divide-y: 1px solid var(--color-border-light);
}

.issue-item {
  display: grid;
  grid-template-columns: 24px 1fr auto auto;
  gap: var(--space-md);
  align-items: start;
  padding: var(--space-md) var(--space-lg);
  transition: background var(--transition-fast);
}

.issue-item:hover {
  background: var(--color-cream-light);
}

/* Status indicator */
.issue-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

/* Główna zawartość usterki */
.issue-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0; /* flex truncation */
}

.issue-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.issue-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  flex-shrink: 0;
}

.issue-badge {
  padding: 4px 10px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.issue-badge.badge-new,
.issue-badge.badge-critical {
  background: rgba(196, 92, 62, 0.1);
  color: var(--color-critical);
}

.issue-badge.badge-in_progress,
.issue-badge.badge-warning {
  background: rgba(212, 162, 76, 0.1);
  color: var(--color-warning);
}

.issue-badge.badge-resolved {
  background: rgba(122, 158, 122, 0.1);
  color: var(--color-success);
}

/* Meta (location, date) */
.issue-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.issue-location::before {
  content: "📍";
  margin-right: 4px;
}

/* Opis */
.issue-description {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin: var(--space-xs) 0 0 0;
  line-height: 1.4;
}

/* Zdjęcie */
.issue-photo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-lg);
  background: var(--color-cream);
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background var(--transition-fast);
  flex-shrink: 0;
  color: var(--color-text-secondary);
}

.issue-photo-preview:hover {
  background: var(--color-cream-dark);
  border-color: var(--color-border);
}

/* Akcje */
.issue-actions {
  display: flex;
  gap: var(--space-xs);
  flex-shrink: 0;
}

.issue-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg);
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
  color: var(--color-text-secondary);
  padding: 0;
}

.issue-action-btn:hover {
  background: var(--color-cream);
  border-color: var(--color-border);
  color: var(--color-text);
}

/* Responsive */
@media (max-width: 768px) {
  .issue-item {
    grid-template-columns: 24px 1fr;
    gap: var(--space-sm);
  }

  .issue-photo-preview,
  .issue-actions {
    grid-column: 2;
    margin-top: var(--space-xs);
  }

  .issue-actions {
    display: flex;
    gap: var(--space-xs);
  }

  .issue-header {
    gap: var(--space-sm);
  }

  .issue-title {
    font-size: 0.875rem;
  }
}

/* === EMPTY STATE === */

.issues-page-section .empty-state {
  text-align: center;
  padding: var(--space-3xl) var(--space-xl);
}
```

---

### 2.6 JavaScript — nowe funkcje

#### Inicjalizacja strony Issues
```js
function initIssuesPage() {
  const sortDropdown = document.getElementById('issuesSortDropdown');
  const statusFilters = document.querySelectorAll('.status-filter');

  // Zmiana sortu
  sortDropdown.addEventListener('change', () => renderIssuesPage());

  // Zmiana filtrów statusów
  statusFilters.forEach(filter => {
    filter.addEventListener('change', () => renderIssuesPage());
  });

  // Klik na nagłówek grupy (złożenie/rozwinięcie)
  document.addEventListener('click', (e) => {
    const groupHeader = e.target.closest('.issues-group-header');
    if (groupHeader) {
      toggleIssueGroup(groupHeader);
    }
  });

  // Akcje usterek (edycja, usunięcie, mapa)
  document.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('.issue-action-btn');
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      const issueItem = actionBtn.closest('.issue-item');
      const issueId = issueItem.dataset.issueId;
      
      if (action === 'edit') {
        openEditIssueModal(issueId);
      } else if (action === 'delete') {
        deleteIssue(issueId);
      } else if (action === 'map') {
        const issue = issues.find(i => i.id === issueId);
        if (issue) {
          openFloorplanMapModal(issue.property_id);
        }
      }
    }
  });

  // Klik na zdjęcie
  document.addEventListener('click', (e) => {
    const photoPreview = e.target.closest('.issue-photo-preview');
    if (photoPreview) {
      const issueItem = photoPreview.closest('.issue-item');
      const issueId = issueItem.dataset.issueId;
      const issue = issues.find(i => i.id === issueId);
      if (issue && issue.photos && issue.photos.length > 0) {
        openPhotoGalleryModal(issue.photos);
      }
    }
  });
}
```

#### Rendering strony Issues
```js
function renderIssuesPage() {
  const sortValue = document.getElementById('issuesSortDropdown').value;
  const activeFilters = Array.from(document.querySelectorAll('.status-filter:checked'))
    .map(el => el.value);

  // Filtruj usterki
  let filtered = issues.filter(issue => activeFilters.includes(issue.status));

  // Sortuj
  filtered = sortIssues(filtered, sortValue);

  // Grupuj po nieruchomościach
  const grouped = groupIssuesByProperty(filtered);

  // Render
  const container = document.getElementById('issuesListGrouped');
  container.innerHTML = '';

  if (filtered.length === 0) {
    document.getElementById('issuesPageEmpty').style.display = 'block';
    document.getElementById('issuesCountTotal').textContent = '0';
    return;
  }

  document.getElementById('issuesPageEmpty').style.display = 'none';
  document.getElementById('issuesCountTotal').textContent = filtered.length;

  for (const propertyId in grouped) {
    const property = properties.find(p => p.id === propertyId);
    const groupIssues = grouped[propertyId];

    const groupEl = createIssueGroupElement(property, groupIssues);
    container.appendChild(groupEl);
  }
}

function groupIssuesByProperty(issuesList) {
  const grouped = {};
  issuesList.forEach(issue => {
    if (!grouped[issue.property_id]) {
      grouped[issue.property_id] = [];
    }
    grouped[issue.property_id].push(issue);
  });
  return grouped;
}

function sortIssues(issuesList, sortBy) {
  const sorted = [...issuesList];

  switch (sortBy) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name, 'pl'));
      break;
    case 'date-asc':
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case 'date-desc':
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'status':
      const statusOrder = { 'critical': 0, 'new': 1, 'in_progress': 2, 'resolved': 3 };
      sorted.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
      break;
    default:
      break;
  }

  return sorted;
}

function createIssueGroupElement(property, groupIssues) {
  const groupDiv = document.createElement('div');
  groupDiv.className = 'issues-group';
  groupDiv.dataset.propertyId = property.id;
  groupDiv.dataset.collapsed = 'false';

  const headerDiv = document.createElement('div');
  headerDiv.className = 'issues-group-header';
  headerDiv.setAttribute('aria-expanded', 'true');
  headerDiv.innerHTML = `
    <button class="group-toggle-btn" aria-expanded="true">
      <svg class="toggle-icon" width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M5 7L10 12L15 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <div class="group-header-content">
      <h3 class="group-title">${escapeHtml(property.name)}</h3>
      <span class="group-count">(${groupIssues.length} ${groupIssues.length === 1 ? 'usterka' : groupIssues.length < 5 ? 'usterki' : 'usterek'})</span>
    </div>
  `;

  const listDiv = document.createElement('div');
  listDiv.className = 'issues-group-list';

  groupIssues.forEach(issue => {
    const itemEl = createIssueItemElement(issue);
    listDiv.appendChild(itemEl);
  });

  groupDiv.appendChild(headerDiv);
  groupDiv.appendChild(listDiv);

  return groupDiv;
}

function createIssueItemElement(issue) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'issue-item';
  itemDiv.dataset.issueId = issue.id;

  const statusColor = getStatusColor(issue.status);
  const statusLabel = getStatusLabel(issue.status);
  const badgeClass = `badge-${issue.status}`;

  const createdDate = new Date(issue.created_at);
  const dateStr = createdDate.toLocaleDateString('pl-PL', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const hasPhotos = issue.photos && issue.photos.length > 0;
  const photoCountStr = hasPhotos ? `${issue.photos.length}` : '';

  itemDiv.innerHTML = `
    <div class="issue-status-dot" style="background: ${statusColor};"></div>
    
    <div class="issue-content">
      <div class="issue-header">
        <h4 class="issue-title">${escapeHtml(issue.name)}</h4>
        <span class="issue-badge ${badgeClass}">${statusLabel}</span>
      </div>
      <div class="issue-meta">
        <span class="issue-location">${escapeHtml(issue.location || 'Brak lokalizacji')}</span>
        <span class="issue-date">${dateStr}</span>
      </div>
      ${issue.description ? `<p class="issue-description">${escapeHtml(issue.description)}</p>` : ''}
    </div>

    ${hasPhotos ? `
      <div class="issue-photo-preview" title="${photoCountStr} ${photoCountStr === '1' ? 'zdjęcie' : 'zdjęcia'}">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M3 14L7 10L10 13L17 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="7.5" cy="6.5" r="1" fill="currentColor"/>
        </svg>
      </div>
    ` : ''}

    <div class="issue-actions">
      <button class="issue-action-btn" title="Mapa" data-action="map">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="10" cy="10" r="2" fill="currentColor"/>
        </svg>
      </button>
      <button class="issue-action-btn" title="Edytuj" data-action="edit">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M3 17L13 7L15 5L19 1M3 17L5 19L3 17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="issue-action-btn" title="Usuń" data-action="delete">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M6 3V15H14V3M4 3H16M8 3V1H12V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  return itemDiv;
}

function toggleIssueGroup(headerEl) {
  const groupEl = headerEl.closest('.issues-group');
  const isExpanded = headerEl.getAttribute('aria-expanded') === 'true';
  
  headerEl.setAttribute('aria-expanded', !isExpanded);
  groupEl.dataset.collapsed = isExpanded;
}

function getStatusColor(status) {
  switch (status) {
    case 'critical':
    case 'new':
      return 'var(--color-critical)';
    case 'in_progress':
    case 'warning':
      return 'var(--color-warning)';
    case 'resolved':
      return 'var(--color-success)';
    default:
      return 'var(--color-border)';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'critical':
    case 'new':
      return 'ZGŁOSZONE';
    case 'in_progress':
      return 'W TRAKCIE';
    case 'resolved':
      return 'GOTOWE';
    default:
      return status.toUpperCase();
  }
}
```

#### Nawigacja do Issues Page
```js
function initIssuesNavigation() {
  // Sidebar link "Usterki"
  const issuesSidebarLink = document.querySelector('.sidebar-link[href="#issues"]') 
    || Array.from(document.querySelectorAll('.sidebar-link'))
       .find(el => el.textContent.includes('Usterki'));
  
  if (issuesSidebarLink) {
    issuesSidebarLink.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('issuesPage');
    });
  }

  // Bottom nav "Usterki"
  const issuesBottomNavItem = document.querySelector('.bottom-nav-item[data-section="issues"]');
  if (issuesBottomNavItem) {
    issuesBottomNavItem.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('issuesPage');
    });
  }

  // Przycisk "Usterki" w header (jeśli istnieje)
  const issuesHeaderBtn = document.querySelector('[data-action="view-all-issues"]');
  if (issuesHeaderBtn) {
    issuesHeaderBtn.addEventListener('click', () => {
      showSection('issuesPage');
    });
  }
}

function showSection(sectionName) {
  // Ukryj wszystkie sekcje
  document.querySelectorAll('main > section').forEach(section => {
    section.style.display = 'none';
  });

  // Pokaż wybraną sekcję
  const section = document.getElementById(`${sectionName}Section`);
  if (section) {
    section.style.display = 'block';
  }

  // Render jeśli Issues
  if (sectionName === 'issuesPage') {
    renderIssuesPage();
  }

  // Aktualizuj active state w nawigacji
  updateActiveNavigation(sectionName);
}

function updateActiveNavigation(sectionName) {
  // Sidebar
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });
  const activeLink = Array.from(document.querySelectorAll('.sidebar-link'))
    .find(el => {
      if (sectionName === 'issuesPage') return el.textContent.includes('Usterki');
      if (sectionName === 'overview') return el.textContent.includes('Przegląd');
      return false;
    });
  if (activeLink) activeLink.classList.add('active');

  // Bottom nav
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeBottomNav = document.querySelector(
    `.bottom-nav-item[data-section="${sectionName === 'issuesPage' ? 'issues' : 'overview'}"]`
  );
  if (activeBottomNav) activeBottomNav.classList.add('active');
}
```

#### Integracja z istniejącym kodem
```js
// Dodaj do DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
  // ... istniejący kod ...
  
  initIssuesPage();
  initIssuesNavigation();
  
  // ... reszta kodu ...
});

// Jeśli usterka zostanie dodana/edytowana, odśwież Issues Page
function addIssue(issue) {
  // ... istniejący kod dodawania ...
  
  // Odśwież Issues Page jeśli jest widoczna
  if (document.getElementById('issuesPageSection').style.display !== 'none') {
    renderIssuesPage();
  }
}

function updateIssue(issueId, updates) {
  // ... istniejący kod aktualizacji ...
  
  // Odśwież Issues Page jeśli jest widoczna
  if (document.getElementById('issuesPageSection').style.display !== 'none') {
    renderIssuesPage();
  }
}

function deleteIssueFromList(issueId) {
  issues = issues.filter(i => i.id !== issueId);
  saveIssues();
  
  // Odśwież Issues Page jeśli jest widoczna
  if (document.getElementById('issuesPageSection').style.display !== 'none') {
    renderIssuesPage();
  }
}
```

---

### 2.7 HTML — zmiana w linkach nawigacji (jeśli potrzebne)

Link "Usterki" już istnieje w HTML, ale powinien mieć zdolność otwierania Issues Page. Dodajemy do istniejącego linku:

```html
<!-- W sidebar, link "Usterki" -->
<a href="#" class="sidebar-link" data-action="show-issues-page">
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
    <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  <span>Usterki</span>
</a>
```

---

## Sekcja 3: Walidacja i obsługa błędów

- **Brak danych:** Pokazanie empty state gdy żadne usterki nie spełniają kryteria filtrowania
- **Uszkodzone dane:** Jeśli usterka ma brakujące pola (np. `created_at`), wyświetlenie sensownego fallback'a
- **Responsywność:** Na mobile: ukrycie akcji w menu, zwijanie grup po domyślnie otwarciu, skalowanie tekstu
- **Sortowanie stabilne:** Sortowanie po statusie → utrzymanie kolejności alfabetycznej w obrębie statusu
- **Licznik usterek:** Aktualizacja w real-time po zmianie filtrów

---

## Sekcja 4: Powiązanie z istniejącym kodem

| Istniejąca funkcja | Zmiana |
|---|---|
| `openAddIssueModal` | Brak zmian — form pozostaje taki sam |
| `addIssue` | Po dodaniu: odśwież Issues Page (jeśli jest widoczna) |
| `updateIssue` | Po edycji: odśwież Issues Page |
| `deleteIssue` | Po usunięciu: odśwież Issues Page |
| `renderProperties` | Brak zmian — dashboard render nie dotyka Issues Page |
| `renderIssuesList` (dashboard) | Brak zmian — inny rendering na Issues Page |
| `showSection` | NOWA FUNKCJA — przełączanie między widokami (overview vs issuesPage) |

---

## Sekcja 5: Manualny test

**Test 1: Nawigacja**
- [ ] Klik "Usterki" w sidebar → Issues Page się otwiera
- [ ] Klik "Usterki" w bottom-nav → Issues Page się otwiera
- [ ] Klik "Przegląd" → wraca do dashboard

**Test 2: Rendering listy**
- [ ] Wszystkie usterki są widoczne, pogrupowane po nieruchomościach
- [ ] Każda usterka pokazuje: tytuł, lokalizację, datę, status, ikonę zdjęcia (jeśli są)
- [ ] Licznik usterek jest poprawny

**Test 3: Sortowanie**
- [ ] Zmiana sortu na "Alfabetycznie (A–Z)" → lista się przesortu­je
- [ ] Zmiana sortu na "Daty (najnowsze)" → lista się przesortu­je
- [ ] Zmiana sortu na "Statusu" → krytyczne na górze, rozwiązane na dole

**Test 4: Filtrowanie**
- [ ] Odznaczenie "Zgłoszone" → tylko usterki w trakcie i rozwiązane
- [ ] Odznaczenie "W trakcie" → tylko zgłoszone i rozwiązane
- [ ] Odznaczenie wszystkich → empty state
- [ ] Licznik aktualizuje się poprawnie

**Test 5: Złożenie grupy**
- [ ] Klik strzałki przy nieruchomości → usterki grupy znikają
- [ ] Strzałka się obraca (-90 deg)
- [ ] Klik ponownie → grupa się rozwinięcie

**Test 6: Akcje**
- [ ] Klik "Edytuj" → otwiera się form edycji z danymi usterki
- [ ] Klik "Usuń" → potwierdzenie → usterka znika
- [ ] Klik "Mapa" → otwiera się mapa (jeśli nieruchomość ma plan)
- [ ] Klik zdjęcie → otwiera się galeria zdjęć

**Test 7: Integracja**
- [ ] Dodanie nowej usterki z dashboard → Issues Page odśwież się
- [ ] Edycja usterki z Issues Page → dashboard się odśwież
- [ ] Usunięcie usterki z Issues Page → wszystkie widoki się odśwież

**Test 8: Mobile**
- [ ] Bottom nav „Usterki" działa
- [ ] Kontrolki sortowania i filtrowania zmieszczają się na ekranie
- [ ] Akcje pinezki są widoczne lub ukryte pod menu
- [ ] Złożenie grupy działa na touch

---

## Pliki do edycji

| Plik | Rodzaj zmiany |
|---|---|
| `examples/dashboard.html` | Nowa sekcja `#issuesPageSection` z HTML'em na Issues Page |
| `examples/dashboard.js` | Nowe funkcje: `initIssuesPage()`, `renderIssuesPage()`, `sortIssues()`, `groupIssuesByProperty()`, `createIssueGroupElement()`, `createIssueItemElement()`, `toggleIssueGroup()`, `initIssuesNavigation()`, `showSection()`, `updateActiveNavigation()` |
| `examples/dashboard.css` | Nowe style dla Issues Page: `.issues-page-section`, `.issues-page-controls`, `.issues-list-grouped`, `.issues-group`, `.issue-item` i wszystkie warianty |

---

## Format raportu po wdrożeniu

- **Co wdrożono:** Dedykowana podstrona "Usterki" z listą wszystkich usterek pogrupowanych po nieruchomościach, sortowaniem (alfabetycznie, data, status), filtrowaniem po statusie (3 checkboxy), możliwością złożenia grup, akcjami (edycja, usunięcie, mapa).
- **Wpływ na użytkownika:** Szybkie przeglądanie wszystkich usterek bez potrzeby otwierania każdej nieruchomości; łatwe sortowanie i filtrowanie; złożanie grup zmniejsza szum wizualny.
- **Co odłożono świadomie:**
  - Wyszukiwanie fulltextowe (nie MVP, filtry statyczne wystarczają)
  - Export listy (drugi pass)
  - Bulk actions (zaznaczanie wielu i masowe update statusu)
  - Drag-and-drop do reorganizacji
  - Przypinanie "ulubionych" usterek
