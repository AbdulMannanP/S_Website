import re
import os

# 1. Read portfolio.html
try:
    with open('d:/Saeed Furniture/frontend/portfolio.html', 'r', encoding='utf-8') as f:
        pf_content = f.read()
except FileNotFoundError:
    print("portfolio.html already deleted.")
    exit(0)

# Extract styles from portfolio.html
style_match = re.search(r'<style>(.*?)</style>', pf_content, re.DOTALL)
pf_styles = style_match.group(1) if style_match else ''
# Remove basic resets to avoid messing up majlis
pf_styles = re.sub(r'\*,\s*\*\:\:before,\s*\*\:\:after\s*\{[^\}]*\}', '', pf_styles)
pf_styles = re.sub(r'html\s*\{[^\}]*\}', '', pf_styles)
pf_styles = re.sub(r'body\s*\{[^\}]*\}', '', pf_styles)
pf_styles = pf_styles.replace(':root {', '/* pf roots */\n.pf-scope {')

# Extract the main wrapper (the Alpine app)
app_match = re.search(r'<main x-data="portfolioApp\(\)".*?</main>', pf_content, re.DOTALL)
pf_main = app_match.group(0) if app_match else ''

# Clean up header/footer inside pf_main if any (there is a <header class="pf-header"> in pf_content but it's outside main)
# Wait, let's look at pf_content to see where x-data="portfolioApp()" is attached. 
# Usually it's attached to body or a wrapper div.
pf_wrapper_match = re.search(r'(<div[^>]*x-data="portfolioApp\(\)"[^>]*>.*)<!-- â”€â”€â”€ Footer', pf_content, re.DOTALL)
if not pf_wrapper_match:
    pf_wrapper_match = re.search(r'(<main.*?x-data="portfolioApp\(\)".*?</main>)', pf_content, re.DOTALL)

pf_body = pf_wrapper_match.group(1) if pf_wrapper_match else pf_content[pf_content.find('<body>')+6 : pf_content.find('<!-- â”€â”€â”€ Footer')]

# Ensure the portfolioApp script is carried over
script_tag = '<script defer src="/js/portfolio.js"></script>'

# 2. Read majlis.html
with open('d:/Saeed Furniture/frontend/majlis.html', 'r', encoding='utf-8') as f:
    majlis_content = f.read()

# Inject script tag
if '/js/portfolio.js' not in majlis_content:
    majlis_content = majlis_content.replace('<script defer src="/js/app.js"></script>', '<script defer src="/js/app.js"></script>\n  ' + script_tag)

# Inject styles
if '/* â”€â”€â”€ Grid' not in majlis_content:
    majlis_content = majlis_content.replace('</style>', pf_styles + '\n  </style>')

# Update body init to include showPortfolio
majlis_content = majlis_content.replace('x-init="isSelectionMode = true;', 'x-init="showPortfolio = false; isSelectionMode = true;')

# Add sidebar button
sidebar_target = r'(<!-- Custom Reference CTA \(WhatsApp Fast Lane\) -->)'
sidebar_button = """<!-- Portfolio CTA -->
                <button @click="showPortfolio = true; sidebarOpen = false" class="flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-gold hover:border-gold/30 transition-all duration-300 text-xs uppercase tracking-widest font-bold min-h-[44px] mb-3" style="touch-action: manipulation;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21v-5a4 4 0 00-8 0v5"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  <span x-text="lang === 'ar' ? 'Ø³Ø§Ø¨Ù‚Ø© Ø§Ù„Ø£Ø¹Ù…Ø§Ù„' : 'Browse Past Portfolio'"></span>
                </button>\n                """

if 'Browse Past Portfolio' not in majlis_content:
    majlis_content = re.sub(sidebar_target, sidebar_button + r'\1', majlis_content)

# Build the overlay
overlay_html = f"""

  <!-- â”€â”€ Portfolio Overlay â”€â”€ -->
  <div x-show="showPortfolio" style="display: none;" 
       x-transition:enter="transition ease-out duration-700" 
       x-transition:enter-start="opacity-0 translate-y-8" 
       x-transition:enter-end="opacity-100 translate-y-0" 
       x-transition:leave="transition ease-in duration-500" 
       x-transition:leave-start="opacity-100 translate-y-0" 
       x-transition:leave-end="opacity-0 translate-y-8" 
       class="fixed inset-0 z-[200] bg-stone-950 overflow-y-auto pf-scope text-[#5c3d2e]">
       
    <!-- Close Button -->
    <button @click="showPortfolio = false" class="fixed top-6 right-6 md:top-10 md:right-10 z-[250] w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-gold hover:bg-black/60 transition-all border border-white/20">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>

    <div class="bg-[#f5ede0] min-h-screen">
      {pf_body}
    </div>
  </div>
"""

# Inject overlay before </body>
majlis_content = majlis_content.replace('</body>', overlay_html + '\n</body>')

with open('d:/Saeed Furniture/frontend/majlis.html', 'w', encoding='utf-8') as f:
    f.write(majlis_content)
    
print("Migrated portfolio.html into majlis.html overlay.")

# Delete portfolio.html
os.remove('d:/Saeed Furniture/frontend/portfolio.html')
print("Deleted portfolio.html.")

# Update task.md
task_file = "C:/Users/Salmaan/.gemini/antigravity/brain/f314fa19-a27c-446b-a7ce-655fabdf26ef/task.md"
with open(task_file, "r", encoding="utf-8") as f:
    task_content = f.read()

task_content = task_content.replace("- `[ ]` Task 6", "- `[x]` Task 6")

with open(task_file, "w", encoding="utf-8") as f:
    f.write(task_content)
    
print("task.md updated.")
