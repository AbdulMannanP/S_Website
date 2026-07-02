import os
import glob
import re

terms = ['navigator.share', 'whatsapp', 'navigator.vibrate', 'skeleton', 'tel:', 'mailto:', 'pull', 'localStorage', 'sticky', 'prefers-color-scheme']

for t in terms:
    print(f"\n--- {t} ---")
    found = False
    for filepath in glob.glob('frontend/**/*.*', recursive=True):
        if 'node_modules' in filepath or 'dist' in filepath or '.jpg' in filepath or '.png' in filepath: continue
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                if re.search(t, content, re.IGNORECASE):
                    print(f"Found in {filepath}")
                    found = True
        except: pass
    if not found: print("None found")
