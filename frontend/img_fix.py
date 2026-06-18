import os
import re

filepath = 'd:/Saeed Furniture/frontend/index.html'
with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Make all logos and hero images eager/high priority
content = content.replace('loading="lazy" alt="Saeed Furniture"', 'loading="eager" fetchpriority="high" alt="Saeed Furniture"')
content = re.sub(r'(<img\s+[^>]*src="[^"]*Hero[^"]*"[^>]*)>', r'\1 loading="eager" fetchpriority="high">', content)
content = re.sub(r'(<img\s+[^>]*src="[^"]*logo\.png[^"]*"[^>]*)loading="lazy"', r'\1loading="eager" fetchpriority="high"', content)

# Make sure they don't have multiple loading/fetchpriority attributes now
content = re.sub(r'loading="eager".*?loading="eager"', 'loading="eager"', content)
content = re.sub(r'fetchpriority="high".*?fetchpriority="high"', 'fetchpriority="high"', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated index.html image priorities")
