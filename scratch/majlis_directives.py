import os
import re

file_path = r"d:\Saeed Furniture\frontend\majlis.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Phase 2: The "Back Button" Routing Fix
# The old one might be `<a href="/index.html" class="absolute top-28 left-8 ... ← RETURN TO HUB</a>`
# Let's just find `← RETURN TO HUB` anchor and replace it.
new_back_button = """<a href="/index.html" class="absolute top-28 left-8 z-50 flex items-center gap-2 text-stone-300 hover:text-amber-500 transition-colors duration-500 bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm text-sm tracking-widest border border-white/10">← RETURN TO HUB</a>"""
content = re.sub(
    r'<a href="/index\.html"[^>]*>← RETURN TO HUB</a>',
    new_back_button,
    content
)

# Phase 3: Internal Portfolio Routing
# 1. Ensure scroll-smooth is on html tag (already done, but verify).
if 'scroll-smooth' not in content[:200]:
    content = content.replace('<html', '<html class="scroll-smooth"', 1)

# 2. Inject minimalist routing anchor under 100vh Hero section
new_routing_anchor = """<a href="#portfolio" class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400 hover:text-amber-500 transition-colors duration-500 z-40">
<span class="text-xs tracking-[0.2em] uppercase">Explore the Portfolio</span>
<svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
</a>"""
# Find existing `Explore the Portfolio` anchor and replace it
content = re.sub(
    r'<a href="#portfolio"[^>]*>\s*<span[^>]*>Explore the Portfolio</span>\s*<svg[^>]*>.*?</svg>\s*</a>',
    new_routing_anchor,
    content,
    flags=re.DOTALL
)

# 3. Ensure the portfolio section is wrapped in `<section id="portfolio" class="min-h-screen py-20 bg-stone-900">`
# Right now, there is `<div class="bg-[#f5ede0] min-h-screen">` containing the portfolio, 
# or `<div class="w-full" x-data="portfolioApp()" x-init="init()">`
# Let's replace the portfolio container.
content = content.replace('<div class="bg-[#f5ede0] min-h-screen">', '<section id="portfolio" class="min-h-screen py-20 bg-stone-900">')
# If the previous replace didn't work because it doesn't exist, try the other one:
content = content.replace('<div class="w-full" x-data="portfolioApp()" x-init="init()">', '<section id="portfolio" class="min-h-screen py-20 bg-stone-900 w-full" x-data="portfolioApp()" x-init="init()">')

# Clean up duplicated <html>, <head>, <body> tags inside the portfolio string if they exist.
content = re.sub(r'CTYPE html>\s*<html[^>]*>\s*<head>.*?</head>\s*<body[^>]*>', '', content, flags=re.DOTALL | re.IGNORECASE)
content = re.sub(r'</body>\s*</html>', '', content, flags=re.IGNORECASE)

# Also remove the duplicate `pf-header` inside portfolio since we have global header
content = re.sub(r'<header class="pf-header">.*?</header>', '', content, flags=re.DOTALL)

# Phase 4: Reference Sharing Feature
share_button = """
            <a href="https://wa.me/?text=Explore%20the%20Majlis%20Collection%20by%20Saeed%20Furniture:%20https://saeedfurniture.com/majlis.html" target="_blank" class="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-stone-400 hover:text-green-500 transition-colors duration-500 border border-stone-700 hover:border-green-500 px-4 py-2 rounded-sm mt-3 w-full justify-center">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Share Collection
            </a>"""
# Inject into pf-card-bottom right after </button>
content = content.replace("</button>\n          </div>", f"</button>{share_button}\n          </div>")

# Phase 5: Elegance and Aesthetics 
# Because we changed portfolio to bg-stone-900, we should ensure the title text is legible (white/gold)
content = content.replace('color: var(--brown);', 'color: rgba(245,237,224,0.95);')
content = content.replace('color: var(--muted);', 'color: rgba(245,237,224,0.6);')
content = content.replace('background: var(--sand-2);', 'background: #1a1a1a;')

# Make the contrast gradient behind the header more prominent
gradient = '<div class="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none"></div>'
if gradient not in content:
    content = content.replace('<div class="relative z-10 flex flex-col h-full">', f'<div class="relative z-10 flex flex-col h-full">\n  {gradient}')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Majlis HTML updated successfully.")
