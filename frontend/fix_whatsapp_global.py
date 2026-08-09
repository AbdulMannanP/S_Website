import glob
import re
import os

def enforce_whatsapp_suppression():
    html_files = glob.glob('*.html')
    
    style_injection = """  <style>
    body.modal-active .floating-whatsapp, body.modal-active [class*="animate-pulse-ring"] { display: none !important; }
  </style>"""

    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        orig = content
        
        # 1. Inject the CSS block in <head>
        if "body.modal-active" not in content:
            content = content.replace("</head>", f"{style_injection}\n</head>")
            
        # 2. Alpine Modals: Home Visit Modal (index.html)
        if 'showVisitModal: false' in content:
            # We add the watch logic to x-init if it exists, or create x-init
            # The div looks like: <div x-data="{ showVisitModal: false, visitName: '', visitEmail: '', visitTime: 'Morning', visitLocation: '' }">
            # We change it to: <div x-data="{ showVisitModal: false, ... }" x-init="$watch('showVisitModal', val => document.body.classList.toggle('modal-active', val))">
            target = '''<div x-data="{ showVisitModal: false, visitName: '', visitEmail: '', visitTime: 'Morning', visitLocation: '' }">'''
            replacement = '''<div x-data="{ showVisitModal: false, visitName: '', visitEmail: '', visitTime: 'Morning', visitLocation: '' }" x-init="$watch('showVisitModal', val => document.body.classList.toggle('modal-active', val))">'''
            content = content.replace(target, replacement)
            
        # 3. Auth Modal (index.html)
        # It's controlled by $store.saeedAuth.showAuthModal
        # The user's prompt said: If an Alpine store isn't tracking global modals, use Vanilla JS.
        # But we DO have an Alpine store tracking the Auth Modal.
        # Wait, instead of hacking it in HTML, let's just use the CSS we injected. 
        # Where is showAuthModal set to true? In js/auth.js or similar?
        # Let's just add an Alpine effect to the body or to the saeedAuth initialization:
        # Actually, in index.html, we can just add a global x-effect to the body:
        # x-effect="document.body.classList.toggle('modal-active', $store.saeedAuth?.showAuthModal || false)"
        if 'x-data="saeedApp()"' in content:
            if 'x-effect' not in content:
                content = content.replace('x-init="init()"', 'x-init="init()" x-effect="document.body.classList.toggle(\'modal-active\', $store.saeedAuth?.showAuthModal || false)"')
            else:
                # if x-effect already exists, we might need to append. Fortunately we know index.html doesn't have it on body.
                pass
                
        if content != orig:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Enforced WhatsApp suppression on {file}")

    # Fix React Modals in Majlis.jsx
    file = r'src/react/Majlis.jsx'
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            react_content = f.read()
        
        orig_react = react_content
        # Target lines 287-288:
        # if (selectedItem || isExitIntentOpen || isCompareModalOpen || isBespokeModalOpen) document.body.style.overflow = 'hidden';
        # else document.body.style.overflow = 'auto';
        
        old_effect = """if (selectedItem || isExitIntentOpen || isCompareModalOpen || isBespokeModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';"""
        new_effect = """if (selectedItem || isExitIntentOpen || isCompareModalOpen || isBespokeModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-active');
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('modal-active');
    }"""
        
        if old_effect in react_content:
            react_content = react_content.replace(old_effect, new_effect)
            
        if react_content != orig_react:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(react_content)
            print("Enforced WhatsApp suppression on Majlis.jsx")

if __name__ == '__main__':
    enforce_whatsapp_suppression()
