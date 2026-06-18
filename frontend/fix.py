import os
import re

files = ['auth.html', 'dashboard/admin.html', 'dashboard/client.html', 'dashboard/production.html']
for f in files:
    filepath = 'd:/Saeed Furniture/frontend/' + f
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'name="description"' not in content:
        meta_desc = '\n  <meta name="description" content="Saeed Furniture - Luxury bespoke furniture portal.">'
        if '<head>' in content:
            content = content.replace('<head>', '<head>' + meta_desc, 1)
        else:
            content = re.sub(r'(<meta charset="UTF-8">)', r'\g<1>' + meta_desc, content, 1)
            
    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f'Added description to {f}')
