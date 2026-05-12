# Diagnostyka problemu z mieszkaniami

## Jak używać

Otwórz DevTools (F12) i w konsoli uruchom:

```javascript
// Sprawdź diagnostykę timingów
console.log('=== TIMING DIAGNOSTICS ===');
console.log('Sync start:', window._diagnostics.propertiesSyncStart);
console.log('Sync end:', window._diagnostics.propertiesSyncEnd);
console.log('Load start:', window._diagnostics.propertiesLoadStart);
console.log('Load end:', window._diagnostics.propertiesLoadEnd);
console.log('Render start:', window._diagnostics.propertiesRenderStart);
console.log('Render end:', window._diagnostics.propertiesRenderEnd);

// Sprawdź obecne dane
console.log('=== CURRENT DATA ===');
console.log('window.properties:', window.properties ? window.properties.length : 'undefined');
console.log('window.propertiesCache:', window.propertiesCache ? window.propertiesCache.length : 'undefined');
console.log('localStorage propcheck_properties_cache:', localStorage.getItem('propcheck_properties_cache') ? 'exists' : 'missing');

// Spróbuj ręcznie załadować
console.log('=== MANUAL RELOAD ===');
loadProperties().then(() => console.log('loadProperties completed'));

// Sprawdź HTML
console.log('=== DOM CHECK ===');
console.log('Grid element:', document.getElementById('propertiesGrid') ? 'found' : 'missing');
console.log('Empty state:', document.getElementById('emptyPropertiesState') ? 'found' : 'missing');
console.log('Property cards:', document.querySelectorAll('.property-card').length);
```

## Co szukać

1. **Czy `window.properties` jest undefined po sync?** → Problem w `initPropertiesSync`
2. **Czy cache ma dane ale `window.properties` nie?** → Race condition
3. **Czy dane są ale nie renderują?** → Problem w `renderProperties`
4. **Jaki jest czas między sync a load?** → Sprawdź czy się nie nakładają

## Konsola powinna pokazać:

```
[DOMContentLoaded] Starting initialization...
[DOMContentLoaded] Calling initPropertiesSync...
[initPropertiesSync] Starting...
[DIAG] window.properties before: undefined
...
[DIAG] Sync complete, setting window._propertiesSyncComplete = true
[DOMContentLoaded] initPropertiesSync completed
[DIAG] After initPropertiesSync:
[DIAG]   window.properties: <liczba>
[renderProperties] Starting... properties.length = <liczba>
```

Jeśli widzisz `properties.length = 0` mimo że `window.properties > 0`, to jest problem z kopowaniem danych.
