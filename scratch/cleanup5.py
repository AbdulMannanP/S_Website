import os
import re

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Use regex to find the start of the nodes and delete to the end of main
# The nodes start at <!-- ── NODE:
match = re.search(r'<!-- ── NODE:', html)
if match:
    start_idx = match.start()
    end_idx = html.find('</main>', start_idx)
    
    if end_idx != -1:
        html = html[:start_idx] + '\n  ' + html[end_idx:]
        with open('frontend/index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Cleaned up ALL remaining node views!")
    else:
        print("Could not find </main>")
else:
    print("Could not find any NODE comment")
