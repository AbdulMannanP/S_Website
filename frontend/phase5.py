import os
import re

filepath = 'd:/Saeed Furniture/frontend/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace SVG Legacy Links
content = content.replace('href="/majlis.html"', 'href="/showroom.html?category=type_modern_floor_majlis"')
content = content.replace('href="/bedroom.html"', 'href="/showroom.html?category=type_elevated_contemporary"')
content = content.replace('href="/kitchen.html"', 'href="/showroom.html?category=type_tub_style_hybrid"')
content = content.replace('href="/cot.html"', 'href="/showroom.html?category=type_elevated_contemporary"')
content = content.replace('href="/almirah.html"', 'href="/showroom.html?category=type_tub_style_hybrid"')

# Replace IMAGE_BASE_URL + 'images/logo.png' with explicit ImageKit URL for initial render safety
content = re.sub(r':src="IMAGE_BASE_URL\s*\+\s*\'images/logo\.png\'"', 'src="https://ik.imagekit.io/de7qvcvqv/images/logo.png"', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

# We should also do this for select.html
filepath_sel = 'd:/Saeed Furniture/frontend/select.html'
with open(filepath_sel, 'r', encoding='utf-8') as f:
    content_sel = f.read()
content_sel = re.sub(r':src="IMAGE_BASE_URL\s*\+\s*\'images/logo\.png\'"', 'src="https://ik.imagekit.io/de7qvcvqv/images/logo.png"', content_sel)
with open(filepath_sel, 'w', encoding='utf-8') as f:
    f.write(content_sel)

print("Phase 5 routing and bindings updated")
