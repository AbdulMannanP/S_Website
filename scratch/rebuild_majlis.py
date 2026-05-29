with open('frontend/majlis.html', 'r', encoding='utf-8') as f:
    original = f.read()
with open('scratch/extract_order.html', 'r', encoding='utf-8') as f:
    order_html = f.read()

# Make the order section visible immediately, remove x-show
order_html = order_html.replace('x-show="isSelectionMode"', '')

# Construct the new HTML
new_head = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="data:,">
  <title>Saeed Furniture | Majlis Collection</title>
  <meta name="description" content="Luxury bespoke majlis crafted to order. Explore the Saeed Furniture Majlis collection.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/dist/output.css">
  
  <script defer src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script defer src="js/auth.js"></script>
  <script defer src="/js/app.js"></script>
  <script defer src="https://unpkg.com/@alpinejs/intersect@3.14.1/dist/cdn.min.js"></script>
  <script defer src="https://unpkg.com/alpinejs@3.14.1/dist/cdn.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  <script defer src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  
  <style>
    body { font-family: 'Inter', sans-serif; }
    h1, h2, h3 { font-family: 'Cormorant Garamond', serif; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="m-0 p-0 overflow-x-hidden bg-[#080809] text-white font-sans" x-data="saeedApp()" x-init="isSelectionMode = true; step = 'selection'; initSwiper(); activeShowroom = 'majlis';">
"""

# Remove the outer x-show for lookbook
order_html = order_html.replace('x-show="step === \'selection\' || step === \'hero\'"', '')

# Replace the Go Back button logic to navigate to index.html instead of closing popup
order_html = order_html.replace('@click="showExitPopup = true"', 'onclick="window.location.href=\'/index.html\'"')
# Also fix any inner "Return to Home" buttons
order_html = order_html.replace('@click="activeView = \'home\'; step = \'hero\'; isSelectionMode = false; window.scrollTo({top:0, behavior:\'smooth\'});"', 'onclick="window.location.href=\'/index.html\'"')


new_foot = """
</body>
</html>
"""

full_html = new_head + order_html + new_foot

with open('frontend/majlis.html', 'w', encoding='utf-8') as f:
    f.write(full_html)
print('majlis.html assembled.')
