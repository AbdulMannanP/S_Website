import os

def double_check_header():
    file = r'js/components/header.js'
    if not os.path.exists(file): 
        print("Not found:", file)
        return
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply RTL lock to the logo container to ensure the icon and text don't swap places
    old_logo = """<a href="/index.html" class="h-12 flex items-center gap-3 transition-transform duration-500 hover:scale-105 flex-shrink-0">"""
    new_logo = """<a href="/index.html" class="h-12 flex items-center gap-3 transition-transform duration-500 hover:scale-105 flex-shrink-0 rtl:flex-row-reverse">"""
    if old_logo in content:
        content = content.replace(old_logo, new_logo)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched logo container in header.js")

if __name__ == '__main__':
    double_check_header()
