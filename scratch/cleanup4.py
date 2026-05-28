import os

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_tag = '<!-- ── NODE: Kitchen Showroom'
start_idx = html.find(start_tag)
end_idx = html.find('</main>', start_idx)

if start_idx != -1 and end_idx != -1:
    # Delete from start_idx up to end_idx
    html = html[:start_idx] + '\n  ' + html[end_idx:]
    with open('frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Cleaned up remaining node views.")
else:
    print("Could not find start or end tags.")
