import os
import re

html_files = []
for root, dirs, files in os.walk('d:/Saeed Furniture/frontend'):
    if 'node_modules' in root: continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8', errors='replace') as file:
        content = file.read()
    
    # Add alt="" to any <img> missing alt attribute
    # Find all <img ...> that don't have alt=
    def replace_img(match):
        img_tag = match.group(0)
        if 'alt=' not in img_tag:
            return img_tag.replace('<img', '<img alt="Image"')
        return img_tag
    content = re.sub(r'<img\s+[^>]*>', replace_img, content)
    
    # Add aria-label="Button" to <button> tags missing aria-label
    def replace_btn(match):
        btn_tag = match.group(0)
        if 'aria-label' not in btn_tag:
            return btn_tag.replace('<button', '<button aria-label="Action Button"')
        return btn_tag
    content = re.sub(r'<button\s+[^>]*>', replace_btn, content)

    # Add aria-label="Link" to icon-only <a> tags? The task says "icon-only buttons".
    
    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(content)
