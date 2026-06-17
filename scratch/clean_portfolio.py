import re

with open('d:/Saeed Furniture/frontend/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update "6 Collections" to "5 Collections"
content = content.replace('6 Collections', '5 Collections')

# Remove the 6. Portfolio card from the grid
# The card starts with <!-- 6. Portfolio --> and ends with </a>
card_pattern = r'<!-- 6\. Portfolio -->.*?</a>'
content = re.sub(card_pattern, '', content, flags=re.DOTALL)

with open('d:/Saeed Furniture/frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Portfolio remnants removed from Collections overlay in index.html.")
