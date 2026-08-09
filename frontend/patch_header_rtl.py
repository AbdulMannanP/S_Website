import os

def fix_header_rtl():
    file = r'js/components/header.js'
    if not os.path.exists(file): 
        print("Not found", file)
        return
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Main Header
    old_header = """    <header
      class="fixed top-0 inset-x-0 z-50 h-20 flex items-center justify-between px-6 sm:px-12 transition-all duration-700 ease-in-out bg-[#080809] border-b border-[#c9a96e]/10\""""
    new_header = """    <header
      class="fixed top-0 inset-x-0 z-50 h-20 flex items-center justify-between px-6 sm:px-12 transition-all duration-700 ease-in-out bg-[#080809] border-b border-[#c9a96e]/10 rtl:flex-row-reverse\""""
    content = content.replace(old_header, new_header)

    # 2. Desktop Navigation Container
    old_nav = """      <nav class="hidden md:flex items-center gap-6 text-[0.75rem] font-bold text-white/60 uppercase tracking-[0.12em] min-h-[44px] ms-auto pe-6">"""
    new_nav = """      <nav class="hidden md:flex items-center gap-6 text-[0.75rem] font-bold text-white/60 uppercase tracking-[0.12em] min-h-[44px] ms-auto pe-6 rtl:flex-row-reverse">"""
    content = content.replace(old_nav, new_nav)

    # 3. Text Alignment for Desktop Links
    old_link = """class="hover:text-[#c9a96e] transition-colors flex items-center min-h-[44px] whitespace-nowrap\""""
    new_link = """class="hover:text-[#c9a96e] transition-colors flex items-center min-h-[44px] whitespace-nowrap text-start\""""
    content = content.replace(old_link, new_link)

    # 4. Text Alignment for Desktop Order Button
    old_btn = """class="relative hover:text-white transition-colors flex items-center min-h-[44px] font-bold uppercase tracking-[0.12em] text-[0.75rem] text-[#c9a96e] whitespace-nowrap\""""
    new_btn = """class="relative hover:text-white transition-colors flex items-center min-h-[44px] font-bold uppercase tracking-[0.12em] text-[0.75rem] text-[#c9a96e] whitespace-nowrap text-start\""""
    content = content.replace(old_btn, new_btn)

    # 5. Mobile Navigation Links (Lines 134-137)
    old_mob_link = """class="text-xl font-light text-white/70 hover:text-[#c9a96e] transition-colors uppercase tracking-[0.3em]\""""
    new_mob_link = """class="text-xl font-light text-white/70 hover:text-[#c9a96e] transition-colors uppercase tracking-[0.3em] text-start\""""
    content = content.replace(old_mob_link, new_mob_link)
    
    # 6. Mobile Order Button
    old_mob_btn = """class="text-2xl font-light text-[#c9a96e] hover:text-[#c9a96e]/80 transition-colors uppercase tracking-[0.3em]\""""
    new_mob_btn = """class="text-2xl font-light text-[#c9a96e] hover:text-[#c9a96e]/80 transition-colors uppercase tracking-[0.3em] text-start\""""
    content = content.replace(old_mob_btn, new_mob_btn)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Patched header.js")

if __name__ == "__main__":
    fix_header_rtl()
