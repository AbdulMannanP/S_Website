import os
import re

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's find the start of the first leftover node: <!-- ── NODE:
start_idx = html.find('<!-- ── NODE:')
end_idx = html.rfind('</main>')

if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
    html = html[:start_idx] + '\n  ' + html[end_idx:]
    with open('frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Cleaned up remaining node views.")
else:
    print("No nodes found to clean up.")
