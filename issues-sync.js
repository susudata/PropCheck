/**
 * Issues Sync Module
 * Supabase integration for issues CRUD operations
 * Phase 2B.3: Sync Issues
 */

// ── Offline-first cache ─────────────────────────────────────────────────────
let issuesCache = [];
let isSyncEnabled = true;

// ── Initialize sync on page load ────────────────────────────────────────────
async function initIssuesSync() {
    if (!navigator.onLine) {
        isSyncEnabled = false;
        const cached = loadIssuesFromCache();
        if (window.issues !== undefined) {
            window.issues = cached;
        }
        return;
    }
    
    const user = await getCurrentUser();
    if (user) {
        // Sync offline issues to Supabase first
        await syncOfflineIssuesToSupabase();
        
        // Fetch from Supabase
        const supabaseData = await fetchIssuesFromSupabase();
        if (window.issues !== undefined) {
            window.issues = supabaseData;
        }
    }
}

// ── Cache Management ────────────────────────────────────────────────────────

function saveIssuesToCache(issuesList) {
    localStorage.setItem('propcheck_issues_cache', JSON.stringify(issuesList));
    issuesCache = issuesList;
    window.issuesCache = issuesCache;
}

function loadIssuesFromCache() {
    const cached = localStorage.getItem('propcheck_issues_cache');
    if (cached) {
        try {
            issuesCache = JSON.parse(cached);
            window.issuesCache = issuesCache;
            return issuesCache;
        } catch (e) {
            console.warn('Failed to parse cached issues:', e);
            return [];
        }
    }
    return [];
}

// ── Fetch issues from Supabase ──────────────────────────────────────────────

async function fetchIssuesFromSupabase() {
    try {
        if (!isSyncEnabled) return [];
        
        const { data, error } = await supabaseClient
            .from('issues')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching issues from Supabase:', error);
            return [];
        }
        
        // Transform Supabase data to frontend format
        const transformed = data.map(issue => ({
            id: issue.id,
            propertyId: issue.property_id,
            name: issue.name,
            location: issue.location,
            description: issue.description,
            status: issue.status,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            photos: issue.photos || [],
            pinPosition: issue.pin_position
        }));
        
        // Only update cache if Supabase has data
        if (transformed.length > 0) {
            saveIssuesToCache(transformed);
        }
        
        return transformed;
    } catch (err) {
        console.error('Unexpected error fetching issues:', err);
        return [];
    }
}

// ── Add issue (INSERT) ──────────────────────────────────────────────────────

async function addIssueToSupabase(propertyId, name, location, description, status, photos, pinPosition) {
    try {
        if (!isSyncEnabled) {
            throw new Error('Sync is disabled (offline mode)');
        }
        
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('Not authenticated');
        }
        
        const { data, error } = await supabaseClient
            .from('issues')
            .insert([
                {
                    user_id: user.id,
                    property_id: propertyId,
                    name: name,
                    location: location,
                    description: description,
                    status: status,
                    pin_position: pinPosition || null
                }
            ])
            .select()
            .single();
        
        if (error) {
            console.error('Error adding issue to Supabase:', error);
            throw new Error(error.message);
        }
        
        // Transform and return
        const transformed = {
            id: data.id,
            propertyId: data.property_id,
            name: data.name,
            location: data.location,
            description: data.description,
            status: data.status,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            photos: photos || [],
            pinPosition: data.pin_position
        };
        
        issuesCache.push(transformed);
        saveIssuesToCache(issuesCache);
        
        return { success: true, data: transformed };
    } catch (err) {
        console.error('Error in addIssueToSupabase:', err);
        return { success: false, error: err.message };
    }
}

// ── Delete issue (DELETE) ───────────────────────────────────────────────────

async function deleteIssueFromSupabase(issueId) {
    try {
        if (!isSyncEnabled) {
            throw new Error('Sync is disabled (offline mode)');
        }
        
        const { error } = await supabaseClient
            .from('issues')
            .delete()
            .eq('id', issueId);
        
        if (error) {
            console.error('Error deleting issue from Supabase:', error);
            throw new Error(error.message);
        }
        
        issuesCache = issuesCache.filter(i => i.id !== issueId);
        saveIssuesToCache(issuesCache);
        
        return { success: true };
    } catch (err) {
        console.error('Error in deleteIssueFromSupabase:', err);
        return { success: false, error: err.message };
    }
}

// ── Update issue status (UPDATE) ────────────────────────────────────────────

async function updateIssueStatusInSupabase(issueId, newStatus) {
    try {
        if (!isSyncEnabled) {
            throw new Error('Sync is disabled (offline mode)');
        }
        
        const { data, error } = await supabaseClient
            .from('issues')
            .update({ status: newStatus })
            .eq('id', issueId)
            .select()
            .single();
        
        if (error) {
            console.error('Error updating issue status in Supabase:', error);
            throw new Error(error.message);
        }
        
        // Update cache
        const index = issuesCache.findIndex(i => i.id === issueId);
        if (index !== -1) {
            issuesCache[index].status = newStatus;
            issuesCache[index].updatedAt = data.updated_at;
            saveIssuesToCache(issuesCache);
        }
        
        return { success: true };
    } catch (err) {
        console.error('Error in updateIssueStatusInSupabase:', err);
        return { success: false, error: err.message };
    }
}

// ── Update issue (full UPDATE) ──────────────────────────────────────────────

async function updateIssueInSupabase(issueId, name, location, description, status, pinPosition) {
    try {
        if (!isSyncEnabled) {
            throw new Error('Sync is disabled (offline mode)');
        }
        
        const { data, error } = await supabaseClient
            .from('issues')
            .update({
                name: name,
                location: location,
                description: description,
                status: status,
                pin_position: pinPosition || null
            })
            .eq('id', issueId)
            .select()
            .single();
        
        if (error) {
            console.error('Error updating issue in Supabase:', error);
            throw new Error(error.message);
        }
        
        // Update cache
        const index = issuesCache.findIndex(i => i.id === issueId);
        if (index !== -1) {
            issuesCache[index] = {
                id: data.id,
                propertyId: data.property_id,
                name: data.name,
                location: data.location,
                description: data.description,
                status: data.status,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                photos: issuesCache[index].photos,
                pinPosition: data.pin_position
            };
            saveIssuesToCache(issuesCache);
        }
        
        return { success: true };
    } catch (err) {
        console.error('Error in updateIssueInSupabase:', err);
        return { success: false, error: err.message };
    }
}

// ── Sync offline issues to Supabase ─────────────────────────────────────────

async function syncOfflineIssuesToSupabase() {
    try {
        if (!isSyncEnabled) return { synced: 0 };
        
        const user = await getCurrentUser();
        if (!user) return { synced: 0 };
        
        const localCache = loadIssuesFromCache();
        if (localCache.length === 0) return { synced: 0 };
        
        // Get issues from Supabase
        const { data: serverData, error: fetchError } = await supabaseClient
            .from('issues')
            .select('id, name, location')
            .eq('user_id', user.id);
        
        if (fetchError) {
            console.error('Error fetching Supabase issues for sync:', fetchError);
            return { synced: 0 };
        }
        
        const serverMap = new Map();
        serverData.forEach(i => {
            const key = `${i.name}|||${i.location}`;
            serverMap.set(key, i);
        });
        
        let syncedCount = 0;
        
        for (const localIssue of localCache) {
            const key = `${localIssue.name}|||${localIssue.location}`;
            
            if (!serverMap.has(key)) {
                try {
                    const { error } = await supabaseClient
                        .from('issues')
                        .insert([
                            {
                                user_id: user.id,
                                property_id: localIssue.propertyId,
                                name: localIssue.name,
                                location: localIssue.location,
                                description: localIssue.description,
                                status: localIssue.status,
                                pin_position: localIssue.pinPosition || null
                            }
                        ]);
                    
                    if (!error) {
                        syncedCount++;
                    }
                } catch (err) {
                    console.warn('Error syncing issue:', localIssue.name, err);
                }
            }
        }
        
        if (syncedCount > 0) {
            await fetchIssuesFromSupabase();
        }
        
        return { synced: syncedCount };
    } catch (err) {
        console.error('Error in syncOfflineIssuesToSupabase:', err);
        return { synced: 0 };
    }
}

// ── Network status monitoring ───────────────────────────────────────────────

window.addEventListener('online', async () => {
    console.log('Network is back online - enabling issues sync');
    isSyncEnabled = true;
    
    await syncOfflineIssuesToSupabase();
    
    const supabaseData = await fetchIssuesFromSupabase();
    if (supabaseData.length > 0) {
        if (window.issues !== undefined) {
            window.issues = supabaseData;
        }
    }
});

window.addEventListener('offline', () => {
    console.log('Network is offline - disabling issues sync, using cache');
    isSyncEnabled = false;
});

// ── Expose functions to global scope (after declarations) ──────────────────
window.issuesCache = issuesCache;
window.saveIssuesToCache = saveIssuesToCache;
window.loadIssuesFromCache = loadIssuesFromCache;
window.syncOfflineIssuesToSupabase = syncOfflineIssuesToSupabase;
