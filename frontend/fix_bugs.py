import os
import glob
import re

def fix_files():
    html_files = glob.glob('*.html')
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # 1. Fix the body tag leak
        leak_pattern = re.compile(r'(@scroll\.window="scrolled = \(window\.pageYOffset >)\s*<div id="global-header"></div>\s*(50\);.*?lastScroll = curr;")', re.DOTALL)
        
        if leak_pattern.search(content):
            content = leak_pattern.sub(r'\1 \2', content)
            
            body_tag_end = re.compile(r'(<body[^>]*>)')
            content = body_tag_end.sub(r'\1\n  <div id="global-header"></div>', content, count=1)

        # 2. Eradicate Custom Cursor
        content = re.sub(r'<div id="customCursor"[^>]*></div>', '', content)
        content = re.sub(r'\bcursor-none\b', '', content)
        content = re.sub(r'\bcursor-bound\b', '', content)
        
        content = re.sub(r'\.custom-cursor\s*\{[^}]*\}', '', content)
        content = re.sub(r'@media\s*\([^)]*\)\s*\{\s*\.custom-cursor\s*\{[^}]*\}\s*\.cursor-bound\s*\{[^}]*\}\s*\}', '', content)
        content = re.sub(r'\.custom-cursor\.active\s*\{[^}]*\}', '', content)
        
        if content != original_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed {file}")

if __name__ == '__main__':
    fix_files()
