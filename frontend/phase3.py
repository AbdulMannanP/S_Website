import os
import re

for root, dirs, files in os.walk('d:/Saeed Furniture/frontend'):
    if 'node_modules' in root: continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
            
            # Unify logo CSS globally
            def replace_logo_filter(match):
                img_tag = match.group(0)
                # Ensure we only touch it if it's a logo
                if 'logo' in img_tag.lower():
                    # Replace whatever filter is inside style="..." with the unified one
                    return re.sub(r'style="filter:\s*[^"]+"', 'style="filter: invert(1) sepia(1) saturate(1.5) hue-rotate(5deg) brightness(1.2);"', img_tag)
                return img_tag
            content = re.sub(r'<img\s+[^>]*src="[^"]*logo\.png[^>]*>', replace_logo_filter, content)

            # Strip rigid px widths
            content = re.sub(r'\bw-\[1000px\]\b', 'w-full max-w-screen-xl', content)
            content = re.sub(r'\bw-\[1400px\]\b', 'w-full max-w-screen-xl', content)
            content = re.sub(r'\bmax-w-\[1000px\]\b', 'w-full max-w-screen-xl', content)
            content = re.sub(r'\bmax-w-\[1400px\]\b', 'w-full max-w-screen-xl', content)

            # Change static paddings to responsive
            content = re.sub(r'(?<!md:)(?<!sm:)(?<!lg:)(?<!xl:)\bpy-32\b', 'py-12 md:py-32', content)
            content = re.sub(r'(?<!md:)(?<!sm:)(?<!lg:)(?<!xl:)\bpy-24\b', 'py-10 md:py-24', content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
print("Finished Phase 3 layout and style sweeps")
