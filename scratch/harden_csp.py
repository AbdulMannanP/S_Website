import os
import re

def extract_script(html_file, js_file, func_name):
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Find the <script> block at the bottom
    pattern = re.compile(r'<script>\s*function\s+' + func_name + r'\(\).*?</script>', re.DOTALL)
    match = pattern.search(html)
    
    if match:
        script_content = match.group(0)
        # Remove <script> and </script> tags
        script_body = script_content.replace('<script>', '').replace('</script>', '').strip()
        
        # Write to js file
        with open(js_file, 'w', encoding='utf-8') as jsf:
            jsf.write(script_body)
            
        # Replace in html with external reference
        new_html = html[:match.start()] + f'<script defer src="/js/{os.path.basename(js_file)}"></script>' + html[match.end():]
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Extracted {func_name} to {js_file}")

# 1. Extract dashboard scripts
extract_script('frontend/dashboard/admin.html', 'frontend/js/admin.js', 'adminDashboard')
extract_script('frontend/dashboard/client.html', 'frontend/js/client.js', 'clientDashboard')
extract_script('frontend/dashboard/production.html', 'frontend/js/production.js', 'productionDashboard')

# 2. Refactor onclick to @click in product pages
pages = ['frontend/majlis.html', 'frontend/kitchen.html', 'frontend/bedroom.html', 'frontend/cot.html', 'frontend/almirah.html']
for page in pages:
    with open(page, 'r', encoding='utf-8') as f:
        html = f.read()
    html = html.replace('onclick="window.location.href=\'/#order\'"', '@click="window.location.href=\'/#order\'"')
    with open(page, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Refactored {page}")

# 3. Tighten CSP in server.js
with open('saeed-backend/server.js', 'r', encoding='utf-8') as f:
    server = f.read()

# Replace "'self'", "'unsafe-inline'", "'unsafe-eval'" with "'self'", "'unsafe-eval'" in scriptSrc
server = server.replace(
    'scriptSrc: ["\'self\'", "\'unsafe-inline\'", "\'unsafe-eval\'"',
    'scriptSrc: ["\'self\'", "\'unsafe-eval\'"'
)
with open('saeed-backend/server.js', 'w', encoding='utf-8') as f:
    f.write(server)
print("Tightened CSP in server.js")
