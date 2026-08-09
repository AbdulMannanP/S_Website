import glob
import re

def fix_leak():
    html_files = glob.glob('*.html')
    
    # The pattern matches: @scroll.window="scrolled = (window.pageYOffset > \n <div id="global-header"></div> 50); let curr = window.pageYOffset; headerHidden = (curr > lastScroll && curr > 100); lastScroll = curr;" (including any classes or other attributes up to the closing `>`)
    pattern = re.compile(r'(@scroll\.window="scrolled = \(window\.pageYOffset >)\s*<div id="global-header"></div>\s*(50\); let curr = window\.pageYOffset; headerHidden = \(curr > lastScroll && curr > 100\); lastScroll = curr;"[^>]*>)')
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        orig = content
        
        if pattern.search(content):
            content = pattern.sub(r'\1 \2\n  <div id="global-header"></div>', content)
            
        if content != orig:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed leak in {file}")

if __name__ == '__main__':
    fix_leak()
