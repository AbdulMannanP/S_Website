import os

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Phase 1: Patch Alpine hoverTarget Crash & Hardcode Routing
# Add x-data="{ hoverTarget: null }" to the root wrapper of the Master Hub (the <main> element)
if 'x-data="{ hoverTarget: null }"' not in html:
    html = html.replace('<main class="transition-all duration-500 pt-20" x-show="!loading" x-cloak>',
                        '<main class="transition-all duration-500 pt-20" x-show="!loading" x-cloak x-data="{ hoverTarget: null }">')

# Replace Alpine @click state routing with <a> tags or onclick
# Majlis
html = html.replace("@click=\"activeShowroom = 'majlis'; window.scrollTo({top:0})\"", "onclick=\"window.location.href='/majlis.html'\"")
# Kitchen
html = html.replace("@click=\"activeShowroom = 'kitchen'; window.scrollTo({top:0})\"", "onclick=\"window.location.href='/kitchen.html'\"")
# Cot
html = html.replace("@click=\"activeShowroom = 'cot'; window.scrollTo({top:0})\"", "onclick=\"window.location.href='/cot.html'\"")
# Bedroom
html = html.replace("@click=\"activeShowroom = 'bedroom'; window.scrollTo({top:0})\"", "onclick=\"window.location.href='/bedroom.html'\"")
# Almirah
html = html.replace("@click=\"activeShowroom = 'almirah'; window.scrollTo({top:0})\"", "onclick=\"window.location.href='/almirah.html'\"")

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Phase 1 complete: patched hoverTarget on <main> and hardcoded routing.")
