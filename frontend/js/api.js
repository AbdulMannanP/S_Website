/**
 * js/api.js
 * Central API utility wrapper for Saeed Furniture
 * Handles injecting Supabase JWT tokens securely into all outgoing requests.
 */

window.api = {
  /**
   * Secure wrapper around standard fetch()
   * Automatically fetches the current Supabase session and attaches it to the Authorization header.
   */
  async secureFetch(url, options = {}) {
    const headers = options.headers ? { ...options.headers } : { 'Content-Type': 'application/json' };

    try {
      const auth = typeof Alpine !== 'undefined' ? Alpine.store('saeedAuth') : null;
      
      if (auth?.supabase) {
        // Fetch the current Supabase session
        const { data: { session } } = await auth.supabase.auth.getSession();
        const token = session?.access_token;
        
        // If a token exists, attach it to the headers
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Keep the legacy email header as a fallback
        if (auth.user?.email && !headers['x-user-email']) {
          headers['x-user-email'] = auth.user.email;
        }
      }
    } catch (e) {
      console.warn('[API] Failed to fetch session token:', e);
    }

    return fetch(url, {
      ...options,
      headers
    });
  }
};
