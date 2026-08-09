import os
import re

def fix_image_urls():
    file = r'src/react/Majlis.jsx'
    if not os.path.exists(file): return

    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to replace instances of:
    # src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${VARIABLE}?tr=...`}
    # with:
    # src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${encodeURIComponent(VARIABLE)}?tr=...`}
    
    # Let's find all occurrences of `/catalog/${` and replace them.
    # The regex looks for `/catalog/\$\{([^}]+)\}`
    # and replaces it with `/catalog/${encodeURIComponent(\1)}`
    
    new_content = re.sub(r'/catalog/\$\{([^}]+)\}', r'/catalog/${encodeURIComponent(\1)}', content)

    # Let's also check if I missed any:
    # Are there any encodeURIComponent already?
    new_content = new_content.replace('encodeURIComponent(encodeURIComponent(', 'encodeURIComponent(')
    new_content = new_content.replace('))}', ')}')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed image URLs")

if __name__ == '__main__':
    fix_image_urls()
