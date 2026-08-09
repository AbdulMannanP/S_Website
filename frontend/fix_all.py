import glob
import re
import os

def fix_codebase():
    html_files = glob.glob('*.html')
    
    favicon_link = '<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23080809%22/><text y=%2250%22 x=%2250%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2260%22 fill=%22%23c9a96e%22>S</text></svg>">'
    
    lang_script = """<script>
    (function() {
      var storedLang = localStorage.getItem('saeed_lang') || 'en';
      document.documentElement.lang = storedLang;
      document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
      window.saeedInitialLang = storedLang;
    })();
  </script>"""

    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        orig = content
        
        # 1. Favicon and Lang script
        if "var storedLang =" not in content:
            content = content.replace("</head>", f"  {favicon_link}\n  {lang_script}\n</head>")
            
        # 2. Fix x-data in majlis.html and others
        if file == 'majlis.html' or 'lang:' in content:
            body_match = re.search(r'(<body[^>]*x-data="\{)([^}"]*)("\s*@scroll\.window)', content)
            if body_match:
                inner_data = body_match.group(2)
                if 'headerHidden' not in inner_data:
                    new_inner_data = " headerHidden: false, lastScroll: window.pageYOffset || 0," + inner_data
                    content = content.replace(body_match.group(1) + inner_data + body_match.group(3), body_match.group(1) + new_inner_data + body_match.group(3))
                    
        # Initialize lang dynamically where statically bound
        content = re.sub(r"(x-data=\"{[^}]*)lang:\s*'ar'", r"\1lang: window.saeedInitialLang", content)
        content = re.sub(r"(x-data=\"{[^}]*)lang:\s*'en'", r"\1lang: window.saeedInitialLang", content)
        
        # 3. Auth Modal Contrast (in index.html)
        if file == 'index.html':
            old_auth_class = "class=\"fixed inset-0 z-[999] bg-[#050506] flex flex-col items-center justify-center p-6 backdrop-blur-xl\""
            new_auth_class = "class=\"fixed inset-0 z-[9999] bg-[#080809]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6\""
            content = content.replace(old_auth_class, new_auth_class)
            
            wa_target = '<div class="fixed bottom-8 end-6 z-40 animate-pulse-ring rounded-full">'
            if wa_target in content:
                content = content.replace(wa_target, '<div x-show="!($store.saeedAuth && $store.saeedAuth.showAuthModal)" class="fixed bottom-8 end-6 z-40 animate-pulse-ring rounded-full">')
        
        if content != orig:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed {file}")

    # Fix js/app.js
    app_js_path = 'js/app.js'
    if os.path.exists(app_js_path):
        with open(app_js_path, 'r', encoding='utf-8') as f:
            app_js = f.read()
            
        orig_app_js = app_js
        app_js = app_js.replace("lang:              'ar',", "lang:              window.saeedInitialLang || 'ar',")
        app_js = app_js.replace("lang:              'en',", "lang:              window.saeedInitialLang || 'en',")
            
        if app_js != orig_app_js:
            with open(app_js_path, 'w', encoding='utf-8') as f:
                f.write(app_js)
            print("Fixed js/app.js")
            
    # Fix js/components/header.js language toggles
    header_js_path = 'js/components/header.js'
    if os.path.exists(header_js_path):
        with open(header_js_path, 'r', encoding='utf-8') as f:
            header_js = f.read()
            
        orig_header_js = header_js
        header_js = header_js.replace("@click=\"lang = 'en'\"", "@click=\"lang = 'en'; localStorage.setItem('saeed_lang', 'en'); document.documentElement.dir = 'ltr'; document.documentElement.lang = 'en';\"")
        header_js = header_js.replace("@click=\"lang = 'ar'\"", "@click=\"lang = 'ar'; localStorage.setItem('saeed_lang', 'ar'); document.documentElement.dir = 'rtl'; document.documentElement.lang = 'ar';\"")
            
        if header_js != orig_header_js:
            with open(header_js_path, 'w', encoding='utf-8') as f:
                f.write(header_js)
            print("Fixed js/components/header.js")

if __name__ == '__main__':
    fix_codebase()
