import re
import os

def hide_react_whatsapp():
    file = r'src/react/Majlis.jsx'
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # The concierge pill wrapper
    old_pill = "className={`group fixed bottom-10 right-10 md:bottom-12 md:right-12 z-[150] flex items-center justify-start overflow-hidden rounded-full backdrop-blur-md bg-[#25d366] border border-[#25d366]/40 shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all duration-500 ease-[cubic-bezier(0.65,0,0.05,1)] h-14 ${"
    
    # We will just add a ternary to set opacity-0 pointer-events-none if a modal is open
    new_pill = "className={`group fixed bottom-10 right-10 md:bottom-12 md:right-12 z-[150] flex items-center justify-start overflow-hidden rounded-full backdrop-blur-md bg-[#25d366] border border-[#25d366]/40 shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all duration-500 ease-[cubic-bezier(0.65,0,0.05,1)] h-14 ${selectedItem || isCompareModalOpen || isBespokeModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${"
    
    if old_pill in content:
        content = content.replace(old_pill, new_pill)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Hidden React WhatsApp pill during modals")

if __name__ == '__main__':
    hide_react_whatsapp()
