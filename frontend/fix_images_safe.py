import os
import re

def fix_image_urls():
    file = r'src/react/Majlis.jsx'
    if not os.path.exists(file): return

    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(r'/catalog/\$\{([^}]+)\}', r'/catalog/${encodeURIComponent(\1)}', content)
    new_content = new_content.replace('encodeURIComponent(encodeURIComponent(', 'encodeURIComponent(')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed image URLs safely")

if __name__ == '__main__':
    fix_image_urls()
