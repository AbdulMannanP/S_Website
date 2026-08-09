import glob
import re

def cache_bust():
    html_files = glob.glob('frontend/*.html')
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        orig = content
        
        # Replace app.js
        content = re.sub(r'src="(/?)js/app\.js(\?v=\d+)?"', r'src="\1js/app.js?v=6"', content)
        # Replace header.js
        content = re.sub(r'src="(/?)js/components/header\.js(\?v=\d+)?"', r'src="\1js/components/header.js?v=6"', content)
        # Replace auth.js
        content = re.sub(r'src="(/?)js/auth\.js(\?v=\d+)?"', r'src="\1js/auth.js?v=6"', content)
        # Replace react bundle
        content = re.sub(r'src="(/?)dist/react-bundle\.js(\?v=\d+)?"', r'src="\1dist/react-bundle.js?v=6"', content)

        if content != orig:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Busted {file}")

if __name__ == '__main__':
    cache_bust()
