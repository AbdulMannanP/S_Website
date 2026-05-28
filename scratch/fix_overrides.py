import os
import re

# We will regenerate the 5 files using index.html as a base to get header/footer.
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix header collapse in index.html (replace gap-8 with space-x-8 for the nav)
html = html.replace('gap-8 text-[0.8rem]', 'space-x-8 text-[0.8rem]')
html = html.replace("Start Your Journey", "")
html = html.replace("ابدأ رحلتك", "")
with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

main_tag = '<main class="transition-all duration-500 pt-20"'
header_part = html[:html.find(main_tag)]
footer_tag = '<!-- ── Footer ───────────────────────────────────────────── -->'
footer_part = html[html.find(footer_tag):]
footer_part = footer_part.replace('x-show="!loading && activeShowroom === \'gateway\'"', 'x-show="!loading"')

# The user explicitly wants hardcoded backgrounds, h1, and CTA strings without Alpine bindings.
pages = {
    'majlis': {
        'bg': 'bg-emerald-950',
        'title': 'The Majlis',
        'h1': 'Craft Your Legacy',
        'cta': 'Craft Your Legacy | اصنع إرثك'
    },
    'kitchen': {
        'bg': 'bg-slate-900',
        'title': 'Bespoke Kitchens',
        'h1': 'Master Your Space',
        'cta': 'Master Your Space | تحكم في مساحتك'
    },
    'bedroom': {
        'bg': 'bg-indigo-950',
        'title': 'Arabian Bedroom',
        'h1': 'Curate Your Sanctuary',
        'cta': 'Curate Your Sanctuary | نسّق ملاذك'
    },
    'cot': {
        'bg': 'bg-teal-900',
        'title': 'Premium Cots',
        'h1': 'Nurture in Luxury',
        'cta': 'Nurture in Luxury | فخامة الرعاية'
    },
    'almirah': {
        'bg': 'bg-neutral-900',
        'title': 'Architectural Storage',
        'h1': 'Architectural Order',
        'cta': 'Architectural Order | تناغم التنظيم'
    }
}

for slug, data in pages.items():
    page_html = header_part + f'''
  <!-- ── Main Content for {slug} ────────────────────────────────────── -->
  <main class="transition-all duration-500 pt-20" x-show="!loading" x-cloak>
    
    <!-- Phase 3: The Plain-Color Hero Sections (100vh) -->
    <div class="h-screen w-full relative {data['bg']} flex flex-col items-center justify-center text-center">
      <!-- Back Navigation -->
      <div class="absolute top-24 left-8 z-50">
        <a href="/" class="flex items-center space-x-2 text-white/90 hover:text-white transition-all duration-300 group bg-[#080809]/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 hover:border-[#c9a96e]/50 shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform group-hover:-translate-x-1"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span class="text-[0.65rem] font-bold uppercase tracking-[0.25em]">Back to Master Room</span>
        </a>
      </div>

      <!-- Main Hero Title -->
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-10 tracking-wider">
        {data['h1']}
      </h1>

      <!-- Unique Bilingual Call-To-Action Button -->
      <button onclick="window.location.href='/#order'" class="px-10 py-4 bg-[#c9a96e] text-stone-950 font-bold tracking-[0.25em] uppercase text-sm rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(201,169,110,0.5)] transition-all duration-300 z-10 relative">
        <span>{data['cta']}</span>
      </button>
    </div>

    <!-- Phase 4: The Themed "Under Construction" Canvas -->
    <section class="min-h-[50vh] bg-stone-50 py-20 px-6 flex flex-col items-center justify-center text-center">
      <div class="max-w-xl mx-auto">
        <div class="w-12 h-px bg-[#c9a96e] mx-auto mb-8"></div>
        <p class="text-[0.65rem] uppercase tracking-[0.4em] text-[#c9a96e] font-bold mb-4">{data['title']} Digital Showroom</p>
        <h2 class="text-2xl md:text-3xl font-light text-stone-900 mb-4">Digital Showroom Under Construction</h2>
        <p class="text-stone-500 text-sm leading-relaxed">Check back soon for the full {data['title']} collection.</p>
        <div class="w-12 h-px bg-[#c9a96e] mx-auto mt-8"></div>
      </div>
    </section>
  </main>
''' + footer_part

    with open(f'frontend/{slug}.html', 'w', encoding='utf-8') as f:
        f.write(page_html)

print("Applied Phase 1, Phase 2, and Phase 3 hardcoded overrides successfully.")
