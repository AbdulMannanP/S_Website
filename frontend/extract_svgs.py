import re
import os
import uuid

filepath = 'd:/Saeed Furniture/frontend/index.html'
sprite_path = 'd:/Saeed Furniture/frontend/images/sprite.svg'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

svgs = re.findall(r'(<svg([\s\S]*?)</svg>)', content)

sprite_symbols = []
icon_counter = 1

for full_svg, inner_content in svgs:
    # We only extract if it's over 100 chars and doesn't have Alpine.js bindings on the <svg> root
    if len(full_svg) > 100 and 'x-show' not in full_svg.split('>')[0]:
        icon_id = f"icon-{icon_counter}"
        icon_counter += 1
        
        # Extract viewBox
        viewbox_match = re.search(r'viewBox="([^"]+)"', full_svg)
        viewbox = viewbox_match.group(1) if viewbox_match else "0 0 24 24"
        
        # Create symbol
        # Inner content is full_svg minus the opening <svg ...> and closing </svg>
        inner_paths = re.sub(r'^<svg[^>]*>', '', full_svg)
        inner_paths = re.sub(r'</svg>$', '', inner_paths)
        
        symbol = f'<symbol id="{icon_id}" viewBox="{viewbox}">{inner_paths}</symbol>'
        sprite_symbols.append(symbol)
        
        # Extract original classes to put on the use tag
        class_match = re.search(r'class="([^"]+)"', full_svg.split('>')[0])
        classes = class_match.group(1) if class_match else ""
        
        # Extract fill, stroke, width, height to maintain layout
        fill_match = re.search(r'fill="([^"]+)"', full_svg.split('>')[0])
        fill = fill_match.group(1) if fill_match else "currentColor"
        
        stroke_match = re.search(r'stroke="([^"]+)"', full_svg.split('>')[0])
        stroke = stroke_match.group(1) if stroke_match else "none"
        
        w_match = re.search(r'width="([^"]+)"', full_svg.split('>')[0])
        w = f'width="{w_match.group(1)}"' if w_match else ""
        
        h_match = re.search(r'height="([^"]+)"', full_svg.split('>')[0])
        h = f'height="{h_match.group(1)}"' if h_match else ""
        
        # Replace in HTML
        replacement = f'<svg class="{classes}" fill="{fill}" stroke="{stroke}" {w} {h}><use href="/images/sprite.svg#{icon_id}"></use></svg>'
        content = content.replace(full_svg, replacement, 1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

sprite_content = f'''<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  {''.join(sprite_symbols)}
</svg>'''

with open(sprite_path, 'w', encoding='utf-8') as f:
    f.write(sprite_content)

print(f"Extracted {icon_counter - 1} SVGs to sprite.svg")
