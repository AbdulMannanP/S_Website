import re

with open('d:/Saeed Furniture/frontend/majlis.html', 'r', encoding='utf-8') as f:
    content = f.read()

toggle_button = """
        <!-- Sidebar Toggle (Majlis Only) -->
        <button @click="sidebarOpen = !sidebarOpen" class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-amber-600 transition-all text-white border border-white/20 ml-4 hidden lg:flex" aria-label="Toggle Sidebar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/></svg>
        </button>
"""

# Insert right after the Language Toggle div closes.
# The language toggle ends with: </button>\n        </div>
pattern = r'(</button>\n\s*</div>)'
# We will inject the toggle button before the mobile menu toggle
# The mobile menu toggle starts with <!-- Mobile Menu Toggle -->
content = content.replace('<!-- Mobile Menu Toggle -->', toggle_button + '\n        <!-- Mobile Menu Toggle -->')

# Also modify the mobile toggle so it ALSO toggles the sidebar if we are on mobile, or just let them use the same button?
# Actually, the mobile menu toggle is for the header nav. We should put the sidebar toggle next to the mobile menu toggle on mobile too!
# Let's just remove 'hidden lg:flex' from the toggle button so it's visible on all screen sizes, and place it before the Mobile Menu toggle.

toggle_button_all = """
        <!-- Sidebar Toggle (Majlis Only) -->
        <button @click="sidebarOpen = !sidebarOpen" class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-amber-600 transition-all text-white border border-white/20" aria-label="Toggle Sidebar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/></svg>
        </button>
"""

# Reset content
with open('d:/Saeed Furniture/frontend/majlis.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<!-- Mobile Menu Toggle -->', toggle_button_all + '\n        <!-- Mobile Menu Toggle -->')

# Now on majlis, we need to ensure the sidebar is truly visible.
# And also the Collections Arabic text had mojibake (????????). Let's fix that.
content = content.replace("?????????", "المجموعات")

with open('d:/Saeed Furniture/frontend/majlis.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Sidebar toggle injected and majlis mojibake fixed.")

# Update task tracking
task_file = "C:/Users/Salmaan/.gemini/antigravity/brain/f314fa19-a27c-446b-a7ce-655fabdf26ef/task.md"
with open(task_file, "r", encoding="utf-8") as f:
    task_content = f.read()

task_content = task_content.replace("- `[ ]` **Task 5", "- `[x]` **Task 5")

with open(task_file, "w", encoding="utf-8") as f:
    f.write(task_content)
