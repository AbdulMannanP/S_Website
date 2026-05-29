import os

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# The node views start at: <!-- ── NODE: Majlis Showroom ──────────────────────────────────────── -->
# And end right before: <!-- Under Construction Placeholder -->
start_tag = '<!-- ── NODE: Majlis Showroom ──────────────────────────────────────── -->'
end_tag = '<!-- Under Construction Placeholder -->'

if start_tag in html and end_tag in html:
    html = html[:html.find(start_tag)] + html[html.find(end_tag):]
    with open('frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Cleaned up old node views from index.html")
else:
    print("Node views not found, skipping cleanup")
