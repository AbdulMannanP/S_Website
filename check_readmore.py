import os
import glob
import re

found = False
for filepath in glob.glob('frontend/**/*.html', recursive=True):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            if re.search(r'read more|show more', content, re.IGNORECASE):
                print(f"Found in {filepath}")
                found = True
    except: pass
if not found: print("None found")
