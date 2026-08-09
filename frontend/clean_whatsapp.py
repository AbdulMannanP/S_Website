import os
import glob
import re

def clean_whatsapp():
    html_files = glob.glob('*.html')
    
    # Regex to match the massive green WhatsApp button in footers
    big_btn_pattern = re.compile(r'<!--\s*WhatsApp Big Button\s*-->\s*<a[^>]*https://wa\.me/[^>]*>.*?</a>', re.DOTALL)
    
    # 1. Clean HTML files
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original = content
        content = big_btn_pattern.sub('', content)
        
        # If it's contact.html, remove the floating widget
        if file == 'contact.html':
            floating_pattern = re.compile(r'<!--\s*Floating WhatsApp\s*-->\s*<div[^>]*fixed bottom-8 end-6[^>]*>.*?</div>', re.DOTALL)
            content = floating_pattern.sub('', content)
            # Just in case the comment is missing
            floating_no_comment = re.compile(r'<div class="fixed bottom-8 end-6 z-40 animate-pulse-ring rounded-full">.*?</a>\s*</div>', re.DOTALL)
            content = floating_no_comment.sub('', content)
            
        if content != original:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Cleaned {file}")
            
    # 2. Clean update-footers.js
    if os.path.exists('update-footers.js'):
        with open('update-footers.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
            
        js_orig = js_content
        js_content = big_btn_pattern.sub('', js_content)
        
        if js_content != js_orig:
            with open('update-footers.js', 'w', encoding='utf-8') as f:
                f.write(js_content)
            print("Cleaned update-footers.js")

if __name__ == '__main__':
    clean_whatsapp()
