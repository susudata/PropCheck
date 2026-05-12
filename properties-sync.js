/**
 * Properties Sync Module
 * Supabase integration for properties CRUD operations
 * Phase 2B.2: Sync Properties
 */

// ── Offline-first cache ─────────────────────────────────────────────────────
let propertiesCache = [];
let isSyncEnabled = true;  // Flag to disable sync if network is down

// Note: Functions exposed to global scope at the end of file (after declaration)

// ── Initialize sync on page load ────────────────────────────────────────────
async function initPropertiesSync() {
    // Initialize network status
    if (!navigator.onLine) {
        isSyncEnabled = false;
        console.log('Starting in offline mode - using cache');
        const cached = loadPropertiesFromCache();
        // Sync cache to global dashboard properties
        if (window.properties !== undefined) {
            window.properties = cached;
        }
        return;
    }
    
    // If online, check if we have offline data to sync
    const user = await getCurrentUser();
    if (user) {
        // First, sync any offline properties to Supabase
        console.log('Checking for offline properties to sync...');
        await syncOfflinePropertiesToSupabase();
        
        // Then fetch fresh data from Supabase
        const supabaseData = await fetchPropertiesFromSupabase();
        
        // If Supabase returns empty, load from cache (network error scenario)
        if (supabaseData.length === 0) {
            console.log('Supabase fetch returned empty, loading from cache');
            const cached = loadPropertiesFromCache();
            // Sync cache to global dashboard properties
            if (window.properties !== undefined) {
                window.properties = cached;
            }
        } else {
            // Sync Supabase data to global dashboard properties
            if (window.properties !== undefined) {
                window.properties = supabaseData;
            }
        }
    }
}

// ── Cache Management ────────────────────────────────────────────────────────

function savePropertiesToCache(propertiesList) {
    localStorage.setItem('propcheck_properties_cache', JSON.stringify(propertiesList));
    propertiesCache = propertiesList;
    window.propertiesCache = propertiesCache;  // Update global reference
}

function loadPropertiesFromCache() {
    const cached = localStorage.getItem('propcheck_properties_cache');
    if (cached) {
        try {
            propertiesCache = JSON.parse(cached);
            window.propertiesCache = propertiesCache;  // Update global reference
            return propertiesCache;
        } catch (e) {
            console.warn('Failed to parse cached properties:', e);
            return [];
        }
    }
    return [];
}

// ── Fetch properties from Supabase ──────────────────────────────────────────

async function fetchPropertiesFromSupabase() {
    try {
        if (!isSyncEnabled) return [];
        
        const { data, error } = await supabaseClient
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching properties from Supabase:', error);
            return [];
        }
        
        // Transform Supabase data to frontend format
        const transformed = data.map(prop => ({
            id: prop.id,
            name: prop.name,
            address: prop.address,
            floorplanPhoto: prop.floorplan_url,
            issues: {
                critical: prop.issues_critical,
                inProgress: prop.issues_in_progress,
                resolved: prop.issues_resolved
            }
        }));
        
        // ⚠️ CRITICAL: Only update cache if Supabase has data
        // Don't overwrite cache with empty array (user might have offline data)
        if (transformed.length > 0) {
            savePropertiesToCache(transformed);
        }
        
        return transformed;
    } catch (err) {
        console.error('Unexpected error fetching properties:', err);
        return [];
    }
}

// ── Sync offline properties to Supabase ─────────────────────────────────────
// This uploads any local properties that were created offline to Supabase
async function syncOfflinePropertiesToSupabase() {
    try {
        if (!isSyncEnabled) {
            console.log('Sync disabled (offline), skipping');
            return { synced: 0 };
        }
        
        const user = await getCurrentUser();
        if (!user) {
            console.log('No user, skipping sync');
            return { synced: 0 };
        }
        
        // Get local cache
        const localCache = loadPropertiesFromCache();
        console.log('Local cache has', localCache.length, 'properties');
        
        if (localCache.length === 0) {
            console.log('No local properties to sync');
            return { synced: 0 };
        }
        
        // Get properties from Supabase (with full data for comparison)
        const { data: serverData, error: fetchError } = await supabaseClient
            .from('properties')
            .select('id, name, address')
            .eq('user_id', user.id);
        
        if (fetchError) {
            console.error('Error fetching Supabase properties for sync:', fetchError);
            return { synced: 0 };
        }
        
        console.log('Supabase has', serverData.length, 'properties');
        
        // Create a map of server properties by name+address (unique identifier)
        const serverMap = new Map();
        serverData.forEach(p => {
            const key = `${p.name}|||${p.address}`;
            serverMap.set(key, p);
        });
        
        let syncedCount = 0;
        
        // Find local properties that don't exist on server
        for (const localProp of localCache) {
            const key = `${localProp.name}|||${localProp.address}`;
            
            // Check if this property exists on server
            if (!serverMap.has(key)) {
                // Property doesn't exist on server - upload it
                console.log('Found offline property to sync:', localProp.name);
                
                try {
                    const { error } = await supabaseClient
                        .from('properties')
                        .insert([
                            {
                                user_id: user.id,
                                name: localProp.name,
                                address: localProp.address,
                                floorplan_url: localProp.floorplanPhoto || null,
                                issues_critical: localProp.issues?.critical || 0,
                                issues_in_progress: localProp.issues?.inProgress || 0,
                                issues_resolved: localProp.issues?.resolved || 0
                            }
                        ]);
                    
                    if (!error) {
                        syncedCount++;
                        console.log('✅ Synced offline property:', localProp.name);
                    } else {
                        console.warn('❌ Failed to sync property:', localProp.name, error.message);
                    }
                } catch (err) {
                    console.warn('❌ Error syncing property:', localProp.name, err);
                }
            }
        }
        
        // After sync, fetch fresh data from Supabase
        if (syncedCount > 0) {
            console.log('✅ Synced', syncedCount, 'offline properties, refreshing from Supabase');
            await fetchPropertiesFromSupabase();
        } else {
            console.log('No offline properties needed syncing');
        }
        
        return { synced: syncedCount };
    } catch (err) {
        console.error('Error in syncOfflinePropertiesToSupabase:', err);
        return { synced: 0 };
    }
}

// ── Add property (INSERT) ───────────────────────────────────────────────────

async function addPropertyToSupabase(name, address, floorplanPhoto) {
    try {
        if (!isSyncEnabled) {
            throw new Error('Sync is disabled (offline mode)');
        }
        
        const { data, error } = await supabaseClient
            .from('properties')
            .insert([
                {
                    user_id: (await getCurrentUser()).id,
                    name: name,
                    address: address,
                    floorplan_url: floorplanPhoto || null,
                    issues_critical: 0,
                    issues_in_progress: 0,
                    issues_resolved: 0
                }
            ])
            .select()
            .single();
        
        if (error) {
            console.error('Error adding property to Supabase:', error);
            throw new Error(error.message);
        }
        
        // Transform and add to cache
        const transformed = {
            id: data.id,
            name: data.name,
            address: data.address,
            floorplanPhoto: data.floorplan_url,
            issues: {
                critical: data.issues_critical,
                inProgress: data.issues_in_progress,
                resolved: data.issues_resolved
            }
        };
        
        propertiesCache.push(transformed);
        savePropertiesToCache(propertiesCache);
        
        return { success: true, data: transformed };
    } catch (err) {
        console.error('Error in addPropertyToSupabase:', err);
        return { success: false, error: err.message };
    }
}

// ── Delete property (DELETE) ────────────────────────────────────────────────

async function deletePropertyFromSupabase(propertyId) {
    try {
        if (!isSyncEnabled) {
            throw new Error('Sync is disabled (offline mode)');
        }
        
        const { error } = await supabaseClient
            .from('properties')
            .delete()
            .eq('id', propertyId);
        
        if (error) {
            console.error('Error deleting property from Supabase:', error);
            throw new Error(error.message);
        }
        
        // Remove from cache
        propertiesCache = propertiesCache.filter(p => p.id !== propertyId);
        savePropertiesToCache(propertiesCache);
        
        return { success: true };
    } catch (err) {
        console.error('Error in deletePropertyFromSupabase:', err);
        return { success: false, error: err.message };
    }
}

// ── Edit property (UPDATE) ──────────────────────────────────────────────────

async function updatePropertyInSupabase(propertyId, name, address, floorplanPhoto) {
    try {
        if (!isSyncEnabled) {
            throw new Error('Sync is disabled (offline mode)');
        }
        
        const { data, error } = await supabaseClient
            .from('properties')
            .update({
                name: name,
                address: address,
                floorplan_url: floorplanPhoto || null
            })
            .eq('id', propertyId)
            .select()
            .single();
        
        if (error) {
            console.error('Error updating property in Supabase:', error);
            throw new Error(error.message);
        }
        
        // Update cache
        const index = propertiesCache.findIndex(p => p.id === propertyId);
        if (index !== -1) {
            propertiesCache[index] = {
                id: data.id,
                name: data.name,
                address: data.address,
                floorplanPhoto: data.floorplan_url,
                issues: {
                    critical: data.issues_critical,
                    inProgress: data.issues_in_progress,
                    resolved: data.issues_resolved
                }
            };
            savePropertiesToCache(propertiesCache);
        }
        
        return { success: true, data: propertiesCache[index] };
    } catch (err) {
        console.error('Error in updatePropertyInSupabase:', err);
        return { success: false, error: err.message };
    }
}

// ── Network status monitoring ───────────────────────────────────────────────

window.addEventListener('online', async () => {
    console.log('Network is back online - enabling sync');
    isSyncEnabled = true;
    
    // First, sync any offline properties to Supabase
    console.log('Syncing offline properties to Supabase...');
    await syncOfflinePropertiesToSupabase();
    
    // Then fetch fresh data from Supabase
    const supabaseData = await fetchPropertiesFromSupabase();
    if (supabaseData.length > 0) {
        // Update from server (more authoritative)
        if (window.properties !== undefined) {
            window.properties = supabaseData;
        }
    } else {
        // Keep local cache if server is empty or error
        console.log('Using local cache after reconnection');
    }
});

window.addEventListener('offline', () => {
    console.log('Network is offline - disabling sync, using cache');
    isSyncEnabled = false;
});

// ── Expose functions to global scope (after declarations) ──────────────────
window.propertiesCache = propertiesCache;
window.savePropertiesToCache = savePropertiesToCache;
window.loadPropertiesFromCache = loadPropertiesFromCache;
window.syncOfflinePropertiesToSupabase = syncOfflinePropertiesToSupabase;
