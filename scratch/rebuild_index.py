import re

def rebuild_index():
    with open('frontend/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Extract up to the start of <main>
    main_start = html.find('<main')
    head_and_header = html[:main_start]

    # Extract footer onwards
    footer_start = html.find('<footer id="footer"')
    if footer_start == -1:
        footer_start = html.find('<footer')
    
    footer_and_end = html[footer_start:]

    # Build the new clean main
    clean_main = """<main class="transition-all duration-500 pt-20" x-show="!loading" x-cloak x-data="{ hoverTarget: null }">
    <!-- ══ IMMERSIVE CHRONOLOGICAL HUB ═══════════════════════════════════ -->
    <section id="hero" class="relative overflow-hidden bg-stone-950 w-full h-[calc(100vh-5rem)]" aria-label="Saeed Furniture Immersive Showroom">

      <!-- LAYER 0: Images -->
      <img src="https://ik.imagekit.io/de7qvcvqv/images/Night%20room%20Hero?updatedAt=1779819465172" class="absolute inset-0 w-full h-full object-cover z-0" alt="Night Room Hero">

      <!-- LAYER 3: 5-Point SVG Mapping overlay -->
      <svg class="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <!-- The Majlis (Lower Left) -->
        <a href="/majlis.html"><polygon points="0,50 50,50 50,100 0,100" fill="rgba(0,0,0,0)" pointer-events="visiblePainted" class="cursor-pointer" @mouseenter="hoverTarget = 'majlis'" @mouseleave="hoverTarget = null" /></a>
        
        <!-- Bespoke Kitchens (Center Back) -->
        <a href="/kitchen.html"><polygon points="40,25 65,25 65,45 40,45" fill="rgba(0,0,0,0)" pointer-events="visiblePainted" class="cursor-pointer" @mouseenter="hoverTarget = 'kitchen'" @mouseleave="hoverTarget = null" /></a>
        
        <!-- Premium Cots (Right Center) -->
        <a href="/cot.html"><polygon points="65,55 75,55 75,70 65,70" fill="rgba(0,0,0,0)" pointer-events="visiblePainted" class="cursor-pointer" @mouseenter="hoverTarget = 'cot'" @mouseleave="hoverTarget = null" /></a>
        
        <!-- Arabian Bedroom (Far Right Mid) -->
        <a href="/bedroom.html"><polygon points="75,50 100,50 100,80 75,80" fill="rgba(0,0,0,0)" pointer-events="visiblePainted" class="cursor-pointer" @mouseenter="hoverTarget = 'bedroom'" @mouseleave="hoverTarget = null" /></a>
        
        <!-- Storage & Almirahs (Far Right Back) -->
        <a href="/almirah.html"><polygon points="80,20 95,20 95,50 80,50" fill="rgba(0,0,0,0)" pointer-events="visiblePainted" class="cursor-pointer" @mouseenter="hoverTarget = 'almirah'" @mouseleave="hoverTarget = null" /></a>
      </svg>

      <!-- LAYER 4: Visual Pulse Markers & Hover Labels -->
      <div class="absolute inset-0 z-[25] pointer-events-none">
        
        <!-- Majlis -->
        <div class="absolute" style="left: 25%; top: 75%; transform: translate(-50%, -50%);">
            <div class="w-4 h-4 rounded-full bg-white/40 border-2 border-white animate-pulse"></div>
            <div class="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white font-cairo transition-opacity duration-300 pointer-events-none"
                 :class="hoverTarget === 'majlis' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'">
                Majlis / مجلس
            </div>
        </div>

        <!-- Kitchen -->
        <div class="absolute" style="left: 52.5%; top: 35%; transform: translate(-50%, -50%);">
            <div class="w-4 h-4 rounded-full bg-white/40 border-2 border-white animate-pulse"></div>
            <div class="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white font-cairo transition-opacity duration-300 pointer-events-none"
                 :class="hoverTarget === 'kitchen' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'">
                Kitchen / مطبخ
            </div>
        </div>

        <!-- Cot -->
        <div class="absolute" style="left: 70%; top: 62.5%; transform: translate(-50%, -50%);">
            <div class="w-4 h-4 rounded-full bg-white/40 border-2 border-white animate-pulse"></div>
            <div class="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white font-cairo transition-opacity duration-300 pointer-events-none"
                 :class="hoverTarget === 'cot' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'">
                Cot / سرير أطفال
            </div>
        </div>

        <!-- Bedroom -->
        <div class="absolute" style="left: 87.5%; top: 65%; transform: translate(-50%, -50%);">
            <div class="w-4 h-4 rounded-full bg-white/40 border-2 border-white animate-pulse"></div>
            <div class="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white font-cairo transition-opacity duration-300 pointer-events-none"
                 :class="hoverTarget === 'bedroom' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'">
                Bedroom / غرفة نوم
            </div>
        </div>

        <!-- Almirah -->
        <div class="absolute" style="left: 87.5%; top: 35%; transform: translate(-50%, -50%);">
            <div class="w-4 h-4 rounded-full bg-white/40 border-2 border-white animate-pulse"></div>
            <div class="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white font-cairo transition-opacity duration-300 pointer-events-none"
                 :class="hoverTarget === 'almirah' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'">
                Almirah / خزانة
            </div>
        </div>

      </div>
    </section>
</main>
"""

    new_html = head_and_header + clean_main + footer_and_end

    # Also clean out the loading x-show footer logic that depended on activeShowroom
    new_html = new_html.replace('x-show="!loading && activeShowroom === \'gateway\'"', 'x-show="!loading"')
    new_html = new_html.replace('x-show="!loading && activeShowroom !== \'gateway\'"', 'x-show="false"')

    with open('frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)

rebuild_index()
