import re

def fix_react_cursor():
    file = r'src/react/Majlis.jsx'
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove the CustomCursor component definition (lines 88-129 approx)
    content = re.sub(r'const CustomCursor = \(\{.*?\}\);', '', content, flags=re.DOTALL)
    
    # Alternatively, just match it up to the ImageKitLQIP component
    content = re.sub(r'const CustomCursor =.*?// ImageKit LQIP with Blur-Up', '// ImageKit LQIP with Blur-Up', content, flags=re.DOTALL)
    
    # 2. Remove the CustomCursor invocation
    content = re.sub(r'<CustomCursor[^>]*/>', '', content)
    
    # 3. Remove all cursor logic from class strings:
    # `cursor-none`
    # `cursor-crosshair`
    # `isTouchDevice ? 'cursor-auto' : 'cursor-none'` -> `cursor-auto`
    # `isTouchDevice ? 'cursor-pointer' : 'cursor-none'` -> `cursor-pointer`
    # `isTouchDevice ? 'cursor-pointer' : 'cursor-pointer'` -> `cursor-pointer`
    
    content = content.replace("isTouchDevice ? 'cursor-auto' : 'cursor-none'", "'cursor-auto'")
    content = content.replace("isTouchDevice ? 'cursor-pointer' : 'cursor-none'", "'cursor-pointer'")
    content = content.replace("isTouchDevice ? 'cursor-pointer' : 'cursor-pointer'", "'cursor-pointer'")
    content = content.replace("cursor-crosshair", "cursor-pointer")
    content = content.replace("cursor-none", "")

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed Majlis.jsx cursor")

if __name__ == '__main__':
    fix_react_cursor()
