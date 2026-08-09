import os
import glob
import re

def encapsulate_header():
    # 1. Update header.js
    header_file = r'frontend/js/components/header.js'
    if os.path.exists(header_file):
        with open(header_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Wrap HEADER_HTML in an isolated x-data component
        # We need to find the start of HEADER_HTML string and the end.
        
        # It looks like: const HEADER_HTML = `\n    <!-- ... -->\n    <header...
        # We'll replace the starting `<header` with our wrapper, and the ending `</div>` of the overlay with `</div></div>`
        
        # First, add the wrapper
        wrapper_start = """<div x-data="{ mobileMenuOpen: false, headerHidden: false, lastScroll: window.pageYOffset || 0 }" @scroll.window="let curr = window.pageYOffset; headerHidden = (curr > lastScroll && curr > 100); lastScroll = curr;">\n    <header"""
        
        content = content.replace('<header', wrapper_start, 1)
        
        # Then, close the wrapper at the very end of the string
        # Find the last </div> before the closing backtick
        content = re.sub(r'(</div>\s*)`;', r'\1  </div>`;', content)
        
        with open(header_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Encapsulated header.js")

    # 2. Strip @scroll.window from all HTML files to prevent conflicts and errors
    html_files = glob.glob('frontend/*.html')
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        # Remove @scroll.window completely from body tags
        html = re.sub(r'@scroll\.window="[^"]+"', '', html)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Stripped @scroll from {file}")

if __name__ == '__main__':
    encapsulate_header()
