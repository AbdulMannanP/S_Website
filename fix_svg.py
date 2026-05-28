import re
import codecs

path = r'd:\Saeed Furniture\frontend\index.html'

with codecs.open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract Hero Section
start_marker = '    <!-- ══ IMMERSIVE CHRONOLOGICAL HUB ═══════════════════════════════════ -->'
end_marker = '    <!-- ══ USP GRID SECTION ════════════════════════════════ -->'
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    
    new_hero = """    <!-- ══ IMMERSIVE CHRONOLOGICAL HUB ═══════════════════════════════════ -->
    <section id="hero"
             class="relative overflow-hidden bg-stone-950 w-full h-screen"
             aria-label="Saeed Furniture Immersive Showroom">

      <!-- LAYER 0: Images -->
      <img id="hero-day" src="https://ik.imagekit.io/de7qvcvqv/images/Day_room_Hero.jpg"
           class="absolute inset-0 w-full h-full object-cover z-0"
           alt="Day Room Hero">
      <img id="hero-night" src="https://ik.imagekit.io/de7qvcvqv/images/Night_room_Hero.jpg"
           class="absolute inset-0 w-full h-full object-cover z-10 opacity-0"
           alt="Night Room Hero">

      <!-- LAYER 1: Header -->
      <header class="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-6 pointer-events-none">
        <div class="flex items-center gap-3">
          <img src="https://ik.imagekit.io/de7qvcvqv/images/logo.png" alt="Saeed Furniture" class="h-10 w-auto pointer-events-auto" style="filter: brightness(0) saturate(100%) invert(84%) sepia(19%) saturate(805%) hue-rotate(352deg) brightness(85%) contrast(85%);">
          <span class="text-[#c9a96e] font-bold text-xl tracking-widest uppercase">Saeed Furniture</span>
        </div>
        <nav class="hidden md:flex items-center gap-8 text-[#c9a96e] font-bold text-sm tracking-widest uppercase pointer-events-auto">
          <a href="#about" class="hover:text-white transition-colors">About</a>
          <a href="#faq" class="hover:text-white transition-colors">FAQs</a>
          <a href="#contact" class="hover:text-white transition-colors">Contact</a>
          <button class="px-6 py-2 border-2 border-[#c9a96e] hover:bg-[#c9a96e] hover:text-stone-950 transition-all rounded-sm">Our Designs</button>
        </nav>
      </header>

      <!-- LAYER 2: Text Overlays -->
      <div class="absolute top-1/4 left-0 w-full px-8 md:px-16 z-40 pointer-events-none">
        <h2 class="text-[#c9a96e] text-2xl md:text-3xl font-light tracking-[0.3em] uppercase mb-2">Crafting Luxury</h2>
        <h1 class="text-white text-5xl md:text-7xl font-extrabold uppercase mb-6 drop-shadow-2xl font-cairo">Tailored for<br>Your Majlis</h1>
        <p class="text-white/80 text-sm md:text-base tracking-widest max-w-xl leading-relaxed mb-8">
          EXPLORE OUR COLLECTION OF ELEGANT AND COMFORTABLE FURNITURE, PERFECT FOR YOUR HOME.
        </p>
        <button class="pointer-events-auto px-8 py-4 bg-[#c9a96e] text-stone-950 font-bold tracking-[0.2em] uppercase rounded-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all">
          Start Your Journey
        </button>
      </div>

      <!-- LAYER 3: 5-Point SVG Mapping overlay -->
      <svg class="absolute inset-0 w-full h-full z-20 pointer-events-none"
           viewBox="0 0 100 100" preserveAspectRatio="none">
        
        <!-- The Majlis (Lower Left) -->
        <polygon id="poly-majlis" data-target="majlis" points="0,50 50,50 50,100 0,100" fill="rgba(0,0,0,0)" pointer-events="visiblePainted" class="cursor-pointer peer svg-hotspot" />
        
        <!-- Bespoke Kitchens (Center Back) -->
        <polygon id="poly-kitchens" data-target="kitchens" points="40,25 65,25 65,45 40,45" fill="rgba(0,0,0,0)" pointer-events="visiblePainted" class="cursor-pointer peer svg-hotspot" />
        
        <!-- Premium Cots (Right Center) -->
        <polygon id="poly-cots" data-target="cots" points="65,55 75,55 75,70 65,70" fill="rgba(0,0,0,0)" pointer-events="visiblePainted" class="cursor-pointer peer svg-hotspot" />
        
        <!-- Arabian Bedroom (Far Right Mid) -->
        <polygon id="poly-bedroom" data-target="bedroom" points="75,50 100,50 100,80 75,80" fill="rgba(0,0,0,0)" pointer-events="visiblePainted" class="cursor-pointer peer svg-hotspot" />
        
        <!-- Storage & Almirahs (Far Right Back) -->
        <polygon id="poly-almirah" data-target="almirah" points="80,20 95,20 95,50 80,50" fill="rgba(0,0,0,0)" pointer-events="visiblePainted" class="cursor-pointer peer svg-hotspot" />
      </svg>

      <!-- LAYER 4: Floating Labels -->
      <div id="label-majlis" class="floating-label absolute z-30 pointer-events-none opacity-0 transition-all duration-300" style="left:25%; top:75%;">
        <span class="text-[#c9a96e] text-2xl font-bold uppercase drop-shadow-[0_0_10px_rgba(201,169,110,0.8)]">The Majlis</span>
      </div>
      <div id="label-kitchens" class="floating-label absolute z-30 pointer-events-none opacity-0 transition-all duration-300" style="left:52%; top:35%; transform:translateX(-50%);">
        <span class="text-[#c9a96e] text-xl font-bold uppercase drop-shadow-[0_0_10px_rgba(201,169,110,0.8)]">Bespoke Kitchens</span>
      </div>
      <div id="label-cots" class="floating-label absolute z-30 pointer-events-none opacity-0 transition-all duration-300" style="left:70%; top:62%; transform:translateX(-50%);">
        <span class="text-[#c9a96e] text-xl font-bold uppercase drop-shadow-[0_0_10px_rgba(201,169,110,0.8)]">Premium Cots</span>
      </div>
      <div id="label-bedroom" class="floating-label absolute z-30 pointer-events-none opacity-0 transition-all duration-300" style="left:87%; top:65%; transform:translateX(-50%);">
        <span class="text-[#c9a96e] text-xl font-bold uppercase drop-shadow-[0_0_10px_rgba(201,169,110,0.8)]">Arabian Bedroom Sets</span>
      </div>
      <div id="label-almirah" class="floating-label absolute z-30 pointer-events-none opacity-0 transition-all duration-300" style="left:87%; top:35%; transform:translateX(-50%);">
        <span class="text-[#c9a96e] text-xl font-bold uppercase drop-shadow-[0_0_10px_rgba(201,169,110,0.8)]">Storage & Almirahs</span>
      </div>

    </section>
"""

    content = content[:start_idx] + new_hero + content[end_idx:]

# Update the JS logic to use 'almirah' instead of 'storage' where needed for the iteration array
anime_logic_find = "const zones = ['majlis', 'kitchens', 'cots', 'bedroom', 'storage'];"
anime_logic_replace = "const zones = ['majlis', 'kitchens', 'cots', 'bedroom', 'almirah'];"

if anime_logic_find in content:
    content = content.replace(anime_logic_find, anime_logic_replace)

with codecs.open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Geometry hardcoded successfully.")
