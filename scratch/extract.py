import re

with open('scratch/old_spa_index.html', 'r', encoding='utf-8') as f:
    html = f.read()

usp_match = re.search(r'(<section id="usp".*?</section>)', html, re.DOTALL)
usp_html = usp_match.group(1) if usp_match else ''

about_match = re.search(r'(<section id="about".*?</section>)', html, re.DOTALL)
about_html = about_match.group(1) if about_match else ''

faq_match = re.search(r'(<section id="faq".*?</section>)', html, re.DOTALL)
faq_html = faq_match.group(1) if faq_match else ''

order_match = re.search(r'(<section id="order".*?</section>)', html, re.DOTALL)
order_html = order_match.group(1) if order_match else ''

print(f'USP len: {len(usp_html)}')
print(f'About len: {len(about_html)}')
print(f'FAQ len: {len(faq_html)}')
print(f'Order len: {len(order_html)}')

with open('scratch/extract_usp.html', 'w', encoding='utf-8') as f: f.write(usp_html)
with open('scratch/extract_about.html', 'w', encoding='utf-8') as f: f.write(about_html)
with open('scratch/extract_faq.html', 'w', encoding='utf-8') as f: f.write(faq_html)
with open('scratch/extract_order.html', 'w', encoding='utf-8') as f: f.write(order_html)
