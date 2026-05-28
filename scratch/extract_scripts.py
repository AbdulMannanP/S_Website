import re
import os

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all inline scripts
# We'll match <script> (with no attributes) or <script type="text/javascript">
# and capture the content.
script_pattern = re.compile(r'<script\s*>(.*?)</script>', re.DOTALL)
matches = script_pattern.findall(html)

if matches:
    combined_script = ""
    for match in matches:
        combined_script += match + "\n\n"
        
    with open('frontend/js/app.js', 'w', encoding='utf-8') as f:
        f.write(combined_script.strip())
        
    # Now remove all inline scripts from HTML and add the reference.
    # We will replace the first occurrence with the external script tag,
    # and remove the rest.
    
    # First, let's just sub all of them out.
    html_cleaned = script_pattern.sub('', html)
    
    # Then insert the external script tag right before </body>
    body_end = html_cleaned.rfind('</body>')
    if body_end != -1:
        script_tag = '  <script defer src="/js/app.js"></script>\n'
        html_cleaned = html_cleaned[:body_end] + script_tag + html_cleaned[body_end:]
        
    with open('frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(html_cleaned)
    print("Extracted scripts to frontend/js/app.js and updated index.html")
else:
    print("No inline scripts found.")
