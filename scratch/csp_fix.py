import os
import re

def purge_scripts(html):
    # Remove script tags matching anime, gsap, ScrollTrigger, cdnjs
    html = re.sub(r'<script[^>]*cdnjs\.cloudflare\.com[^>]*></script>', '', html)
    html = re.sub(r'<script[^>]*anime\.min\.js[^>]*></script>', '', html)
    html = re.sub(r'<script[^>]*gsap\.min\.js[^>]*></script>', '', html)
    html = re.sub(r'<script[^>]*ScrollTrigger\.min\.js[^>]*></script>', '', html)
    return html

def fix_svg_routing(html):
    # Find polygons in SVG and wrap them in <a> tags, remove @click/onclick.
    # The polygons have id="poly-..." and data-target="..."
    # We will just replace them directly.
    replacements = [
        (
            r'<polygon id="poly-majlis"([^>]*?)onclick="window\.location\.href=\'/majlis\.html\'"([^>]*?)@click="[^"]*"([^>]*?)/>',
            r'<a href="/majlis.html"><polygon id="poly-majlis"\1\2\3/></a>'
        ),
        (
            r'<polygon id="poly-majlis"([^>]*?)onclick="window\.location\.href=\'/majlis\.html\'"([^>]*?)/>',
            r'<a href="/majlis.html"><polygon id="poly-majlis"\1\2/></a>'
        ),
        (
            r'<polygon id="poly-kitchens"([^>]*?)onclick="window\.location\.href=\'/kitchen\.html\'"([^>]*?)/>',
            r'<a href="/kitchen.html"><polygon id="poly-kitchens"\1\2/></a>'
        ),
        (
            r'<polygon id="poly-cots"([^>]*?)onclick="window\.location\.href=\'/cot\.html\'"([^>]*?)/>',
            r'<a href="/cot.html"><polygon id="poly-cots"\1\2/></a>'
        ),
        (
            r'<polygon id="poly-bedroom"([^>]*?)onclick="window\.location\.href=\'/bedroom\.html\'"([^>]*?)/>',
            r'<a href="/bedroom.html"><polygon id="poly-bedroom"\1\2/></a>'
        ),
        (
            r'<polygon id="poly-almirah"([^>]*?)onclick="window\.location\.href=\'/almirah\.html\'"([^>]*?)/>',
            r'<a href="/almirah.html"><polygon id="poly-almirah"\1\2/></a>'
        )
    ]
    for pattern, repl in replacements:
        html = re.sub(pattern, repl, html)
        
    # Also strip any remaining x-on:click or @click
    html = re.sub(r'<a href="/(.*?)\.html"><polygon([^>]*?)@click="[^"]*"([^>]*?)/></a>', r'<a href="/\1.html"><polygon\2\3/></a>', html)
    return html

def clean_old_nodes(html):
    # Old nodes start with <!-- ── NODE: Kitchen Showroom (or Majlis, but Majlis was already deleted)
    node_pattern = re.compile(r'<!-- ── NODE:.*?</body>', re.DOTALL)
    # Be careful not to delete </body>
    match = node_pattern.search(html)
    if match:
        html = html[:match.start()] + '\n</body>'
    return html

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    html = purge_scripts(html)
    if 'index.html' in filepath:
        html = fix_svg_routing(html)
        html = clean_old_nodes(html)
    else:
        html = clean_old_nodes(html)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Processed {filepath}")

files = ['frontend/index.html', 'frontend/majlis.html', 'frontend/kitchen.html', 'frontend/bedroom.html', 'frontend/cot.html', 'frontend/almirah.html']
for f in files:
    process_file(f)

print("Done phase 1, 2, 3")
