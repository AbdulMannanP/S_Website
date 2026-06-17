import os
import glob

loader_html = """  <!-- â”€â”€ Premium Native Page Loader â”€â”€ -->
  <div x-data="{ loaded: document.readyState === 'complete' }" x-init="if (!loaded) window.addEventListener('load', () => loaded = true)" class="fixed inset-0 z-[100] bg-stone-950 flex items-center justify-center transition-opacity duration-1000 ease-in-out" :class="loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'">
    <img src="https://ik.imagekit.io/de7qvcvqv/images/logo.png?updatedAt=1779608592778" alt="Saeed Furniture Loading" class="h-16 w-auto object-contain animate-pulse" style="filter: brightness(0) invert(0.6)">
  </div>
"""

frontend_dir = "d:/Saeed Furniture/frontend"
html_files = glob.glob(os.path.join(frontend_dir, "*.html"))

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if loader already exists to prevent double injection
    if "Premium Native Page Loader" in content:
        continue

    # Find the closing angle bracket of the body tag
    body_idx = content.find("<body")
    if body_idx == -1:
        continue
    
    body_close_idx = content.find(">", body_idx)
    if body_close_idx == -1:
        continue
    
    # Inject the loader
    new_content = content[:body_close_idx+1] + "\n" + loader_html + content[body_close_idx+1:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
        
print("Loader injected successfully.")

# Update task.md
task_file = "C:/Users/Salmaan/.gemini/antigravity/brain/f314fa19-a27c-446b-a7ce-655fabdf26ef/task.md"
with open(task_file, "r", encoding="utf-8") as f:
    task_content = f.read()

task_content = task_content.replace("- `[/]` Task 1", "- `[x]` Task 1")
task_content = task_content.replace("- `[ ]` Task 2", "- `[x]` Task 2")
task_content = task_content.replace("- `[ ]` Task 3", "- `[/]` Task 3")

with open(task_file, "w", encoding="utf-8") as f:
    f.write(task_content)
    
print("task.md updated.")
