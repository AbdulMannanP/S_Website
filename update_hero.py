import re
import codecs

path = r'd:\Saeed Furniture\frontend\index.html'

with codecs.open(path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '    <!-- ══ IMMERSIVE CHRONOLOGICAL HUB ═══════════════════════════════════ -->'
end_marker = '    <!-- ══ USP GRID SECTION ════════════════════════════════ -->'
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    hero_section = content[start_idx:end_idx]
    
    # Phase 1: Strip Masks & Restore Full Image Visibility
    hero_section = hero_section.replace('bg-stone-950', '')
    hero_section = hero_section.replace('bg-black', '')
    
    # Fix images
    hero_section = re.sub(
        r'class="absolute inset-0 w-full h-full object-cover object-center"',
        r'class="absolute inset-0 w-full h-full object-cover z-0"',
        hero_section
    )
    # Remove any opacity or transitions on the images
    hero_section = re.sub(r'style="transition:opacity[^"]*"', '', hero_section)
    hero_section = re.sub(r':style="\'opacity:\'[^\"]*"', '', hero_section)
    
    # Also remove the atmospheric vignette as it's an opacity altering wrapper 
    hero_section = re.sub(
        r'<!-- Atmospheric vignette.*?</div>',
        '',
        hero_section,
        flags=re.DOTALL
    )

    # Phase 2: Force Absolute SVG Transparency
    # SVG overlay container
    hero_section = re.sub(
        r'<svg class="absolute inset-0 w-full h-full".*?viewBox="0 0 100 100"',
        r'<svg class="absolute inset-0 w-full h-full z-10 pointer-events-none"\n           viewBox="0 0 100 100"',
        hero_section,
        flags=re.DOTALL
    )
    
    # Polygons
    hero_section = re.sub(
        r':fill="[^"]*"',
        r'fill="transparent" stroke="none"',
        hero_section
    )
    hero_section = re.sub(
        r'style="cursor:pointer; pointer-events:all; transition:fill 300ms ease;"',
        r'class="cursor-pointer" pointer-events="auto"',
        hero_section
    )

    # Phase 3: Elevate and Isolate Labels
    hero_section = re.sub(
        r'style="z-index:30;\s*left:(\d+%);\s*top:(\d+%);\s*transition:transform 300ms ease;"',
        r'class="z-20" style="left:\1; top:\2; transition:transform 300ms ease;"',
        hero_section
    )

    content = content[:start_idx] + hero_section + content[end_idx:]
    
    with codecs.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Hero section updated")
else:
    print("Could not find hero section")
