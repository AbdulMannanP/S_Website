import glob
import re

def fix_alpine_state():
    html_files = glob.glob('frontend/*.html')
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        orig = content
        
        # We look for x-data="{...}" that is missing headerHidden and lastScroll but has @scroll.window 
        # Actually, let's just find `x-data="{` and check if it lacks headerHidden, then insert it.
        # But wait, some files might have multiple x-data (e.g. modals).
        # We only want to target the body's x-data.
        
        # Match body tag with inline x-data
        match = re.search(r'<body[^>]*x-data="{(.*?)}"[^>]*>', content)
        if match:
            inner_xdata = match.group(1)
            if 'headerHidden' not in inner_xdata:
                # Add it!
                new_inner = inner_xdata.strip()
                if new_inner and not new_inner.endswith(','):
                    new_inner += ','
                new_inner += " headerHidden: false, lastScroll: window.pageYOffset || 0 "
                
                # Replace just that specific match
                old_body = match.group(0)
                new_body = old_body.replace('x-data="{' + match.group(1) + '}"', 'x-data="{' + new_inner + '}"')
                content = content.replace(old_body, new_body)

        if content != orig:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Patched {file}")

if __name__ == '__main__':
    fix_alpine_state()
