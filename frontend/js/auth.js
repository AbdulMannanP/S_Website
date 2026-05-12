document.addEventListener('alpine:init', () => {
  Alpine.store('saeedAuth', {
    user: null,
    role: null,
    supabase: null,
    isLoading: true,
    showAuthModal: false,

    async init() {
      try {
        // Fetch config
        const res = await fetch('/api/config');
        const config = await res.json();
        
        if (config.supabaseUrl && config.supabaseAnonKey) {
          this.supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
          
          // Get initial session
          const { data: { session } } = await this.supabase.auth.getSession();
          await this.handleSession(session);

          // Listen for auth changes
          this.supabase.auth.onAuthStateChange(async (_event, session) => {
            await this.handleSession(session);
          });
        } else {
          console.error("Supabase config is missing from backend.");
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
      } finally {
        this.isLoading = false;
      }
    },

    async handleSession(session) {
      if (session && session.user) {
        this.user = session.user;
        try {
          const { data: profile, error } = await this.supabase
            .from('profiles')
            .select('role, full_name, phone')
            .eq('id', session.user.id)
            .single();

          if (profile && !error) {
            this.role      = profile.role      || 'client';
            this.fullName  = profile.full_name || '';
            this.phone     = profile.phone     || '';
          } else {
            this.role = 'client'; this.fullName = ''; this.phone = '';
          }
        } catch (e) {
          console.error("Error fetching profile:", e);
          this.role = 'client'; this.fullName = ''; this.phone = '';
        }
      } else {
        this.user = null; this.role = null; this.fullName = ''; this.phone = '';
      }
    },



    async signInWithPassword(email, password) {
      if (!this.supabase) return { error: "Supabase not initialized" };
      return await this.supabase.auth.signInWithPassword({ email, password });
    },

    async signUp(email, password) {
      if (!this.supabase) return { error: "Supabase not initialized" };
      return await this.supabase.auth.signUp({ email, password });
    },

    async signOut() {
      if (!this.supabase) return;
      await this.supabase.auth.signOut();
      window.location.href = '/';
    }
  });
});
