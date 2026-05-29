import os

with open('frontend/portfolio.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.rfind('<script>')
end = html.rfind('</script>')

if start != -1 and end != -1:
    script_body = html[start + 8:end].strip()
    with open('frontend/js/portfolio.js', 'w', encoding='utf-8') as jsf:
        jsf.write(script_body)
    
    new_html = html[:start] + '<script defer src="/js/portfolio.js"></script>' + html[end + 9:]
    with open('frontend/portfolio.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print('portfolio.html script extracted successfully')
