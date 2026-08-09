import os
import glob
import re

files = glob.glob('*.html')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    match = re.search(r'<section\s+[^>]*class="([^"]*)"', content)
    if match:
        old_classes = match.group(1)
        if 'pt-[100px]' not in old_classes:
            new_classes = old_classes + " pt-[100px] md:pt-[120px]"
            
            content = content[:match.start(1)] + new_classes + content[match.end(1):]
            print(f'Updated {f} first section with pt-[100px]')
            with open(f, 'w', encoding='utf-8') as out:
                out.write(content)
