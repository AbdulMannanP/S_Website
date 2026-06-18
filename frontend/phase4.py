import os
import re

# 1. Inject x-cloak in dashboard/client.html
client_path = 'd:/Saeed Furniture/frontend/dashboard/client.html'
if os.path.exists(client_path):
    with open(client_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all tags with x-show that don't have x-cloak
    def add_xcloak(match):
        tag = match.group(0)
        if 'x-cloak' not in tag:
            return tag.replace('x-show', 'x-cloak x-show')
        return tag
    content = re.sub(r'<[^>]*\bx-show\b[^>]*>', add_xcloak, content)
    
    with open(client_path, 'w', encoding='utf-8') as f:
        f.write(content)

# 2. Ensure [x-cloak] is in global css (or index.html head) and apply :dir to html
html_files = []
for root, dirs, files in os.walk('d:/Saeed Furniture/frontend'):
    if 'node_modules' in root: continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    modified = False
    
    # Inject [x-cloak] CSS in head if not present
    if '[x-cloak]' not in content and '<head>' in content:
        cloak_css = '\n  <style>[x-cloak] { display: none !important; }</style>'
        content = content.replace('</head>', cloak_css + '\n</head>')
        modified = True
        
    # Inject :dir RTL logic on <html>
    if '<html' in content and 'dir="' not in content and ':dir=' not in content:
        content = re.sub(r'(<html[^>]*?)>', r'\1 :dir="lang === \'ar\' ? \'rtl\' : \'ltr\'">', content, 1)
        modified = True
        
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Finished Phase 4")
