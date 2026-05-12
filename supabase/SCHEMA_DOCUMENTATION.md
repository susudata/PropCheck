# PropCheck Database Schema - Phase 2B.1

**Version:** 1.0.0  
**Date:** 2026-05-12  
**Migration:** 001_create_properties_table.sql

---

## 📊 Database Overview

**Provider:** Supabase PostgreSQL  
**Database:** `dckbtothmifvykdsudbt`  
**Schema:** `public`

---

## 📋 Table: `properties`

### Description
Stores properties/buildings managed by users. Each property can have multiple issues (to be implemented in Phase 2B.3).

### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `BIGSERIAL` | NO | AUTO | Primary key (auto-generated) |
| `user_id` | `UUID` | NO | - | Foreign key to `auth.users(id)` (property owner) |
| `name` | `TEXT` | NO | - | Property name (e.g., "Apartament Wiśniowa 12/3") |
| `address` | `TEXT` | NO | - | Full address (e.g., "ul. Wiśniowa 12/3, Warszawa") |
| `floorplan_url` | `TEXT` | YES | NULL | URL to floorplan image in Supabase Storage or base64 data URI |
| `issues_critical` | `INTEGER` | NO | 0 | Count of critical issues (denormalized for performance) |
| `issues_in_progress` | `INTEGER` | NO | 0 | Count of in-progress issues (denormalized) |
| `issues_resolved` | `INTEGER` | NO | 0 | Count of resolved issues (denormalized) |
| `created_at` | `TIMESTAMPTZ` | NO | NOW() | Timestamp when property was created |
| `updated_at` | `TIMESTAMPTZ` | NO | NOW() | Timestamp of last update (auto-updated by trigger) |

### Constraints

- **Primary Key:** `id`
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE
- **Unique:** None (users can have multiple properties with same name)
- **Check:** None

### Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `properties_pkey` | `id` | PRIMARY KEY | Fast lookups by ID |
| `idx_properties_user_id` | `user_id` | BTREE | Fast filtering by user (most common query) |
| `idx_properties_created_at` | `created_at DESC` | BTREE | Fast sorting by creation date |

### Triggers

| Trigger Name | Event | Function | Description |
|--------------|-------|----------|-------------|
| `update_properties_updated_at` | BEFORE UPDATE | `update_updated_at_column()` | Auto-updates `updated_at` on every UPDATE |

---

## 🔒 Row Level Security (RLS)

**Status:** ✅ ENABLED

### Policies

| Policy Name | Operation | Rule | Description |
|-------------|-----------|------|-------------|
| `Users can view their own properties` | SELECT | `auth.uid() = user_id` | Users can only SELECT properties they own |
| `Users can create their own properties` | INSERT | `auth.uid() = user_id` | Users can only INSERT properties with their own `user_id` |
| `Users can update their own properties` | UPDATE | `auth.uid() = user_id` | Users can only UPDATE properties they own |
| `Users can delete their own properties` | DELETE | `auth.uid() = user_id` | Users can only DELETE properties they own |

### Security Notes

- **No public access:** `PUBLIC` role has NO permissions on this table
- **Authenticated users only:** `authenticated` role has SELECT, INSERT, UPDATE, DELETE (filtered by RLS)
- **Cascade deletion:** If user is deleted from `auth.users`, all their properties are automatically deleted

---

## 📐 Data Model

### Entity Relationship

```
auth.users (Supabase Auth)
    ↓ (1:N)
properties
    ↓ (1:N - Phase 2B.3)
issues
    ↓ (1:N - Phase 2B.4)
photos
```

### Example Data

```json
{
  "id": 1,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Apartament Wiśniowa 12/3",
  "address": "ul. Wiśniowa 12/3, Warszawa",
  "floorplan_url": "https://dckbtothmifvykdsudbt.supabase.co/storage/v1/object/public/floorplans/abc123.jpg",
  "issues_critical": 2,
  "issues_in_progress": 5,
  "issues_resolved": 3,
  "created_at": "2026-05-12T01:00:00.000Z",
  "updated_at": "2026-05-12T01:00:00.000Z"
}
```

---

## 🔄 Migration from localStorage

### localStorage Structure (OLD)
```javascript
{
  id: 1715789012345,  // Date.now()
  name: "Apartament Wiśniowa 12/3",
  address: "ul. Wiśniowa 12/3, Warszawa",
  floorplanPhoto: "data:image/jpeg;base64,...",  // base64 string
  issues: { 
    critical: 2, 
    inProgress: 5, 
    resolved: 3 
  }
}
```

### Supabase Structure (NEW)
```sql
INSERT INTO properties (
  user_id, 
  name, 
  address, 
  floorplan_url,  -- base64 temporarily, URL after Phase 2B.4
  issues_critical,
  issues_in_progress,
  issues_resolved
) VALUES (
  auth.uid(),
  'Apartament Wiśniowa 12/3',
  'ul. Wiśniowa 12/3, Warszawa',
  'data:image/jpeg;base64,...',  -- temporary
  2,
  5,
  3
);
```

### Field Mapping

| localStorage | Supabase | Transformation |
|--------------|----------|----------------|
| `id` | `id` | Drop (auto-generated BIGSERIAL) |
| `name` | `name` | Direct copy |
| `address` | `address` | Direct copy |
| `floorplanPhoto` | `floorplan_url` | Direct copy (base64) → Upload to Storage in Phase 2B.4 |
| `issues.critical` | `issues_critical` | Rename |
| `issues.inProgress` | `issues_in_progress` | Rename (camelCase → snake_case) |
| `issues.resolved` | `issues_resolved` | Rename |
| - | `user_id` | Add (from `auth.uid()`) |
| - | `created_at` | Add (NOW()) |
| - | `updated_at` | Add (NOW()) |

---

## 🧪 SQL Query Examples

### Insert a property (authenticated user)
```sql
INSERT INTO properties (user_id, name, address, floorplan_url)
VALUES (
  auth.uid(),
  'Test Property',
  'ul. Testowa 1, Warszawa',
  NULL
)
RETURNING *;
```

### Select user's properties
```sql
SELECT * FROM properties
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### Update property
```sql
UPDATE properties
SET name = 'Updated Property Name',
    address = 'ul. Nowa 2, Kraków'
WHERE id = 1
  AND user_id = auth.uid();
```

### Delete property
```sql
DELETE FROM properties
WHERE id = 1
  AND user_id = auth.uid();
```

### Count properties by status
```sql
SELECT 
  COUNT(*) AS total_properties,
  SUM(issues_critical) AS total_critical,
  SUM(issues_in_progress) AS total_in_progress,
  SUM(issues_resolved) AS total_resolved
FROM properties
WHERE user_id = auth.uid();
```

---

## 📊 Performance Considerations

### Indexing Strategy
- **user_id index:** Most queries filter by `user_id` (RLS enforcement)
- **created_at index:** Sorting by creation date is common (DESC for newest first)
- **No index on counters:** `issues_*` columns are rarely used in WHERE clauses

### Denormalization
Issue counters (`issues_critical`, `issues_in_progress`, `issues_resolved`) are denormalized for performance:
- **Pro:** Fast dashboard stats (no JOIN with `issues` table)
- **Con:** Must be updated when issue status changes (Phase 2B.3 will add triggers)

### Storage
- **floorplan_url:** Currently stores base64 data URI (~500KB-1MB per property)
- **Migration plan:** Phase 2B.4 will move to Supabase Storage (~50KB per JPEG)
- **Impact:** Database row size will shrink 10x after migration

---

## 🔮 Future Enhancements (Phase 2B.3+)

### Phase 2B.3: Issues Table
```sql
CREATE TABLE issues (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('critical', 'inProgress', 'resolved')),
  pin_position JSONB,  -- {x: float, y: float}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Phase 2B.4: Photos Table
```sql
CREATE TABLE photos (
  id BIGSERIAL PRIMARY KEY,
  issue_id BIGINT REFERENCES issues(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,  -- path in Supabase Storage bucket
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Phase 2B.5: Real-time Sync
- Enable Supabase Realtime on `properties` table
- Subscribe to changes in frontend (INSERT, UPDATE, DELETE)
- Auto-refresh UI when data changes

---

## 📝 Changelog

### Version 1.0.0 (2026-05-12)
- Initial schema design
- Created `properties` table
- Added RLS policies (SELECT, INSERT, UPDATE, DELETE)
- Added indexes (user_id, created_at)
- Added `updated_at` auto-update trigger
- Migration: `001_create_properties_table.sql`

---

## 🔗 Related Documents

- **Migration Script:** `supabase/migrations/001_create_properties_table.sql`
- **Migration Instructions:** `supabase/MIGRATION_INSTRUCTIONS.md`
- **Implementation Plan:** `docs/PLAN_2B1_SCHEMA_DESIGN.md` (to be created)
- **Next Phase:** Plan 2B.2 - Sync Properties CRUD

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-05-12 01:05
