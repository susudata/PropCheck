/**
 * Issues Sync Module
 * Supabase integration for issues CRUD operations
 */

// ── Offline-first cache ─────────────────────────────────────────────────────
let issuesCache = [];
// Note: isSyncEnabled is shared with properties-sync.js (do not redeclare)
// Ensure window.isSyncEnabled exists (will be set by properties-sync.js)
if (typeof window.isSyncEnabled === 'undefined') {
    window.isSyncEnabled = true;
}

// ── Initialize sync on page load ────────────────────────────────────────────
async function initIssuesSync() {
    if (!navigator.onLine) {
        window.isSyncEnabled = false;
        const cached = loadIssuesFromCache();
        window.issues = cached;
        return;
    }
    
    const user = await getCurrentUser();
    if (user) {
        await syncOfflineIssuesToSupabase();
        const supabaseData = await fetchIssuesFromSupabase();
        window.issues = supabaseData;
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
        if (!window.isSyncEnabled) {
            console.log('[fetchIssuesFromSupabase] Sync disabled, returning []');
            return [];
        }
        
        const user = await getCurrentUser();
        if (!user) {
            console.log('[fetchIssuesFromSupabase] No user, cannot fetch issues');
            return [];
        }
        
        console.log('[fetchIssuesFromSupabase] Fetching for user:', user.id);
        
        const { data, error } = await supabaseClient
            .from('issues')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('[fetchIssuesFromSupabase] Error fetching issues:', error);
            return [];
        }
        
        console.log('[fetchIssuesFromSupabase] Supabase returned', data.length, 'issues');
        
        const transformed = data.map(issue => ({
            id: issue.id,
            propertyId: issue.property_id,
            name: issue.name,
            location: issue.location,
            description: issue.description,
            status: issue.status,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            photos: Array.isArray(issue.photos) ? issue.photos : [],
            pinPosition: issue.pin_position
        }));
        
        console.log('[fetchIssuesFromSupabase] Transformed to', transformed.length, 'issues');
        
        if (transformed.length > 0) {
            saveIssuesToCache(transformed);
        }
        
        return transformed;
    } catch (err) {
        console.error('[fetchIssuesFromSupabase] Unexpected error:', err);
        return [];
    }
}

// ── Add issue (INSERT) ──────────────────────────────────────────────────────
async function addIssueToSupabase(propertyId, name, location, description, status, photos, pinPosition) {
    try {
        if (!window.isSyncEnabled) {
            throw new Error('Sync is disabled (offline mode)');
        }
        
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('Not authenticated');
        }
        
        console.log('[addIssueToSupabase] Adding issue with', photos ? photos.length : 0, 'photos');
        
        // Convert base64 photos to proper JSONB array format for Supabase
        let photosData = [];
        if (photos && Array.isArray(photos) && photos.length > 0) {
            photosData = photos.map((photoBase64, index) => ({
                id: `photo_${Date.now()}_${index}`,
                data: photoBase64,
                uploadedAt: new Date().toISOString()
            }));
            console.log('[addIssueToSupabase] Formatted', photosData.length, 'photos for storage');
        }
        
        const { data, error } = await supabaseClient
            .from('issues')
            .insert([{
                user_id: user.id,
                property_id: propertyId,
                name: name,
                location: location,
                description: description,
                status: status,
                pin_position: pinPosition || null,
                photos: photosData
            }])
            .select()
            .single();
        
        if (error) {
            console.error('Error adding issue to Supabase:', error);
            throw new Error(error.message);
        }
        
        console.log('[addIssueToSupabase] Issue created with ID:', data.id);
        
        const transformed = {
            id: data.id,
            propertyId: data.property_id,
            name: data.name,
            location: data.location,
            description: data.description,
            status: data.status,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            photos: photosData,
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
        if (!window.isSyncEnabled) {
            throw new Error('Sync is disabled (offline mode)');
        }
        
        console.log('[deleteIssueFromSupabase] Deleting issue:', issueId);
        
        const { error } = await supabaseClient
            .from('issues')
            .delete()
            .eq('id', issueId);
        
        if (error) {
            console.error('Error deleting issue from Supabase:', error);
            throw new Error(error.message);
        }
        
        console.log('[deleteIssueFromSupabase] Issue deleted successfully');
        
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
        if (!window.isSyncEnabled) {
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
async function updateIssueInSupabase(issueId, name, location, description, status, pinPosition, photos = null) {
    try {
        if (!window.isSyncEnabled) {
            throw new Error('Sync is disabled (offline mode)');
        }
        
        console.log('[updateIssueInSupabase] Updating issue:', issueId);
        
        // Build update object
        const updateData = {
            name: name,
            location: location,
            description: description,
            status: status,
            pin_position: pinPosition || null
        };
        
        // If photos are provided, include them in update
        if (photos !== null && Array.isArray(photos)) {
            const photosData = photos.map((photoBase64, index) => {
                // Check if already an object (from fetch) or base64 string (new upload)
                if (typeof photoBase64 === 'string' && photoBase64.startsWith('data:image')) {
                    return {
                        id: `photo_${Date.now()}_${index}`,
                        data: photoBase64,
                        uploadedAt: new Date().toISOString()
                    };
                }
                return photoBase64;
            });
            updateData.photos = photosData;
            console.log('[updateIssueInSupabase] Including', photosData.length, 'photos in update');
        }
        
        const { data, error } = await supabaseClient
            .from('issues')
            .update(updateData)
            .eq('id', issueId)
            .select()
            .single();
        
        if (error) {
            console.error('Error updating issue in Supabase:', error);
            throw new Error(error.message);
        }
        
        console.log('[updateIssueInSupabase] Issue updated successfully');
        
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
                photos: data.photos || issuesCache[index].photos,
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
        if (!window.isSyncEnabled) {
            console.log('[syncOfflineIssuesToSupabase] Sync disabled, skipping');
            return { synced: 0 };
        }
        
        const user = await getCurrentUser();
        if (!user) {
            console.log('[syncOfflineIssuesToSupabase] No user, skipping sync');
            return { synced: 0 };
        }
        
        const localCache = loadIssuesFromCache();
        console.log('[syncOfflineIssuesToSupabase] Local cache has', localCache.length, 'issues');
        
        if (localCache.length === 0) {
            console.log('[syncOfflineIssuesToSupabase] No local issues to sync');
            return { synced: 0 };
        }
        
        // Get user's current properties to validate property_id ownership
        const { data: userProperties, error: propsError } = await supabaseClient
            .from('properties')
            .select('id')
            .eq('user_id', user.id);
        
        if (propsError) {
            console.error('[syncOfflineIssuesToSupabase] Error fetching user properties:', propsError);
            return { synced: 0 };
        }
        
        const validPropertyIds = new Set(userProperties.map(p => p.id));
        console.log('[syncOfflineIssuesToSupabase] User owns', validPropertyIds.size, 'properties');
        
        const { data: serverData, error: fetchError } = await supabaseClient
            .from('issues')
            .select('id, name, location')
            .eq('user_id', user.id);
        
        if (fetchError) {
            console.error('[syncOfflineIssuesToSupabase] Error fetching Supabase issues:', fetchError);
            return { synced: 0 };
        }
        
        console.log('[syncOfflineIssuesToSupabase] Server has', serverData.length, 'issues');
        
        const serverMap = new Map();
        serverData.forEach(i => {
            const key = `${i.name}|||${i.location}`;
            serverMap.set(key, i);
        });
        
        let syncedCount = 0;
        let skippedCount = 0;
        
        for (const localIssue of localCache) {
            const key = `${localIssue.name}|||${localIssue.location}`;
            
            // Skip if issue already exists on server
            if (serverMap.has(key)) {
                console.log('[syncOfflineIssuesToSupabase] Issue already exists on server:', localIssue.name);
                continue;
            }
            
            // CRITICAL: Validate that propertyId is owned by user (RLS requirement)
            if (!validPropertyIds.has(localIssue.propertyId)) {
                console.warn('[syncOfflineIssuesToSupabase] Skipping issue - property not owned by user:', 
                    localIssue.name, 'property_id:', localIssue.propertyId);
                skippedCount++;
                continue;
            }
            
            try {
                // Format photos if they exist
                let photosData = [];
                if (localIssue.photos && Array.isArray(localIssue.photos)) {
                    photosData = localIssue.photos.map((photo, index) => {
                        if (typeof photo === 'string' && photo.startsWith('data:image')) {
                            return {
                                id: `photo_${Date.now()}_${index}`,
                                data: photo,
                                uploadedAt: new Date().toISOString()
                            };
                        }
                        return photo;
                    });
                }
                
                console.log('[syncOfflineIssuesToSupabase] Syncing offline issue:', localIssue.name, 'with', photosData.length, 'photos');
                
                const { error } = await supabaseClient
                    .from('issues')
                    .insert([{
                        user_id: user.id,
                        property_id: localIssue.propertyId,
                        name: localIssue.name,
                        location: localIssue.location,
                        description: localIssue.description,
                        status: localIssue.status,
                        pin_position: localIssue.pinPosition || null,
                        photos: photosData
                    }]);
                
                if (!error) {
                    syncedCount++;
                    console.log('[syncOfflineIssuesToSupabase] Successfully synced:', localIssue.name);
                } else {
                    console.warn('[syncOfflineIssuesToSupabase] Error syncing issue:', localIssue.name, error.message);
                }
            } catch (err) {
                console.warn('[syncOfflineIssuesToSupabase] Exception syncing issue:', localIssue.name, err);
            }
        }
        
        console.log('[syncOfflineIssuesToSupabase] Synced', syncedCount, 'offline issues, skipped', skippedCount, 'invalid ones');
        
        // Remove skipped issues from cache (they're orphaned - property was deleted)
        if (skippedCount > 0) {
            const cleanedCache = localCache.filter(issue => validPropertyIds.has(issue.propertyId));
            console.log('[syncOfflineIssuesToSupabase] Cleaning cache: removed', skippedCount, 'orphaned issues');
            saveIssuesToCache(cleanedCache);
        }
        
        if (syncedCount > 0) {
            console.log('[syncOfflineIssuesToSupabase] Refreshing from Supabase after sync');
            await fetchIssuesFromSupabase();
        }
        
        return { synced: syncedCount };
    } catch (err) {
        console.error('[syncOfflineIssuesToSupabase] Error in syncOfflineIssuesToSupabase:', err);
        return { synced: 0 };
    }
}

// ── Network status monitoring ───────────────────────────────────────────────
window.addEventListener('online', async () => {
    console.log('Network is back online - enabling issues sync');
    window.isSyncEnabled = true;
    
    await syncOfflineIssuesToSupabase();
    
    const supabaseData = await fetchIssuesFromSupabase();
    if (supabaseData.length > 0) {
        window.issues = supabaseData;
    }
});

window.addEventListener('offline', () => {
    console.log('Network is offline - disabling issues sync, using cache');
    window.isSyncEnabled = false;
});

// ── Expose functions to global scope ────────────────────────────────────────
window.issuesCache = issuesCache;
window.saveIssuesToCache = saveIssuesToCache;
window.loadIssuesFromCache = loadIssuesFromCache;
window.syncOfflineIssuesToSupabase = syncOfflineIssuesToSupabase;
window.deleteIssueFromSupabase = deleteIssueFromSupabase;
window.addIssueToSupabase = addIssueToSupabase;
window.updateIssueInSupabase = updateIssueInSupabase;
window.updateIssueStatusInSupabase = updateIssueStatusInSupabase;
window.fetchIssuesFromSupabase = fetchIssuesFromSupabase;