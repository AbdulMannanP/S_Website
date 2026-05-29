import os
import glob
import re

frontend_dir = "d:/Saeed Furniture/frontend"
html_files = glob.glob(os.path.join(frontend_dir, "*.html"))

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # If the file does NOT have `lang:` inside the body tag's x-data, we add it.
    body_match = re.search(r'<body([^>]*)>', content)
    if body_match:
        attrs = body_match.group(1)
        if 'lang:' not in attrs and 'saeedApp()' not in attrs:
            if 'x-data=' in attrs:
                # e.g., x-data="{ mobileOpen: false }"
                # replace { with { lang: 'en',
                new_attrs = re.sub(r'x-data="\{\s*', 'x-data="{ lang: \'en\', ', attrs)
                content = content.replace(f'<body{attrs}>', f'<body{new_attrs}>')
            else:
                # no x-data, so add it
                content = content.replace(f'<body{attrs}>', f'<body{attrs} x-data="{{ lang: \'en\' }}">')
                
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Body tags audited and fixed.")

# Update task.md
task_file = "C:/Users/Salmaan/.gemini/antigravity/brain/f314fa19-a27c-446b-a7ce-655fabdf26ef/task.md"
with open(task_file, "r", encoding="utf-8") as f:
    task_content = f.read()

task_content = task_content.replace("- `[ ]` Task 7", "- `[x]` Task 7")

with open(task_file, "w", encoding="utf-8") as f:
    f.write(task_content)
    
print("task.md updated.")
