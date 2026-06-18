import os
import re

for root, dirs, files in os.walk('d:/Saeed Furniture/frontend'):
    if 'node_modules' in root: continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
            
            # Find script tags with src but no defer or async
            def add_defer(match):
                script_tag = match.group(0)
                if 'defer' not in script_tag and 'async' not in script_tag:
                    return script_tag.replace('<script ', '<script defer ')
                return script_tag
                
            new_content = re.sub(r'<script\s+[^>]*src=[^>]*>', add_defer, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Added defer to scripts in {file}')
