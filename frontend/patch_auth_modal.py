import os
import re

def patch_auth_modal():
    file = r'index.html'
    if not os.path.exists(file): return
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Step 1: Email -> "Continue" button
    old_step1_btn = """<button @click="if(email) authStep = 2" class="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mt-12 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-0">CONTINUE</button>"""
    new_step1_btn = """<button @click="async () => {
        if(!email) return;
        loading = true; error = '';
        try {
            const { data, error: rpcError } = await $store.saeedAuth.supabase.rpc('check_email_exists', { lookup_email: email });
            if (rpcError) throw rpcError;
            if (data) {
                authStep = 2; // Exists -> Login
            } else {
                authStep = 3; // New -> Registration
            }
        } catch (e) {
            error = 'Unable to verify email';
        } finally {
            loading = false;
        }
    }" class="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mt-12 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-0 flex items-center justify-center gap-3 min-w-[140px]" :disabled="loading">
        <svg x-show="loading" class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <span x-text="loading ? 'VERIFYING...' : 'CONTINUE'"></span>
    </button>"""
    content = content.replace(old_step1_btn, new_step1_btn)
    
    # Also fix the enter key on the email input
    old_email_input = """<input type="email" x-model="email" @keydown.enter="if(email) authStep = 2\""""
    new_email_input = """<input type="email" x-model="email" @keydown.enter="document.getElementById('continue-btn').click()" id="email-input\""""
    content = content.replace(old_email_input, new_email_input)
    # Add id to continue button
    content = content.replace("""class="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mt-12 hover:text-white""", """id="continue-btn" class="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mt-12 hover:text-white""")

    # Step 2: Login Logic (remove silent signup fallback)
    old_step2_logic = """                let result = await $store.saeedAuth.signInWithPassword(email, password);
                if (result.error) {
                  // Fallback: If login fails, attempt signup silently
                  result = await $store.saeedAuth.signUp(email, password);
                }"""
    new_step2_logic = """                let result = await $store.saeedAuth.signInWithPassword(email, password);"""
    content = content.replace(old_step2_logic, new_step2_logic)
    
    # Step 3: Registration
    # We need to insert authStep === 3 right after authStep === 2
    step_3_html = """
    <!-- Step 3: Registration -->
    <div x-show="authStep === 3"
         x-transition:enter="transition ease-out duration-500 delay-100"
         x-transition:enter-start="opacity-0 translate-y-4"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-300"
         x-transition:leave-start="opacity-100 translate-y-0"
         x-transition:leave-end="opacity-0 -translate-y-4"
         class="w-full flex flex-col items-center" style="display: none;">
      <p class="text-2xl md:text-3xl text-white/50 mb-8 font-serif text-center">Join the Atelier.</p>
      
      <!-- We just need a password to register for now, or maybe name and phone? The prompt says "Password input". Let's stick to minimal design. -->
      <input type="password" x-model="password" @keydown.enter="document.getElementById('register-btn').click()"
             class="w-full max-w-3xl bg-transparent border-none outline-none text-center text-4xl md:text-6xl lg:text-7xl text-[#c9a96e] font-serif placeholder-white/10 focus:ring-0 focus:outline-none"
             placeholder="Create a password">
             
      <div class="flex flex-col items-center gap-6 mt-12">
        <button id="register-btn" @click="async () => {
              if (!email || !password) { error = lang === 'ar' ? 'الرجاء إدخال البيانات' : 'Please fill in all fields'; return; }
              loading = true; error = '';
              try {
                let result = await $store.saeedAuth.signUp(email, password);
                if (result.error) {
                  error = result.error.message || 'Registration failed.';
                } else {
                  $store.saeedAuth.showAuthModal = false; email = ''; password = ''; error = ''; authStep = 1;
                  if ($store.saeedAuth.pendingAction) { $store.saeedAuth.pendingAction(); $store.saeedAuth.pendingAction = null; }
                }
              } catch(e) { error = 'An unexpected error occurred'; }
              finally { loading = false; }
            }"
            class="px-12 py-4 bg-[#c9a96e] text-black text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors focus:outline-none focus:ring-0 flex items-center justify-center gap-3 min-w-[240px]"
            :disabled="loading">
            <svg x-show="loading" class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <span x-text="loading ? 'REGISTERING...' : 'SIGN UP'"></span>
        </button>
        <button @click="authStep = 1; error = ''" class="text-xs uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-0">&larr; BACK</button>
      </div>
    </div>
    """
    
    # Find the end of authStep === 2
    target_end = """<button @click="authStep = 1; error = ''" class="text-xs uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-0">&larr; BACK</button>\n      </div>\n    </div>"""
    
    if step_3_html not in content:
        content = content.replace(target_end, target_end + "\n" + step_3_html)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched frontend/index.html")

if __name__ == "__main__":
    patch_auth_modal()
