import re

# 1. Read select.html
with open('d:/Saeed Furniture/frontend/select.html', 'r', encoding='utf-8') as f:
    select_content = f.read()

# Extract styles from select.html
style_match = re.search(r'<style>(.*?)</style>', select_content, re.DOTALL)
select_styles = style_match.group(1) if style_match else ''

# Extract body contents from select.html (sections)
# Specifically <section class="hero-section"> down to the end of <section class="whatsapp-strip...">
sections_match = re.search(r'(<section class="hero-section">.*?</section>\s*<!--.*WHATSAPP CTA STRIP.*<section class="whatsapp-strip py-14">.*?</section>)', select_content, re.DOTALL)
select_body = sections_match.group(1) if sections_match else ''

# 2. Read index.html
with open('d:/Saeed Furniture/frontend/index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Inject styles into index.html
if '/* â”€â”€ Hero â”€â”€ */' not in index_content: # prevent double inject
    index_content = index_content.replace('</style>', select_styles + '\n  </style>')

# Update x-data
index_content = index_content.replace('x-data="{ lang: \'en\', expanded: false, active: null }"', 'x-data="{ lang: \'en\', expanded: false, active: null, showCollections: false }"')

# Update Nav link
index_content = index_content.replace('href="/select.html"', 'href="#" @click.prevent="showCollections = true"')

# Build the overlay
overlay_html = f"""

  <!-- â”€â”€ Collections Overlay â”€â”€ -->
  <div x-show="showCollections" style="display: none;" 
       x-transition:enter="transition ease-out duration-700" 
       x-transition:enter-start="opacity-0 translate-y-8" 
       x-transition:enter-end="opacity-100 translate-y-0" 
       x-transition:leave="transition ease-in duration-500" 
       x-transition:leave-start="opacity-100 translate-y-0" 
       x-transition:leave-end="opacity-0 translate-y-8" 
       class="fixed inset-0 z-[150] bg-stone-950 overflow-y-auto">
       
    <!-- Close Button -->
    <button @click="showCollections = false" class="fixed top-6 right-6 md:top-10 md:right-10 z-[160] w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all border border-white/10">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>

    <div class="pt-20">
      {select_body}
    </div>
  </div>
"""

# Inject overlay before </body>
index_content = index_content.replace('</body>', overlay_html + '\n</body>')

with open('d:/Saeed Furniture/frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(index_content)
    
print("Migrated select.html into index.html overlay.")

# Update task.md
task_file = "C:/Users/Salmaan/.gemini/antigravity/brain/f314fa19-a27c-446b-a7ce-655fabdf26ef/task.md"
with open(task_file, "r", encoding="utf-8") as f:
    task_content = f.read()

task_content = task_content.replace("- `[ ]` Task 5", "- `[x]` Task 5")

with open(task_file, "w", encoding="utf-8") as f:
    f.write(task_content)
    
print("task.md updated.")
