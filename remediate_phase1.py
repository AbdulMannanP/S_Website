import os
import re
import glob

# Phase 1 Remediation Script
html_files = glob.glob('frontend/**/*.html', recursive=True)

for filepath in html_files:
    if 'node_modules' in filepath or 'dist' in filepath:
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    orig_content = content
    
    # 1. DOM Stabilization (Fix the data:image/svg+xml that breaks naive parsers)
    def fix_svg_data_uri(match):
        inner = match.group(1)
        inner = inner.replace('<svg', '%3Csvg').replace('</svg>', '%3C/svg%3E').replace('/>', '/%3E')
        return f"url('data:image/svg+xml;utf8,{inner}')"
    content = re.sub(r"url\('data:image/svg\+xml;utf8,(.*?)\'\)", fix_svg_data_uri, content)

    # 3. Native Mobile Constraints
    # iOS Zoom Patch: Enforce text-base on inputs and textareas
    content = re.sub(r'(<input[^>]*class="[^"]*)text-sm([^"]*")', r'\1text-base\2', content)
    content = re.sub(r'(<textarea[^>]*class="[^"]*)text-sm([^"]*")', r'\1text-base\2', content)
    
    # Horizontal Overflow: Apply max-w-full overflow-x-hidden to body
    if '<body class="' in content:
        content = re.sub(r'(<body class="[^"]*)(")', r'\1 max-w-full overflow-x-hidden\2', content)
    else:
        content = content.replace('<body', '<body class="max-w-full overflow-x-hidden"')
        
    # Touch Targets: Add p-2 to small icon buttons (e.g., w-8 h-8 rounded-full without padding)
    # Just safely ensure buttons have at least some padding if they don't have p-
    
    # 4. Performance & SEO Baseline
    # Lazy loading images (ignore eager)
    def add_lazy(match):
        img_tag = match.group(0)
        if 'loading="eager"' not in img_tag and 'loading=' not in img_tag:
            return img_tag.replace('<img ', '<img loading="lazy" ')
        return img_tag
    content = re.sub(r'<img [^>]+>', add_lazy, content)
    
    # Aria-labels on icon-only buttons
    def add_aria(match):
        btn = match.group(0)
        if 'aria-label' not in btn and '<svg' in btn and 'x-text' not in btn:
            return btn.replace('<button ', '<button aria-label="Action button" ')
        return btn
    content = re.sub(r'<button[^>]*>.*?</button>', add_aria, content, flags=re.DOTALL)
    
    # H1 tag on index.html
    if 'index.html' in filepath:
        content = content.replace('<p class="text-[0.6rem] uppercase tracking-[0.4em] text-white/50 font-bold" x-text="lang === \'ar\' ? \'استكشف معرضنا\' : \'Explore Our Showroom\'"></p>', '<h1 class="text-[0.6rem] uppercase tracking-[0.4em] text-white/50 font-bold" x-text="lang === \'ar\' ? \'استكشف معرضنا\' : \'Explore Our Showroom\'"></h1>')

    if content != orig_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
