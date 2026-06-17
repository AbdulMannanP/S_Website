import os
import glob
import re

frontend_dir = "d:/Saeed Furniture/frontend"
html_files = glob.glob(os.path.join(frontend_dir, "*.html"))

unified_header = """  <!-- ===================== UNIFIED GLOBAL HEADER ===================== -->
  <header class="fixed top-0 inset-x-0 z-[150] bg-stone-950/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
      
      <!-- Left: Logo & Brand -->
      <a href="/index.html" class="flex items-center gap-4 group">
        <img src="https://ik.imagekit.io/de7qvcvqv/images/logo.png?updatedAt=1779608592778" alt="Saeed Furniture" class="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" style="filter: brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.2));">
        <div class="hidden sm:block">
          <h1 class="text-white font-bold text-lg tracking-[0.2em] uppercase">Saeed Furniture</h1>
          <p class="text-amber-500/80 text-[0.6rem] tracking-[0.3em] uppercase mt-0.5">Bespoke Mastery</p>
        </div>
      </a>

      <!-- Right: Navigation & Lang Toggle -->
      <div class="flex items-center gap-6 md:gap-10">
        <nav class="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-[0.15em] uppercase text-stone-300">
          <a href="/index.html" class="hover:text-amber-400 transition-colors duration-300">Home</a>
          <a href="#" @click.prevent="if(typeof showCollections !== 'undefined') { showCollections = true; } else { window.location.href='/index.html'; }" class="hover:text-amber-400 transition-colors duration-300">Collections</a>
          <a href="/about.html" class="hover:text-amber-400 transition-colors duration-300">About</a>
          <a href="/faq.html" class="hover:text-amber-400 transition-colors duration-300">FAQ</a>
          <a href="/contact.html" class="hover:text-amber-400 transition-colors duration-300">Contact</a>
        </nav>
        
        <!-- Divider -->
        <div class="hidden lg:block w-px h-6 bg-white/10"></div>

        <!-- Language Toggle -->
        <div class="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
          <button @click="lang = 'en'" :class="lang === 'en' ? 'bg-amber-600 text-white shadow-lg' : 'text-stone-400 hover:text-white'" class="px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.2em] rounded-full transition-all duration-300">EN</button>
          <button @click="lang = 'ar'" :class="lang === 'ar' ? 'bg-amber-600 text-white shadow-lg' : 'text-stone-400 hover:text-white'" class="px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.1em] rounded-full transition-all duration-300" style="font-family: 'Cairo', sans-serif;">عربي</button>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="lg:hidden text-white p-2 focus:outline-none" aria-label="Toggle Menu" onclick="document.getElementById('mobile-nav').classList.toggle('hidden')">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Nav Dropdown -->
    <div id="mobile-nav" class="hidden lg:hidden bg-stone-950 border-t border-white/10 px-6 py-6 space-y-4">
      <a href="/index.html" class="block text-white text-sm tracking-widest uppercase hover:text-amber-400">Home</a>
      <a href="/about.html" class="block text-white text-sm tracking-widest uppercase hover:text-amber-400">About</a>
      <a href="/faq.html" class="block text-white text-sm tracking-widest uppercase hover:text-amber-400">FAQ</a>
      <a href="/contact.html" class="block text-white text-sm tracking-widest uppercase hover:text-amber-400">Contact</a>
    </div>
  </header>
  <!-- Padding for fixed header -->
  <div class="h-20"></div>"""

unified_footer = """  <!-- ===================== UNIFIED GLOBAL FOOTER ===================== -->
  <footer class="bg-[#040405] border-t border-white/10 pt-16 pb-8 relative z-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 items-start mb-12">
        
        <!-- Brand -->
        <div class="flex flex-col items-center md:items-start gap-4">
          <img src="https://ik.imagekit.io/de7qvcvqv/images/logo.png?updatedAt=1779608592778" alt="Saeed Furniture" class="h-12 w-auto object-contain opacity-90" style="filter: brightness(0) invert(1);">
          <div class="text-center md:text-left">
            <h2 class="text-white text-sm font-bold tracking-[0.2em] uppercase mb-1">Saeed Furniture</h2>
            <p class="text-stone-400 text-xs italic font-serif">Craftsmanship That Endures</p>
            <p class="text-amber-500/80 text-sm mt-2" style="font-family: 'Cairo', sans-serif;" dir="rtl">سعيد للأثاث — حرفة تدوم</p>
          </div>
        </div>

        <!-- Links -->
        <div class="flex flex-col items-center gap-3 text-xs tracking-widest uppercase text-stone-400">
          <p class="text-white font-bold mb-2 tracking-[0.2em]">Explore</p>
          <a href="/index.html" class="hover:text-amber-500 transition-colors">Home</a>
          <a href="/about.html" class="hover:text-amber-500 transition-colors">About</a>
          <a href="/faq.html" class="hover:text-amber-500 transition-colors">FAQ</a>
          <a href="/contact.html" class="hover:text-amber-500 transition-colors">Contact</a>
        </div>

        <!-- Contact -->
        <div class="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
          <p class="text-white text-xs font-bold tracking-[0.2em] uppercase mb-2">Visit Us</p>
          <address class="not-italic text-stone-400 text-xs leading-loose tracking-wide">
            Saeed Furniture Showroom<br />
            Al Qurayyat, Al Jawf<br />
            Kingdom of Saudi Arabia
          </address>
          <p class="text-stone-500 text-sm mt-1" style="font-family: 'Cairo', sans-serif;" dir="rtl">القريات، الجوف، المملكة العربية السعودية</p>
          <a href="https://wa.me/9288004450" class="text-green-500 hover:text-green-400 transition-colors text-sm font-bold mt-2 tracking-wider">+966 9288004450</a>
        </div>

      </div>

      <!-- Copyright -->
      <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-stone-600 text-[0.65rem] tracking-wider uppercase">&copy; 2026 Saeed Furniture. All rights reserved.</p>
        <p class="text-stone-600 text-xs" style="font-family: 'Cairo', sans-serif;" dir="rtl">جميع الحقوق محفوظة &copy; سعيد للأثاث</p>
      </div>
    </div>
  </footer>"""

for file_path in html_files:
    filename = os.path.basename(file_path)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # --- Replace Header ---
    # Find the header tag
    header_pattern = r'<header.*?</header>'
    # Some pages had absolute headers inside or before main.
    if re.search(header_pattern, content, flags=re.DOTALL):
        # We replace the first header block
        # If it's majlis, it has a weird header inside a div, but it also has <header> tag? Let's check.
        # Actually majlis didn't use a <header> tag originally, it used <div class="flex-shrink-0... ">
        if filename == "majlis.html":
            # Strip the old ROW 1 Top Navigation Bar
            content = re.sub(r'<!-- â”€â”€ ROW 1.*?<!-- â”€â”€ ROW 2', '<!-- â”€â”€ ROW 2', content, flags=re.DOTALL)
            # Inject new header right after the native page loader
            loader_end = r'<!-- ===================== STICKY HEADER ===================== -->'
            # Wait, let's just insert unified_header right after the loader.
            content = re.sub(r'(<!-- â”€â”€ Premium Native Page Loader â”€â”€ -->.*?</div>)', r'\1\n' + unified_header, content, flags=re.DOTALL)
        else:
            content = re.sub(header_pattern, unified_header, content, count=1, flags=re.DOTALL)
            # Remove any existing padding div if it was added before
            content = re.sub(r'<!-- Padding for fixed header -->\n\s*<div class="h-20"></div>', '', content)
            # Add padding right after header (our string already has it, but just in case we need to replace it)
    else:
        # If no header, just inject after loader
        content = re.sub(r'(<!-- â”€â”€ Premium Native Page Loader â”€â”€ -->.*?</div>)', r'\1\n' + unified_header, content, flags=re.DOTALL)

    # --- Replace Footer ---
    footer_pattern = r'<footer.*?</footer>'
    if re.search(footer_pattern, content, flags=re.DOTALL):
        content = re.sub(footer_pattern, unified_footer, content, flags=re.DOTALL)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Unified headers and footers applied across all files.")
