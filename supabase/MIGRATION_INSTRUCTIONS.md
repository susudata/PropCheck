# Instrukcja wykonania migracji SQL

## Krok 1: Otwórz Supabase SQL Editor

1. Przejdź do: https://supabase.com/dashboard/project/dckbtothmifvykdsudbt/sql/new
2. Kliknij "New query"

## Krok 2: Skopiuj SQL migration script

1. Otwórz plik: `supabase/migrations/001_create_properties_table.sql`
2. Zaznacz **cały plik** (Ctrl+A)
3. Skopiuj (Ctrl+C)

## Krok 3: Wklej i wykonaj migrację

1. Wklej SQL do Supabase SQL Editor (Ctrl+V)
2. Kliknij przycisk **"Run"** (lub Ctrl+Enter)
3. Poczekaj na wykonanie (~2-3 sekundy)

## Krok 4: Sprawdź czy migracja się powiodła

**Expected output:**
```
Success. No rows returned
```

**Jeśli widzisz błąd:**
- "relation already exists" → Tabela już istnieje (OK, skip migration)
- "permission denied" → Sprawdź czy jesteś zalogowany jako owner projektu
- Inne błędy → Skopiuj treść błędu i zgłoś

## Krok 5: Weryfikacja tabeli

1. Przejdź do: https://supabase.com/dashboard/project/dckbtothmifvykdsudbt/editor
2. W lewej kolumnie znajdź tabelę **"properties"**
3. Kliknij na nią

**Expected:**
- Widzisz kolumny: `id`, `user_id`, `name`, `address`, `floorplan_url`, `issues_critical`, `issues_in_progress`, `issues_resolved`, `created_at`, `updated_at`
- Tabela jest pusta (0 rows)
- RLS badge pokazuje: "Row Level Security Enabled"

## Krok 6: Test RLS policies

1. W Table Editor, kliknij **"Insert row"**
2. Wypełnij:
   - `user_id`: (zostaw auto-filled - to Twój auth.uid())
   - `name`: "Test Property"
   - `address`: "ul. Testowa 1"
   - (resztę pól zostaw default)
3. Kliknij **"Save"**

**Expected:**
- Row został dodany
- Widzisz go w tabeli
- `id` jest auto-generated (np. 1, 2, 3...)
- `created_at` i `updated_at` są wypełnione automatycznie

## Krok 7: Test RLS isolation (opcjonalnie)

**Jeśli masz drugie konto testowe:**
1. Wyloguj się z Supabase Dashboard
2. Zaloguj się drugim kontem
3. Otwórz Table Editor → properties
4. **Expected:** Nie widzisz properties stworzonego przez pierwsze konto (RLS działa!)

## ✅ Success Criteria

Po wykonaniu migracji powinieneś mieć:
- [x] Tabela `properties` istnieje w Supabase
- [x] RLS włączony (badge "Row Level Security Enabled")
- [x] Możesz dodać property przez Table Editor
- [x] Auto-generated `id`, `created_at`, `updated_at` działają
- [x] Nie widzisz properties innych użytkowników (RLS policies działają)

## 🐛 Troubleshooting

**Problem:** "relation already exists"
- **Solution:** Tabela już istnieje. Skip migration lub usuń tabelę (DROP TABLE properties CASCADE) i uruchom ponownie.

**Problem:** "permission denied for schema public"
- **Solution:** Sprawdź czy jesteś zalogowany jako owner projektu (nie jako read-only collaborator).

**Problem:** "column user_id does not exist"
- **Solution:** Upewnij się, że cały migration script został skopiowany (włącznie z sekcją CREATE TABLE).

**Problem:** RLS policies nie działają (widzisz wszystkie properties)
- **Solution:** Sprawdź czy RLS jest włączony:
  ```sql
  ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
  ```

## 📞 Next Steps

Po pomyślnej migracji:
1. Mark todo 2.3 jako completed
2. Mark todo 2.4 jako completed (RLS już jest w migration)
3. Przejdź do **Plan 2B.2: Sync Properties CRUD** (refaktoring JavaScript)
