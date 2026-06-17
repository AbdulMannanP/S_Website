import re

files = ['almirah.html', 'cot.html', 'bedroom.html', 'kitchen.html']
btn = '<a href="/index.html" class="absolute top-28 left-8 z-50 flex items-center gap-2 text-stone-300 hover:text-amber-500 transition-colors duration-500 bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm text-sm tracking-widest border border-white/10">← RETURN TO HUB</a>'

for f in files:
    path = f'd:/Saeed Furniture/frontend/{f}'
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace the existing "Back to Master Room" blocks with the unified "RETURN TO HUB"
    # It looks like:
    # <!-- ✧✧✧ Back Navigation (z-40) ✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧ -->
    # <a href="/index.html" ... >... Back to Master Room</a>
    new_content = re.sub(
        r'<!--[^>]*Back Navigation[^>]*-->\s*<a[^>]*>.*?Back to Master Room\s*</a>', 
        btn, 
        content, 
        flags=re.DOTALL
    )
    
    with open(path, 'w', encoding='utf-8') as file:
        file.write(new_content)
print("Updated routing on all product pages.")
