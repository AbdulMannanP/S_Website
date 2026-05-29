import os
import glob
import re

frontend_dir = r"d:\Saeed Furniture\frontend"
html_files = glob.glob(os.path.join(frontend_dir, "*.html"))

# We will read each file, modify it, and write it back.
for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Phase 1: Enforce UTF-8 Global Headers
    # 1. Ensure <meta charset="UTF-8"> is the absolute first tag inside <head>
    # First, let's remove any existing <meta charset="UTF-8"> or <meta charset="utf-8"> to avoid duplicates
    content = re.sub(r'<\s*meta\s+charset\s*=\s*["\']UTF-8["\']\s*/?>', '', content, flags=re.IGNORECASE)
    # Then inject it right after <head>
    content = re.sub(r'(<head>)', r'\1\n  <meta charset="UTF-8">', content, flags=re.IGNORECASE)
    
    # 2. Update <html> tag to bind dynamically to our Alpine state for proper RTL rendering
    # <html :lang="lang" :dir="lang === 'ar' ? 'rtl' : 'ltr'">
    # The existing html tag might be <html lang="en"> or <html x-data=...>
    # We will replace <html ...> with <html :lang="lang" :dir="lang === 'ar' ? 'rtl' : 'ltr'">
    # Wait, some pages have x-data on html, some on body. If we just replace it, we might lose x-data on html!
    # Let's inspect index.html, about.html, etc.
    # Actually, about.html has <html lang="en" x-data="{ lang: 'en', menuOpen: false }" :class="lang === 'ar' ? 'dir-rtl' : ''">
    # Let's just add the attributes if they don't exist, or replace them.
    # The simplest is to replace `lang="en"` with `:lang="lang"` and add `:dir="lang === 'ar' ? 'rtl' : 'ltr'"`
    # Let's do this: 
    # Find the html tag:
    html_match = re.search(r'<html([^>]*)>', content, flags=re.IGNORECASE)
    if html_match:
        attrs = html_match.group(1)
        # Remove old lang, dir, :lang, :dir, :class related to dir-rtl
        attrs = re.sub(r'\blang\s*=\s*["\'][^"\']*["\']', '', attrs)
        attrs = re.sub(r'\bdir\s*=\s*["\'][^"\']*["\']', '', attrs)
        attrs = re.sub(r':lang\s*=\s*["\'][^"\']*["\']', '', attrs)
        attrs = re.sub(r':dir\s*=\s*["\'][^"\']*["\']', '', attrs)
        attrs = re.sub(r':class\s*=\s*["\']lang === \'ar\' \? \'dir-rtl\' : \'\'["\']', '', attrs)
        attrs = attrs.strip()
        new_html_tag = f'<html :lang="lang" :dir="lang === \'ar\' ? \'rtl\' : \'ltr\'" {attrs}>'
        content = content[:html_match.start()] + new_html_tag + content[html_match.end():]

    # Phase 2: Purge and Replace Corrupted Strings
    # Find: Ù„Ø¯ÙŠÙƒ Ø§Ù... -> هل لا تزال لديك أسئلة؟
    # Let's just do a regex for Ù„Ø¯ÙŠÙƒ Ø§Ù„\S+ or Ù„Ø¯ÙŠÙƒ Ø§Ù...
    # The exact string might be "Ù„Ø¯ÙŠÙƒ Ø§Ù„Ù…Ø²ÙŠØ¯ Ù…Ù† Ø§Ù„Ø£Ø³Ø¦Ù„Ø©ØŸ" from my previous script, but maybe it wasn't replaced fully.
    # Let's blindly replace the corrupted strings if they exist.
    content = re.sub(r'Ù„Ø¯ÙŠÙƒ Ø§Ù„[\S\s]*?ØŸ', 'هل لا تزال لديك أسئلة؟', content)
    content = content.replace('Ù„Ø¯ÙŠÙƒ Ø§Ù„...', 'هل لا تزال لديك أسئلة؟')
    content = content.replace('لديك المزيد من الأسئلة؟', 'هل لا تزال لديك أسئلة؟') # if it was translated to this in the previous script

    # Replace en-dash/em-dash corruption
    content = content.replace('â€“', '—')
    content = content.replace('â€”', '—')

    # Footer replacements
    content = content.replace('Ø³Ø¹ÙˆØ¯ÙŠØ©', 'صناعة تدوم (Craftsmanship That Endures)')
    content = content.replace('القريات، الجوف، المملكة العربية السعودية', 'المملكة العربية السعودية')
    content = content.replace('سعيد للأثاث — حرفة تدوم', 'صناعة تدوم (Craftsmanship That Endures)')
    content = content.replace('جميع الحقوق محفوظة &copy; سعيد للأثاث', 'جميع الحقوق محفوظة (All rights reserved)')

    # Also fix some other corrupted texts that might be left:
    content = content.replace('ØµÙ†Ø§Ø¹Ø© ØªØ¯ÙˆÙ…', 'صناعة تدوم')
    content = content.replace('Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ‚ Ù…Ø­Ù ÙˆØ¸Ø©', 'جميع الحقوق محفوظة')

    # Phase 3: Typography Fallbacks
    # Ensure body has font-sans
    body_match = re.search(r'<body([^>]*)class=(["\'])(.*?)\2([^>]*)>', content, flags=re.IGNORECASE)
    if body_match:
        classes = body_match.group(3)
        if 'font-sans' not in classes:
            new_classes = classes + ' font-sans'
            new_body = f'<body{body_match.group(1)}class="{new_classes}"{body_match.group(4)}>'
            content = content[:body_match.start()] + new_body + content[body_match.end():]
    else:
        # if body has no class
        content = re.sub(r'<body([^>]*)>', r'<body\1 class="font-sans">', content, flags=re.IGNORECASE)

    # Let's also check if we need to inject Cairo font into the head if missing
    if 'fonts.googleapis.com/css2?family=Cairo' not in content:
        # inject before </head>
        cairo_link = '\n  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet" />'
        content = content.replace('</head>', cairo_link + '\n</head>')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("UTF-8 Meta tag injected, html dir updated, strings replaced, and typography fallbacks applied.")
