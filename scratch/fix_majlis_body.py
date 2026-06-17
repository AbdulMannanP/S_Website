with open('d:/Saeed Furniture/frontend/majlis.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace <body x-data="portfolioApp()" x-init="init()"> with <div class="w-full" x-data="portfolioApp()" x-init="init()">
content = content.replace('<body x-data="portfolioApp()" x-init="init()">', '<div class="w-full" x-data="portfolioApp()" x-init="init()">')

# The last </body> in the file is the main one. The second to last was from portfolio.html
# Since there were two </body> tags, let's replace the one right before the overlay ends.
# The overlay ends with:
#     <div class="bg-[#f5ede0] min-h-screen">
#       ...
#     </div>
#   </div>
# </body>

# We can replace the FIRST occurrence of </body> AFTER the overlay start with </div> if it exists.
# Actually, the simplest way is to just find `<body x-data="portfolioApp()"` and its corresponding closing body.
# Let's just fix it manually using string replacement because the injected pf_body contained a </body> tag if we weren't careful.
# Let's check pf_body from the previous script:
# pf_wrapper_match.group(1) grabbed up to the end of <main>. But wait, if it grabbed the whole pf_content, it grabbed <body> and </body>.
# So let's replace the first </body> that is NOT at the very end of the file.
# The file should end with \n</body>\n</html>

lines = content.split('\n')
new_lines = []
for line in lines:
    if line.strip() == '<body x-data="portfolioApp()" x-init="init()">':
        new_lines.append(line.replace('<body', '<div class="w-full"'))
    elif line.strip() == '</body>':
        # we only keep the very last </body>
        # wait, we will just change all '</body>' to '</div>' EXCEPT the last one.
        pass
    else:
        new_lines.append(line)

# This is risky. Let's just do a regex.
import re

content = content.replace('<body x-data="portfolioApp()" x-init="init()">', '<div class="w-full min-h-screen" x-data="portfolioApp()" x-init="init()">')
# Find the </body> that comes before the end of the overlay.
content = re.sub(r'</body>\s*</div>\s*</div>\s*</body>', '</div>\n    </div>\n  </div>\n</body>', content)

# Also fix the lang="en" audits on other files:
# frontend\about.html:328:<body class="antialiased">
# frontend\faq.html:161:<body class="antialiased">
# frontend\contact.html:369:<body x-data="{ mobileOpen: false }">
# frontend\select.html:464:<body>

with open('d:/Saeed Furniture/frontend/majlis.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("majlis.html body tag fixed.")
