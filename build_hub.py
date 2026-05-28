import re
import codecs

path = r'd:\Saeed Furniture\frontend\index.html'

with codecs.open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject anime.js into the head
if 'anime.min.js' not in content:
    content = content.replace(
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>',
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>'
    )

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

      <!-- LAYER 0: Automated Day/Night Crossfade -->
      <div class="absolute inset-0 w-full h-full z-0">
        <!-- DAY Image -->
        <img id="hero-day" src="https://ik.imagekit.io/de7qvcvqv/images/hero.png?v=2"
             class="absolute inset-0 w-full h-full object-cover z-0"
             alt="Day Room Hero">
        <!-- NIGHT Image -->
        <img id="hero-night" src="https://ik.imagekit.io/de7qvcvqv/images/modern.png?v=2"
             class="absolute inset-0 w-full h-full object-cover z-10 opacity-0"
             alt="Night Room Hero">
      </div>

      <!-- LAYER 1: Header -->
      <header class="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-6">
        <div class="flex items-center gap-3">
          <img src="https://ik.imagekit.io/de7qvcvqv/images/logo.png" alt="Saeed Furniture" class="h-10 w-auto" style="filter: brightness(0) saturate(100%) invert(84%) sepia(19%) saturate(805%) hue-rotate(352deg) brightness(85%) contrast(85%);">
          <span class="text-[#c9a96e] font-bold text-xl tracking-widest uppercase">Saeed Furniture</span>
        </div>
        <nav class="hidden md:flex items-center gap-8 text-[#c9a96e] font-bold text-sm tracking-widest uppercase">
          <a href="#about" class="hover:text-white transition-colors">About</a>
          <a href="#faq" class="hover:text-white transition-colors">FAQs</a>
          <a href="#contact" class="hover:text-white transition-colors">Contact</a>
          <button class="px-6 py-2 border-2 border-[#c9a96e] hover:bg-[#c9a96e] hover:text-stone-950 transition-all rounded-sm">Our Designs</button>
        </nav>
      </header>

      <!-- LAYER 2: Text Overlays -->
      <div class="absolute top-1/4 left-0 w-full px-8 md:px-16 z-30 pointer-events-none">
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
        
        <!-- The Majlis (Left Foreground) -->
        <polygon id="poly-majlis" points="0,30 46,30 48,100 0,100" fill="transparent" stroke="none" class="cursor-pointer svg-hotspot" pointer-events="auto" />
        
        <!-- Bespoke Kitchens (Center Background) -->
        <polygon id="poly-kitchens" points="33,0 67,0 61,36 39,36" fill="transparent" stroke="none" class="cursor-pointer svg-hotspot" pointer-events="auto" />
        
        <!-- Premium Cots (Right Midground) -->
        <polygon id="poly-cots" points="54,22 70,22 70,70 54,70" fill="transparent" stroke="none" class="cursor-pointer svg-hotspot" pointer-events="auto" />
        
        <!-- Arabian Bedroom Sets (Right Midground, far right) -->
        <polygon id="poly-bedroom" points="67,28 85,28 85,82 67,82" fill="transparent" stroke="none" class="cursor-pointer svg-hotspot" pointer-events="auto" />
        
        <!-- Storage & Almirahs (Right Background) -->
        <polygon id="poly-storage" points="83,6 100,6 100,60 83,60" fill="transparent" stroke="none" class="cursor-pointer svg-hotspot" pointer-events="auto" />
      </svg>

      <!-- LAYER 4: Floating Labels -->
      <div id="label-majlis" class="floating-label absolute z-40 pointer-events-none opacity-0 transition-all duration-300" style="left:15%; top:65%;">
        <span class="text-[#c9a96e] text-2xl font-bold uppercase drop-shadow-[0_0_10px_rgba(201,169,110,0.8)]">The Majlis</span>
      </div>
      <div id="label-kitchens" class="floating-label absolute z-40 pointer-events-none opacity-0 transition-all duration-300" style="left:50%; top:20%; transform:translateX(-50%);">
        <span class="text-[#c9a96e] text-xl font-bold uppercase drop-shadow-[0_0_10px_rgba(201,169,110,0.8)]">Bespoke Kitchens</span>
      </div>
      <div id="label-cots" class="floating-label absolute z-40 pointer-events-none opacity-0 transition-all duration-300" style="left:62%; top:45%;">
        <span class="text-[#c9a96e] text-xl font-bold uppercase drop-shadow-[0_0_10px_rgba(201,169,110,0.8)]">Premium Cots</span>
      </div>
      <div id="label-bedroom" class="floating-label absolute z-40 pointer-events-none opacity-0 transition-all duration-300" style="left:76%; top:55%;">
        <span class="text-[#c9a96e] text-xl font-bold uppercase drop-shadow-[0_0_10px_rgba(201,169,110,0.8)]">Arabian Bedroom Sets</span>
      </div>
      <div id="label-storage" class="floating-label absolute z-40 pointer-events-none opacity-0 transition-all duration-300" style="left:90%; top:33%; transform:translateX(-50%);">
        <span class="text-[#c9a96e] text-xl font-bold uppercase drop-shadow-[0_0_10px_rgba(201,169,110,0.8)]">Storage & Almirahs</span>
      </div>

    </section>
"""

    content = content[:start_idx] + new_hero + content[end_idx:]

# We need to add the Anime.js logic for crossfade and interactivity
anime_logic = """
      // Anime.js Day/Night Crossfade
      if (typeof anime !== 'undefined') {
        let isNight = false;
        setInterval(() => {
          isNight = !isNight;
          anime({
            targets: '#hero-night',
            opacity: isNight ? 1 : 0,
            duration: 2000,
            easing: 'easeInOutQuad'
          });
        }, 10000); // 10s interval

        // SVG Hotspot Interactions
        const zones = ['majlis', 'kitchens', 'cots', 'bedroom', 'storage'];
        zones.forEach(zone => {
          const poly = document.getElementById(`poly-${zone}`);
          const label = document.getElementById(`label-${zone}`);
          
          if (poly && label) {
            poly.addEventListener('mouseenter', () => {
              anime({
                targets: label,
                opacity: 1,
                scale: 1.1,
                duration: 300,
                easing: 'easeOutQuad'
              });
              // Poly glow
              anime({
                targets: poly,
                fill: 'rgba(201,169,110,0.15)',
                duration: 300
              });
            });
            
            poly.addEventListener('mouseleave', () => {
              anime({
                targets: label,
                opacity: 0,
                scale: 1,
                duration: 300,
                easing: 'easeInQuad'
              });
              anime({
                targets: poly,
                fill: 'rgba(0,0,0,0)', // transparent
                duration: 300
              });
            });

            poly.addEventListener('click', () => {
              // Intense glow feedback
              anime({
                targets: poly,
                fill: 'rgba(201,169,110,0.6)',
                duration: 200,
                direction: 'alternate',
                easing: 'easeInOutQuad'
              });
              
              // Fade entire hub
              anime({
                targets: '#hero',
                opacity: 0,
                duration: 800,
                easing: 'easeInOutQuad',
                complete: () => {
                  // Navigate to category page logic
                  console.log(`Navigating to ${zone}...`);
                  // For now, simulate routing by triggering the alpine state
                  // Assuming window.saeedApp exists
                  window.location.hash = zone;
                  setTimeout(() => {
                    anime({
                      targets: '#hero',
                      opacity: 1,
                      duration: 800
                    });
                  }, 1000);
                }
              });
            });
          }
        });
      }
"""

if '// 2. Custom Magnetic Cursor Logic' in content:
    content = content.replace('// 2. Custom Magnetic Cursor Logic', anime_logic + '\n      // 2. Custom Magnetic Cursor Logic')

with codecs.open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Immersive Chronological Hub built successfully.")
