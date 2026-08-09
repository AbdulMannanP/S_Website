import os

def fix_api_url():
    # 1. Fix app.js
    app_file = r'frontend/js/app.js'
    if os.path.exists(app_file):
        with open(app_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        old_api = "const API = window.location.origin;"
        new_api = """const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
              (window.location.port !== '3001' && window.location.port !== '3000' && window.location.port !== '') 
              ? 'http://localhost:3001' : window.location.origin;"""
        if old_api in content:
            content = content.replace(old_api, new_api)
            with open(app_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print("Patched app.js API URL")

    # 2. Fix auth.js
    auth_file = r'frontend/js/auth.js'
    if os.path.exists(auth_file):
        with open(auth_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # In auth.js, it just calls `/api/config` natively. Let's create an API base.
        old_fetch = "const res = await fetch('/api/config');"
        new_fetch = """
        const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
              (window.location.port !== '3001' && window.location.port !== '3000' && window.location.port !== '') 
              ? 'http://localhost:3001' : '';
        const res = await fetch(API + '/api/config');"""
        
        if old_fetch in content:
            content = content.replace(old_fetch, new_fetch)
            with open(auth_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print("Patched auth.js API URL")

if __name__ == '__main__':
    fix_api_url()
