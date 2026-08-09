import re
import os

def fix_security():
    # 1. Patch the Admin Middleware (saeed-backend/middleware/auth.js)
    auth_js_path = r'saeed-backend/middleware/auth.js'
    if os.path.exists(auth_js_path):
        with open(auth_js_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        old_admin_check = """    // Check if user has admin role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();"""
      
        new_admin_check = """    // Check if user has admin role from profiles table using a scoped client
    const userClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      realtime: { transport: WebSocket }
    });
    const { data: profile, error: profileError } = await userClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();"""
      
        content = content.replace(old_admin_check, new_admin_check)
        with open(auth_js_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched saeed-backend/middleware/auth.js")


    # 2. Secure Lead Upserts (saeed-backend/services/database.js)
    db_js_path = r'saeed-backend/services/database.js'
    if os.path.exists(db_js_path):
        with open(db_js_path, 'r', encoding='utf-8') as f:
            content = f.read()

        old_upsert_query = """  const { data: existing } = await supabase
    .from('leads')
    .select('order_id')
    .eq('order_id', order_id)
    .single();

  const action = existing ? "updated" : "inserted";"""

        new_upsert_query = """  const { data: existing } = await supabase
    .from('leads')
    .select('order_id, session_id')
    .eq('order_id', order_id)
    .single();

  if (existing && !req.user) {
    if (!session_id || existing.session_id !== session_id) {
      const err = new Error("Forbidden: Invalid session ID for lead update");
      err.status = 403;
      throw err;
    }
  }

  const action = existing ? "updated" : "inserted";"""
        
        content = content.replace(old_upsert_query, new_upsert_query)
        with open(db_js_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched saeed-backend/services/database.js")


    # 3. Eradicate Frontend Backdoors (frontend/js/auth.js & auth.html)
    frontend_auth_js = r'frontend/js/auth.js'
    if os.path.exists(frontend_auth_js):
        with open(frontend_auth_js, 'r', encoding='utf-8') as f:
            content = f.read()
        
        bad_block = """          // Hardcode override for master admin to avoid SQL friction
          if (session.user.email === 'my.private.mail.for.laptop@gmail.com') {
            this.role = 'admin';
          }"""
        
        content = content.replace(bad_block, "")
        with open(frontend_auth_js, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched frontend/js/auth.js")
        
    frontend_auth_html = r'frontend/auth.html'
    if os.path.exists(frontend_auth_html):
        with open(frontend_auth_html, 'r', encoding='utf-8') as f:
            content = f.read()
            
        old_redirect = """        // Force admin redirect for the master email, otherwise default to client.
        // client.js/admin.js will handle final validation once the profile loads.
        const email = data.user.email;
        if (email === 'my.private.mail.for.laptop@gmail.com') {
          window.location.href = '/dashboard/admin';
        } else {
          const metaRole = data.user.user_metadata?.role || 'client';
          if (metaRole === 'admin') window.location.href = '/dashboard/admin';
          else if (metaRole === 'employee') window.location.href = '/dashboard/production';
          else window.location.href = '/dashboard/client';
        }"""
        new_redirect = """        // client.js/admin.js will handle final validation once the profile loads.
        const metaRole = data.user.user_metadata?.role || 'client';
        if (metaRole === 'admin') window.location.href = '/dashboard/admin';
        else if (metaRole === 'employee') window.location.href = '/dashboard/production';
        else window.location.href = '/dashboard/client';"""
        
        content = content.replace(old_redirect, new_redirect)
        with open(frontend_auth_html, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched frontend/auth.html")

    # 4 & 5. server.js (CORS & Rate Limiting)
    server_js_path = r'saeed-backend/server.js'
    if os.path.exists(server_js_path):
        with open(server_js_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        old_cors = """    // 3. The Validation Check
    if (allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {"""
        new_cors = """    // 3. The Validation Check
    if (allowedOrigins.includes(origin)) {"""
        content = content.replace(old_cors, new_cors)
        
        old_start = """// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  await initSchema();"""
        new_start = """// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
    throw new Error('REDIS_URL is required in production for rate limiting.');
  }
  await initSchema();"""
        content = content.replace(old_start, new_start)
        
        with open(server_js_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched saeed-backend/server.js")

if __name__ == '__main__':
    fix_security()
