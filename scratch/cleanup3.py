import os

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_tag = '  <!-- ── NODE: Kitchens / Dining Showroom ─────────────────────── -->'
end_tag = '</main>'

start_idx = html.find(start_tag)
end_idx = html.find(end_tag, start_idx)

if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + '\n  ' + html[end_idx:]
    with open('frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Cleaned up remaining node views (Kitchen, Cot, Bedroom, Almirah).")
else:
    print("Could not find start or end tags.")
