import os
import re

# 1. Inject RBAC Redirect in Dashboards
redirect_script = '''<script>
  // Lightweight pre-load session check
  (function(){
    let hasSession = false;
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        hasSession = true; break;
      }
    }
    if (!hasSession) { window.location.replace('/auth.html'); }
  })();
</script>'''

dashboards = ['d:/Saeed Furniture/frontend/dashboard/admin.html', 'd:/Saeed Furniture/frontend/dashboard/production.html']
for filepath in dashboards:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'window.location.replace' not in content:
            content = content.replace('<head>', '<head>\n  ' + redirect_script)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

# 2. Strip console.log
js_files = []
for root, dirs, files in os.walk('d:/Saeed Furniture/frontend'):
    if 'node_modules' in root: continue
    for file in files:
        if file.endswith('.js') or file.endswith('.html'):
            js_files.append(os.path.join(root, file))

for filepath in js_files:
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    # Replace console.log(...) with /* console.log removed */
    # This regex handles basic console.log statements safely
    new_content = re.sub(r'console\.log\s*\([^;]*\);?', '/* console.log scrubbed */', content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

print("Phase 7 complete")
