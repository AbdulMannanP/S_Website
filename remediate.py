import re
import codecs

path = r'd:\Saeed Furniture\frontend\index.html'

with codecs.open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Kill Slow Scroll (Lenis/Locomotive)
content = re.sub(r'<script src="https://cdn\.jsdelivr\.net/gh/studio-freight/lenis@1\.0\.29/bundled/lenis\.min\.js"></script>', '', content)
# Remove lenis initialization if any (usually I put it at the bottom)
content = re.sub(r'const lenis = new Lenis[\s\S]*?requestAnimationFrame\(raf\);', '', content)
# Remove smooth scroll CSS if present
content = re.sub(r'scroll-behavior:\s*smooth;?', '', content)

# 2. Purge Duplicate Headers
# Let's find the legacy header. The legacy header might be <header id="main-header" ... or similar.
# The new header is inside <section id="hero">. We want to remove the one OUTSIDE the hero.
# Looking for `<header id="header"` or something similar.
legacy_header_pattern = r'<header id="header".*?</header>'
content = re.sub(legacy_header_pattern, '', content, flags=re.DOTALL)
legacy_header2 = r'<header class="fixed top-0.*?w-full.*?z-\[60\].*?</header>'
content = re.sub(legacy_header2, '', content, flags=re.DOTALL)

# 3. Force Root Background
# Ensure body has bg-stone-950
if 'class="bg-stone-950' not in content:
    content = content.replace('<body class="', '<body class="bg-stone-950 ')
elif 'bg-stone-950' not in content:
    content = content.replace('<body ', '<body class="bg-stone-950" ')

# 4. Audit Image Sourcing
content = content.replace('Day_room_Hero.jpg', 'hero.png?v=2')
content = content.replace('Night_room_Hero.jpg', 'modern.png?v=2')

# 5. Z-Index & Layout Realignment
# Fix the text overlay container in the hero section:
old_text_container = r'<div class="absolute top-1/4 left-0 w-full px-8 md:px-16 z-40 pointer-events-none">'
new_text_container = r'<div class="absolute top-1/3 left-8 max-w-3xl z-40 pointer-events-none">'
content = content.replace(old_text_container, new_text_container)

# Change SVG z-index to 10 if it's currently 20
old_svg = r'<svg class="absolute inset-0 w-full h-full z-20 pointer-events-none"'
new_svg = r'<svg class="absolute inset-0 w-full h-full z-10 pointer-events-none"'
content = content.replace(old_svg, new_svg)

with codecs.open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Remediation complete.")
