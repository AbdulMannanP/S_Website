import glob
import re

html_files = glob.glob("d:/Saeed Furniture/frontend/*.html")

transparent_header = """<!-- Restored Transparent Header -->
<header class="absolute top-0 inset-x-0 z-[150] flex justify-between items-center px-6 md:px-10 py-5 text-white pointer-events-none">
  <!-- Left Logo -->
  <a href="/index.html" class="pointer-events-auto flex items-center gap-4 group">
    <img src="https://ik.imagekit.io/de7qvcvqv/images/logo.png?updatedAt=1779608592778" alt="Saeed Furniture" class="h-12 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105" style="filter: brightness(0) invert(1);">
    <div class="hidden sm:block">
      <h1 class="text-white font-bold text-lg tracking-[0.2em] uppercase">Saeed Furniture</h1>
      <p class="text-amber-500/80 text-[0.6rem] tracking-[0.3em] uppercase mt-0.5">Bespoke Mastery</p>
    </div>
  </a>

  <!-- Right: Navigation & Lang Toggle -->
  <div class="flex items-center gap-6 md:gap-8 pointer-events-auto">
    <!-- Restored Navigation Routes -->
    <nav class="hidden md:flex items-center gap-6 md:gap-8 text-xs font-semibold tracking-[0.15em] uppercase text-stone-300 drop-shadow-md">
      <a href="/index.html" class="hover:text-amber-400 transition-colors duration-300">Home</a>
      <a href="/about.html" class="hover:text-amber-400 transition-colors duration-300">About</a>
      <a href="/faq.html" class="hover:text-amber-400 transition-colors duration-300">FAQ</a>
      <a href="/contact.html" class="hover:text-amber-400 transition-colors duration-300">Contact</a>
    </nav>
    
    <!-- Divider -->
    <div class="hidden md:block w-px h-6 bg-white/20"></div>

    <!-- Language Toggle -->
    <div class="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
      <button @click="lang = 'en'" :class="lang === 'en' ? 'bg-amber-600 text-white shadow-lg' : 'text-stone-300 hover:text-white'" class="px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.2em] rounded-full transition-all duration-300">EN</button>
      <button @click="lang = 'ar'" :class="lang === 'ar' ? 'bg-amber-600 text-white shadow-lg' : 'text-stone-300 hover:text-white'" class="px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.1em] rounded-full transition-all duration-300" style="font-family: 'Cairo', sans-serif;">عربي</button>
    </div>

    <!-- Mobile Menu Toggle -->
    <button class="md:hidden text-white p-2 focus:outline-none" aria-label="Toggle Menu" onclick="document.getElementById('mobile-nav').classList.toggle('hidden')">
      <svg class="w-6 h-6 drop-shadow-md" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
    </button>
  </div>
</header>

<!-- Mobile Nav Dropdown -->
<div id="mobile-nav" class="hidden md:hidden fixed top-24 inset-x-6 z-[140] bg-stone-950/95 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-6 space-y-4 shadow-2xl pointer-events-auto text-center">
  <a href="/index.html" class="block text-white text-sm tracking-widest uppercase hover:text-amber-400">Home</a>
  <a href="/about.html" class="block text-white text-sm tracking-widest uppercase hover:text-amber-400">About</a>
  <a href="/faq.html" class="block text-white text-sm tracking-widest uppercase hover:text-amber-400">FAQ</a>
  <a href="/contact.html" class="block text-white text-sm tracking-widest uppercase hover:text-amber-400">Contact</a>
</div>
"""

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The new unified header might have different whitespace or be slightly modified
    # We will just target <header class="fixed top-0... </header>
    content = re.sub(r'<header class="fixed top-0 inset-x-0 z-\[150\].*?</header>', '', content, flags=re.DOTALL)
    
    # Target <div id="mobile-nav"... </div>
    content = re.sub(r'<div id="mobile-nav".*?</div>', '', content, flags=re.DOTALL)
    
    # Target <header class="absolute top-0 inset-x-0 z-50... </header> (the very old original transparent header)
    content = re.sub(r'<header class="absolute top-0 inset-x-0 z-50.*?</header>', '', content, flags=re.DOTALL)

    # Now inject our transparent header immediately after the <!-- ✧✧✧ Global Header ... comment
    # Or just inject it after the <body> tag if the comment doesn't exist.
    if '<!-- ✧✧✧ Global Header' in content:
        content = re.sub(r'(<!-- ✧✧✧ Global Header[^>]*-->)', r'\1\n' + transparent_header, content)
    else:
        # Fallback: find <body ...> and inject after
        content = re.sub(r'(<body[^>]*>)', r'\1\n' + transparent_header, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("done regex")
