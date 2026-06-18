import re

filepath = 'd:/Saeed Furniture/frontend/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all SVGs
svgs = re.findall(r'(<svg[\s\S]*?</svg>)', content)
print(f"Found {len(svgs)} SVGs")

# Let's count how long they are to find the 'large' ones
for i, svg in enumerate(svgs):
    print(f"SVG {i}: {len(svg)} chars")
