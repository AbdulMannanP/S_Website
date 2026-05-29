import re
import codecs

path = r'd:\Saeed Furniture\frontend\index.html'

with codecs.open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Isolate Hero Section
start_marker = '<!-- ══ IMMERSIVE CHRONOLOGICAL HUB ═══════════════════════════════════ -->'
end_marker = '<!-- ══ USP GRID SECTION ════════════════════════════════ -->'
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    hero_section = content[start_idx:end_idx]

    # Remove LAYER 1: Header
    header_pattern = r'<!-- LAYER 1: Header -->(.*?)<!-- LAYER 2:'
    hero_section = re.sub(header_pattern, '<!-- LAYER 2:', hero_section, flags=re.DOTALL)
    
    # Remove LAYER 4: Floating Labels
    labels_pattern = r'<!-- LAYER 4: Floating Labels -->(.*?)</section>'
    hero_section = re.sub(labels_pattern, '</section>', hero_section, flags=re.DOTALL)

    content = content[:start_idx] + hero_section + content[end_idx:]

with codecs.open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed Header and Floating Labels from Hero section.")
