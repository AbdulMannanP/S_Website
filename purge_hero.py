import re
import codecs

path = r'd:\Saeed Furniture\frontend\index.html'

with codecs.open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Start by isolating the hero section
start_marker = '<!-- ══ IMMERSIVE CHRONOLOGICAL HUB ═══════════════════════════════════ -->'
end_marker = '<!-- ══ USP GRID SECTION ════════════════════════════════ -->'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    hero_section = content[start_idx:end_idx]

    # Phase 1: Header Unification & Text Purge
    # Find the text overlay block (LAYER 2)
    # The text overlay block has "Crafting Luxury" and the button.
    # We want to remove the text, but keep the button for Phase 2.
    # So we'll remove the entire Layer 2 block and recreate the button in a new Layer 2.

    # Extract Layer 2 block
    layer2_pattern = r'<!-- LAYER 2: Text Overlays -->(.*?)<!-- LAYER 3:'
    match = re.search(layer2_pattern, hero_section, re.DOTALL)
    if match:
        old_layer2 = match.group(1)
        hero_section = hero_section.replace(old_layer2, '\n      <!-- LAYER 2: Floating CTA -->\n      <button class="pointer-events-auto absolute bottom-10 left-1/2 transform -translate-x-1/2 z-40 px-8 py-4 bg-[#c9a96e] text-stone-950 font-bold tracking-[0.2em] uppercase rounded-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all">\n        Start Your Journey\n      </button>\n\n      ')
    else:
        # If it doesn't match perfectly, just use string replacement for the text
        hero_section = re.sub(r'<h2[^>]*>Crafting Luxury</h2>', '', hero_section)
        hero_section = re.sub(r'<h1[^>]*>Tailored for<br>Your Majlis</h1>', '', hero_section)
        hero_section = re.sub(r'<p[^>]*>.*?EXPLORE OUR COLLECTION.*?</p>', '', hero_section, flags=re.DOTALL)

        # Phase 2: The Floating CTA Anchor
        # Replace the CTA classes
        old_btn_classes = r'pointer-events-auto px-8 py-4 bg-\[#c9a96e\] text-stone-950 font-bold tracking-\[0\.2em\] uppercase rounded-sm hover:scale-105 hover:shadow-\[0_0_20px_rgba\(201,169,110,0\.4\)\] transition-all'
        new_btn_classes = r'pointer-events-auto absolute bottom-10 left-1/2 transform -translate-x-1/2 z-40 px-8 py-4 bg-[#c9a96e] text-stone-950 font-bold tracking-[0.2em] uppercase rounded-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all'
        hero_section = hero_section.replace(old_btn_classes, new_btn_classes)
        
        # And remove the absolute/top-1/3 wrapper from the CTA
        hero_section = hero_section.replace('<div class="absolute top-1/3 left-8 max-w-3xl z-40 pointer-events-none">', '<div class="z-40 pointer-events-none">')

    # Phase 3: Hub Dimensions & Hover Labels
    # Ensure hero has h-screen
    if 'h-screen' not in hero_section:
        hero_section = hero_section.replace('id="hero"\n             class="', 'id="hero"\n             class="h-screen ')

    content = content[:start_idx] + hero_section + content[end_idx:]

# Ensure duplicate headers are purged (just in case they returned or are outside hero)
# We already deleted the main legacy header in previous step, so we have only one header now.

# Phase 4: Below-the-Fold Content Restoration
# Ensure USP has generous top margin/padding.
# The USP section starts right at end_marker
usp_pattern = r'<section id="usp" class="([^"]*)"'
def replace_usp_padding(match):
    classes = match.group(1)
    if 'mt-24' not in classes:
        classes = classes + ' mt-24'
    return f'<section id="usp" class="{classes}"'

content = re.sub(usp_pattern, replace_usp_padding, content)

with codecs.open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Minimalist purge complete.")
