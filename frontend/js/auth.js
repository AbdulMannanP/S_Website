document.addEventListener('alpine:init', () => {
  Alpine.store('saeedApp', {
    lang: localStorage.getItem('saeed_lang') || window.saeedInitialLang || 'en',
    setLang(newLang) {
      this.lang = newLang;
      localStorage.setItem('saeed_lang', newLang);
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    },
    handleOrderClick() {
      const auth = Alpine.store('saeedAuth');
      if (!auth.user) {
        auth.showAuthModal = true;
        auth.pendingAction = () => { window.location.href = '/dashboard/client'; };
      } else {
        window.location.href = '/dashboard/client';
      }
    }
  });

  Alpine.store('saeedAuth', {
    user: null,
    role: null,
    supabase: null,
    isLoading: true,
    showAuthModal: false,

    async init() {
      try {
        // Fetch config
        
        const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
              (window.location.port !== '3001' && window.location.port !== '3000' && window.location.port !== '') 
              ? 'http://localhost:3001' : '';
        const res = await fetch(API + '/api/config');
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
          // console.warn("Supabase config is missing");
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
