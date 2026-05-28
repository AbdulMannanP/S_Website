import re
import os

files = [
    ('frontend/index.html', 'app.js'),
    ('frontend/dashboard/admin.html', 'admin.js'),
    ('frontend/dashboard/client.html', 'client.js'),
    ('frontend/dashboard/production.html', 'production.js'),
    ('frontend/portfolio.html', 'portfolio.js')
]

for filepath, js_file in files:
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Remove the appended script tag from the bottom (or wherever it is)
    script_tag = f'<script defer src="/js/{js_file}"></script>'
    html = html.replace(script_tag, '')

    # 2. Find Alpine and insert the script tag BEFORE it
    # We look for the first occurrence of 'alpinejs' in a script tag
    alpine_pattern = re.compile(r'<script[^>]*alpinejs[^>]*></script>')
    match = alpine_pattern.search(html)
    
    if match:
        insertion_point = match.start()
        new_html = html[:insertion_point] + script_tag + '\n  ' + html[insertion_point:]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Fixed script order in {filepath}")
    else:
        print(f"Alpine not found in {filepath}!")
