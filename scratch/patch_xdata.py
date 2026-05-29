import glob
import re

for path in glob.glob('frontend/*.html'):
    if 'index.html' not in path and 'auth.html' not in path and 'portfolio.html' not in path:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add x-data="saeedApp()" if not present
        if 'x-data="saeedApp()"' not in content:
            content = re.sub(r'<body([^>]*)>', r'<body\1 x-data="saeedApp()">', content)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
        print(f"Patched {path}")
