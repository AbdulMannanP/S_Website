import os
import glob
import re

frontend_dir = "d:/Saeed Furniture/frontend"
html_files = glob.glob(os.path.join(frontend_dir, "*.html"))

# For dark bg pages (index, bedroom, kitchen, cot, almirah, etc.)
new_logo_block_dark = """    <a href="/index.html" class="pointer-events-auto flex items-center gap-3">
      <img src="https://ik.imagekit.io/de7qvcvqv/images/logo.png?updatedAt=1779608592778" alt="Saeed Furniture" class="h-10 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
      <div class="font-bold text-lg md:text-xl tracking-widest text-white">
        SAEED FURNITURE
      </div>
    </a>"""

# For majlis (which has a white bg header)
new_majlis_header = """            <div class="flex-shrink-0 flex justify-between items-center px-3 md:px-12 py-3 md:py-5 bg-white shadow-sm border-b border-gray-100">
              <div class="flex items-center gap-6">
                <!-- Global Brand Injection -->
                <a href="/index.html" class="pointer-events-auto flex items-center gap-3 mr-4">
                  <img src="https://ik.imagekit.io/de7qvcvqv/images/logo.png?updatedAt=1779608592778" alt="Saeed Furniture" class="h-10 w-auto object-contain" style="filter: brightness(0)">
                  <div class="font-extrabold text-lg tracking-widest text-[#0a0a0d] hidden sm:block">
                    SAEED FURNITURE
                  </div>
                </a>
                
                <!-- Sidebar Toggle (Hamburger) -->
                <button @click="sidebarOpen = !sidebarOpen" aria-label="Toggle Sidebar" class="flex items-center gap-2 text-stone-500 hover:text-gold transition-all duration-300 min-h-[44px] px-3 -mx-3" style="touch-action: manipulation;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h16M4 12h10M4 18h16"/></svg>
                  <span class="text-[0.6rem] font-bold uppercase tracking-[0.3em]" x-text="sidebarOpen ? (lang === 'ar' ? 'Ø¥ØºÙ„Ø§Ù‚' : 'Close') : (lang === 'ar' ? 'Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø§Øª' : 'Collections')"></span>
                </button>
              </div>
              
              <!-- Global Nav Links (Hidden on mobile) -->
              <nav class="hidden lg:flex gap-8 text-xs tracking-widest pointer-events-auto font-bold text-stone-600 mr-8">
                <a href="/select.html" class="hover:text-amber-500 transition-colors duration-500">COLLECTIONS</a>
                <a href="/about.html" class="hover:text-amber-500 transition-colors duration-500">ABOUT</a>
                <a href="/faq.html" class="hover:text-amber-500 transition-colors duration-500">FAQ</a>
                <a href="/contact.html" class="hover:text-amber-500 transition-colors duration-500">CONTACT</a>
              </nav>

              <!-- Minimalist Back Arrow -->
              <button class="flex items-center gap-3 text-stone-500 hover:text-gold transition-all duration-300 group min-h-[44px] px-3 -mx-3" onclick="window.location.href='/index.html'" aria-label="Go Back" style="touch-action: manipulation;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="transition-transform duration-300 group-hover:-translate-x-1" :class="lang === 'ar' ? 'rotate-180' : ''"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                <span class="text-[0.6rem] font-normal uppercase tracking-[0.3em]" x-text="lang === 'ar' ? 'Ø§Ù„Ø¹ÙˆØ¯Ø©' : 'Back'"></span>
              </button>
            </div>"""

for file_path in html_files:
    filename = os.path.basename(file_path)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if filename == "majlis.html":
        # Regex replace the ROW 1 header
        pattern = r'<div class="flex-shrink-0 flex justify-between items-center px-3 md:px-12 py-3 md:py-5 bg-white shadow-sm border-b border-gray-100">.*?</div>\s*<!-- â”€â”€ ROW 2'
        new_content = re.sub(pattern, new_majlis_header + '\n            <!-- â”€â”€ ROW 2', content, flags=re.DOTALL)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
    else:
        # Regex to replace the `a` tag containing the logo
        pattern = r'<a href="/index.html" class="pointer-events-auto">\s*<img src="https://ik.imagekit.io/de7qvcvqv/images/logo.png\?updatedAt=1779608592778".*?</a>'
        new_content = re.sub(pattern, new_logo_block_dark, content, flags=re.DOTALL)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)

print("Headers synchronized.")

# Update task.md
task_file = "C:/Users/Salmaan/.gemini/antigravity/brain/f314fa19-a27c-446b-a7ce-655fabdf26ef/task.md"
with open(task_file, "r", encoding="utf-8") as f:
    task_content = f.read()

task_content = task_content.replace("- `[/]` Task 3", "- `[x]` Task 3")
task_content = task_content.replace("- `[ ]` Task 4", "- `[x]` Task 4")

with open(task_file, "w", encoding="utf-8") as f:
    f.write(task_content)
