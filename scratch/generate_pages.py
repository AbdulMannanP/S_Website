import os
import re

# Colors and configuration for the 5 pages
pages = {
    'majlis': {
        'name': 'Majlis / مجلس',
        'text_color': 'text-emerald-900',
        'bg_color': 'bg-neutral-100',
        'accent_color': 'bg-amber-500',
        'accent_text': 'text-amber-500',
        'image': 'https://ik.imagekit.io/de7qvcvqv/images/Night%20room%20Hero?updatedAt=1779819465172' # generic placeholder
    },
    'kitchen': {
        'name': 'Kitchen / مطبخ',
        'text_color': 'text-slate-800',
        'bg_color': 'bg-neutral-100',
        'accent_color': 'bg-yellow-600',
        'accent_text': 'text-yellow-600',
        'image': 'https://ik.imagekit.io/de7qvcvqv/images/Night%20room%20Hero?updatedAt=1779819465172'
    },
    'bedroom': {
        'name': 'Bedroom / غرفة نوم',
        'text_color': 'text-indigo-950',
        'bg_color': 'bg-slate-300',
        'accent_color': 'bg-indigo-950',
        'accent_text': 'text-indigo-950',
        'image': 'https://ik.imagekit.io/de7qvcvqv/images/Night%20room%20Hero?updatedAt=1779819465172'
    },
    'cot': {
        'name': 'Cot / سرير أطفال',
        'text_color': 'text-teal-800',
        'bg_color': 'bg-stone-200',
        'accent_color': 'bg-teal-800',
        'accent_text': 'text-teal-800',
        'image': 'https://ik.imagekit.io/de7qvcvqv/images/Night%20room%20Hero?updatedAt=1779819465172'
    },
    'almirah': {
        'name': 'Almirah / خزانة',
        'text_color': 'text-neutral-900',
        'bg_color': 'bg-neutral-100',
        'accent_color': 'bg-amber-900',
        'accent_text': 'text-amber-900',
        'image': 'https://ik.imagekit.io/de7qvcvqv/images/Night%20room%20Hero?updatedAt=1779819465172'
    }
}

def build_page(key, config, index_html):
    # Extract head
    head_match = re.search(r'(<!DOCTYPE html>.*?<body[^>]*>)', index_html, re.DOTALL)
    head = head_match.group(1) if head_match else '<!DOCTYPE html><html><body>'
    
    # Extract header
    header_match = re.search(r'(<header.*?</header>)', index_html, re.DOTALL)
    header = header_match.group(1) if header_match else '<header></header>'
    
    # Extract footer
    footer_match = re.search(r'(<footer.*?>.*?</footer>)', index_html, re.DOTALL)
    footer = footer_match.group(1) if footer_match else '<footer></footer>'

    # Remove Alpine state references from body tag if necessary
    head = re.sub(r'x-data="saeedApp\(\)"', '', head)

    html = f"""{head}
    {header}
    
    <!-- Section A: Back Button -->
    <a href="/" class="fixed top-24 left-6 z-50 px-4 py-2 bg-white/10 text-white backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/30 transition-all font-cairo flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Master Room
    </a>

    <!-- Section B: 100vh Hero -->
    <section class="relative w-full h-screen">
        <img src="{config['image']}" class="absolute inset-0 w-full h-full object-cover z-0" alt="{config['name']}">
        <div class="absolute inset-0 bg-black/40 z-10"></div>
        
        <div class="absolute bottom-12 inset-x-0 flex justify-center z-20">
            <button class="px-8 py-4 {config['accent_color']} text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform uppercase tracking-widest">
                Explore {config['name']}
            </button>
        </div>
    </section>

    <!-- Section C: Under Construction -->
    <section class="min-h-[50vh] flex flex-col items-center justify-center {config['bg_color']} {config['text_color']} p-8 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-6 opacity-70">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <h2 class="text-3xl md:text-5xl font-extrabold mb-4 font-cairo">Digital Showroom Under Construction</h2>
        <p class="text-xl md:text-2xl max-w-2xl opacity-80 font-cairo">Check back soon for the full {config['name']} collection.</p>
    </section>

    {footer}
</body>
</html>
"""
    with open(f"frontend/{key}.html", "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Created {key}.html")

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

for key, config in pages.items():
    build_page(key, config, idx)

