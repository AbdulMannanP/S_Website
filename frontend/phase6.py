import os

files = ['almirah.html', 'bedroom.html', 'cot.html', 'kitchen.html', 'majlis.html']
for f in files:
    filepath = 'd:/Saeed Furniture/frontend/' + f
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content.replace('9289288004450', '9288004450')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Fixed WhatsApp number in {f}")
