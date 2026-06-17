with open('d:/Saeed Furniture/frontend/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# keep lines 1 to 171 (index 0 to 170) and lines 345 onwards (index 344 to end)
new_lines = lines[:171] + lines[344:]

with open('d:/Saeed Furniture/frontend/index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Removed lines 172 to 344.")
