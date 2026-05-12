/**
 * Authentication Module
 * PropCheck - Supabase Auth Integration
 */

// ── Sign Up (Registration) ──────────────────────────────────────────────────
async function signUp(email, password) {
    if (!email || !password) {
        return { success: false, error: 'Email i hasło są wymagane' };
    }
    
    if (password.length < 6) {
        return { success: false, error: 'Hasło musi mieć minimum 6 znaków' };
    }
    
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
        });
        
        if (error) {
            console.error('Sign up error:', error);
            
            // User-friendly error messages
            if (error.message.includes('already registered')) {
                return { success: false, error: 'Ten email jest już zarejestrowany' };
            }
            
            return { success: false, error: error.message };
        }
        
        return { success: true, user: data.user };
    } catch (err) {
        console.error('Unexpected sign up error:', err);
        return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
    }
}

// ── Sign In (Login) ─────────────────────────────────────────────────────────
async function signIn(email, password) {
    if (!email || !password) {
        return { success: false, error: 'Email i hasło są wymagane' };
    }
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });
        
        if (error) {
            console.error('Sign in error:', error);
            
            // User-friendly error messages
            if (error.message.includes('Invalid login credentials')) {
                return { success: false, error: 'Nieprawidłowy email lub hasło' };
            }
            
            return { success: false, error: error.message };
        }
        
        return { success: true, user: data.user };
    } catch (err) {
        console.error('Unexpected sign in error:', err);
        return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
    }
}

// ── Sign Out (Logout) ───────────────────────────────────────────────────────
async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        
        if (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
        
        return { success: true };
    } catch (err) {
        console.error('Unexpected sign out error:', err);
        return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
    }
}

// ── Get Current User ────────────────────────────────────────────────────────
async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        
        if (error) {
            console.error('Get user error:', error);
            return null;
        }
        
        return user;
    } catch (err) {
        console.error('Unexpected get user error:', err);
        return null;
    }
}

// ── Check if user is authenticated ──────────────────────────────────────────
async function isAuthenticated() {
    const user = await getCurrentUser();
    return user !== null;
}
