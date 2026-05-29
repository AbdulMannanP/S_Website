with open('frontend/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

with open('scratch/extract_usp.html', 'r', encoding='utf-8') as f: usp = f.read()
with open('scratch/extract_about.html', 'r', encoding='utf-8') as f: about = f.read()
with open('scratch/extract_faq.html', 'r', encoding='utf-8') as f: faq = f.read()

content = content.replace('href="/about.html"', 'href="#about"')
content = content.replace('href="/faq.html"', 'href="#faq"')

insertion_point = content.find('<!-- ── Footer')
if insertion_point != -1:
    new_content = content[:insertion_point] + usp + '\n' + about + '\n' + faq + '\n\n  ' + content[insertion_point:]
    with open('frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Sections injected successfully.')
else:
    print('Footer not found.')
