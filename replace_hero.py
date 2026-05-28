import codecs

path = r'd:\Saeed Furniture\frontend\index.html'
with codecs.open(path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '    <!-- ══ HERO — PREMIUM SPLIT LAYOUT ═══════════════════ -->'
end_marker = '    <!-- ══ USP GRID SECTION ════════════════════════════════ -->'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found: start_idx=" + str(start_idx) + " end_idx=" + str(end_idx))
    exit(1)

new_hero = """    <!-- ══ IMMERSIVE CHRONOLOGICAL HUB ═══════════════════════════════════ -->
    <section id="hero"
             class="relative overflow-hidden bg-stone-950"
             style="height:100svh; min-height:600px; max-height:1000px;"
             aria-label="Saeed Furniture Immersive Showroom">

      <!-- ── LAYER 0: Stacked Day/Night Images (crossfade via :style opacity) ── -->

      <!-- DAY image — hero.png -->
      <img src="https://ik.imagekit.io/de7qvcvqv/images/hero.png?v=2"
           srcset="https://ik.imagekit.io/de7qvcvqv/images/hero.png?tr=w-900,f-webp,q-85 900w, https://ik.imagekit.io/de7qvcvqv/images/hero.png?v=2 1920w"
           sizes="100vw"
           loading="eager"
           alt="Luxury Saudi Majlis — Daytime"
           class="absolute inset-0 w-full h-full object-cover object-center"
           style="transition:opacity 2000ms ease-in-out;"
           :style="'opacity:' + (isNight() ? '0' : '1')">

      <!-- NIGHT image — modern.png -->
      <img src="https://ik.imagekit.io/de7qvcvqv/images/modern.png?v=2"
           srcset="https://ik.imagekit.io/de7qvcvqv/images/modern.png?tr=w-900,f-webp,q-85 900w, https://ik.imagekit.io/de7qvcvqv/images/modern.png?v=2 1920w"
           sizes="100vw"
           loading="eager"
           alt="Luxury Saudi Majlis — Night"
           class="absolute inset-0 w-full h-full object-cover object-center"
           style="transition:opacity 2000ms ease-in-out;"
           :style="'opacity:' + (isNight() ? '1' : '0')">

      <!-- Atmospheric vignette — deepens at night -->
      <div class="absolute inset-0 pointer-events-none"
           style="transition:background 2000ms ease-in-out;"
           :style="isNight()
             ? 'background:linear-gradient(to top, rgba(4,4,10,0.92) 0%, rgba(8,8,9,0.45) 50%, rgba(6,6,16,0.25) 100%)'
             : 'background:linear-gradient(to top, rgba(8,8,9,0.82) 0%, rgba(10,10,13,0.22) 55%, transparent 100%)'">
      </div>

      <!-- ── LAYER 1: Full-Screen SVG Hotspot Matrix ──
           KEY FIX: fill driven by Alpine :fill attribute binding (NOT Tailwind fill-* classes).
           SVG attributes always work; Tailwind JIT cannot reliably process SVG fill at runtime.
           pointer-events:all ensures transparent polygons remain clickable. -->
      <svg class="absolute inset-0 w-full h-full"
           style="z-index:20;"
           viewBox="0 0 100 100"
           preserveAspectRatio="none"
           xmlns="http://www.w3.org/2000/svg"
           aria-hidden="true">

        <!-- Zone 1: The Majlis — Left / Center Foreground -->
        <polygon
          points="0,30 46,30 48,100 0,100"
          :fill="hubHoveredZone === 'majlis' ? 'rgba(201,169,110,0.13)' : 'transparent'"
          style="cursor:pointer; pointer-events:all; transition:fill 300ms ease;"
          @mouseenter="hubHoveredZone = 'majlis'"
          @mouseleave="hubHoveredZone = null"
          @click="routeHubZone('majlis')"
          @touchend.prevent="routeHubZone('majlis')"
          role="button" tabindex="0"
          :aria-label="lang === 'ar' ? 'المجلس الفاخر' : 'Luxury Majlis'"/>

        <!-- Zone 2: Bespoke Kitchens — Center Background -->
        <polygon
          points="33,0 67,0 61,36 39,36"
          :fill="hubHoveredZone === 'kitchens' ? 'rgba(201,169,110,0.13)' : 'transparent'"
          style="cursor:pointer; pointer-events:all; transition:fill 300ms ease;"
          @mouseenter="hubHoveredZone = 'kitchens'"
          @mouseleave="hubHoveredZone = null"
          @click="routeHubZone('kitchens')"
          @touchend.prevent="routeHubZone('kitchens')"
          role="button" tabindex="0"
          :aria-label="lang === 'ar' ? 'مطابخ مخصصة' : 'Bespoke Kitchens'"/>

        <!-- Zone 3: Premium Cots — Right Midground -->
        <polygon
          points="54,22 70,22 70,70 54,70"
          :fill="hubHoveredZone === 'cots' ? 'rgba(201,169,110,0.13)' : 'transparent'"
          style="cursor:pointer; pointer-events:all; transition:fill 300ms ease;"
          @mouseenter="hubHoveredZone = 'cots'"
          @mouseleave="hubHoveredZone = null"
          @click="routeHubZone('cots')"
          @touchend.prevent="routeHubZone('cots')"
          role="button" tabindex="0"
          :aria-label="lang === 'ar' ? 'الأسرة الفاخرة' : 'Premium Cots'"/>

        <!-- Zone 4: Arabian Bedroom Sets — Right Midground -->
        <polygon
          points="67,28 85,28 85,82 67,82"
          :fill="hubHoveredZone === 'bedroom' ? 'rgba(201,169,110,0.13)' : 'transparent'"
          style="cursor:pointer; pointer-events:all; transition:fill 300ms ease;"
          @mouseenter="hubHoveredZone = 'bedroom'"
          @mouseleave="hubHoveredZone = null"
          @click="routeHubZone('bedroom')"
          @touchend.prevent="routeHubZone('bedroom')"
          role="button" tabindex="0"
          :aria-label="lang === 'ar' ? 'غرف نوم عربية' : 'Arabian Bedroom Sets'"/>

        <!-- Zone 5: Storage & Almirahs — Right Background -->
        <polygon
          points="83,6 100,6 100,60 83,60"
          :fill="hubHoveredZone === 'storage' ? 'rgba(201,169,110,0.13)' : 'transparent'"
          style="cursor:pointer; pointer-events:all; transition:fill 300ms ease;"
          @mouseenter="hubHoveredZone = 'storage'"
          @mouseleave="hubHoveredZone = null"
          @click="routeHubZone('storage')"
          @touchend.prevent="routeHubZone('storage')"
          role="button" tabindex="0"
          :aria-label="lang === 'ar' ? 'خزائن التخزين' : 'Storage & Almirahs'"/>

      </svg>

      <!-- ── LAYER 2: Glowing Floating Zone Labels ──
           Each label is independently positioned and scales up on zone hover.
           Night mode: warm gold glow. Day mode: crisp white shadow. -->

      <!-- Label 1: The Majlis Collection -->
      <div class="absolute pointer-events-none"
           style="z-index:30; left:14%; top:60%; transition:transform 300ms ease;"
           :style="hubHoveredZone === 'majlis' ? 'transform:scale(1.1)' : 'transform:scale(1)'">
        <!-- eyebrow -->
        <p class="text-[0.55rem] font-bold uppercase tracking-[0.45em] mb-1"
           style="transition:all 2000ms ease;"
           :style="isNight()
             ? 'color:rgba(251,191,36,0.85); text-shadow:0 0 12px rgba(234,179,8,0.7), 0 0 24px rgba(234,179,8,0.4)'
             : 'color:rgba(201,169,110,0.95); text-shadow:0 2px 6px rgba(0,0,0,0.9)'"
           x-text="lang === 'ar' ? 'انقر للاستكشاف' : 'Tap to Explore'"></p>
        <!-- label -->
        <p class="font-light leading-tight"
           style="font-family:'Playfair Display','Georgia',serif; font-size:clamp(1.2rem,2.2vw,1.8rem); transition:all 2000ms ease;"
           :style="isNight()
             ? 'color:#f5f0e8; text-shadow:0 0 10px rgba(234,179,8,0.55), 0 2px 20px rgba(0,0,0,0.8)'
             : 'color:#fff; text-shadow:0 2px 6px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.5)'"
           x-text="lang === 'ar' ? 'المجلس الفاخر' : 'The Majlis Collection'"></p>
        <!-- animated underline -->
        <div style="height:1px; margin-top:6px; background:#c9a96e; transition:width 400ms ease;"
             :style="hubHoveredZone === 'majlis' ? 'width:100%' : 'width:0%'"></div>
      </div>

      <!-- Label 2: Bespoke Kitchens -->
      <div class="absolute pointer-events-none"
           style="z-index:30; left:43%; top:18%; transition:transform 300ms ease;"
           :style="hubHoveredZone === 'kitchens' ? 'transform:scale(1.1)' : 'transform:scale(1)'">
        <p class="text-[0.55rem] font-bold uppercase tracking-[0.45em] mb-1"
           style="transition:all 2000ms ease;"
           :style="isNight()
             ? 'color:rgba(251,191,36,0.85); text-shadow:0 0 12px rgba(234,179,8,0.7)'
             : 'color:rgba(201,169,110,0.95); text-shadow:0 2px 6px rgba(0,0,0,0.9)'"
           x-text="lang === 'ar' ? 'قريباً' : 'Coming Soon'"></p>
        <p class="font-light leading-tight"
           style="font-family:'Playfair Display','Georgia',serif; font-size:clamp(1rem,1.8vw,1.4rem); transition:all 2000ms ease;"
           :style="isNight()
             ? 'color:#f5f0e8; text-shadow:0 0 10px rgba(234,179,8,0.55), 0 2px 20px rgba(0,0,0,0.8)'
             : 'color:#fff; text-shadow:0 2px 6px rgba(0,0,0,0.9)'"
           x-text="lang === 'ar' ? 'المطابخ المخصصة' : 'Bespoke Kitchens'"></p>
        <div style="height:1px; margin-top:6px; background:#c9a96e; transition:width 400ms ease;"
             :style="hubHoveredZone === 'kitchens' ? 'width:100%' : 'width:0%'"></div>
      </div>

      <!-- Label 3: Premium Cots -->
      <div class="absolute pointer-events-none"
           style="z-index:30; left:56%; top:40%; transition:transform 300ms ease;"
           :style="hubHoveredZone === 'cots' ? 'transform:scale(1.1)' : 'transform:scale(1)'">
        <p class="text-[0.55rem] font-bold uppercase tracking-[0.45em] mb-1"
           style="transition:all 2000ms ease;"
           :style="isNight()
             ? 'color:rgba(251,191,36,0.85); text-shadow:0 0 12px rgba(234,179,8,0.7)'
             : 'color:rgba(201,169,110,0.95); text-shadow:0 2px 6px rgba(0,0,0,0.9)'"
           x-text="lang === 'ar' ? 'قريباً' : 'Coming Soon'"></p>
        <p class="font-light leading-tight"
           style="font-family:'Playfair Display','Georgia',serif; font-size:clamp(1rem,1.8vw,1.4rem); transition:all 2000ms ease;"
           :style="isNight()
             ? 'color:#f5f0e8; text-shadow:0 0 10px rgba(234,179,8,0.55), 0 2px 20px rgba(0,0,0,0.8)'
             : 'color:#fff; text-shadow:0 2px 6px rgba(0,0,0,0.9)'"
           x-text="lang === 'ar' ? 'الأسرة الفاخرة' : 'Premium Cots'"></p>
        <div style="height:1px; margin-top:6px; background:#c9a96e; transition:width 400ms ease;"
             :style="hubHoveredZone === 'cots' ? 'width:100%' : 'width:0%'"></div>
      </div>

      <!-- Label 4: Arabian Bedroom Sets -->
      <div class="absolute pointer-events-none"
           style="z-index:30; left:68%; top:48%; transition:transform 300ms ease;"
           :style="hubHoveredZone === 'bedroom' ? 'transform:scale(1.1)' : 'transform:scale(1)'">
        <p class="text-[0.55rem] font-bold uppercase tracking-[0.45em] mb-1"
           style="transition:all 2000ms ease;"
           :style="isNight()
             ? 'color:rgba(251,191,36,0.85); text-shadow:0 0 12px rgba(234,179,8,0.7)'
             : 'color:rgba(201,169,110,0.95); text-shadow:0 2px 6px rgba(0,0,0,0.9)'"
           x-text="lang === 'ar' ? 'قريباً' : 'Coming Soon'"></p>
        <p class="font-light leading-tight"
           style="font-family:'Playfair Display','Georgia',serif; font-size:clamp(1rem,1.8vw,1.4rem); transition:all 2000ms ease;"
           :style="isNight()
             ? 'color:#f5f0e8; text-shadow:0 0 10px rgba(234,179,8,0.55), 0 2px 20px rgba(0,0,0,0.8)'
             : 'color:#fff; text-shadow:0 2px 6px rgba(0,0,0,0.9)'"
           x-text="lang === 'ar' ? 'غرف النوم العربية' : 'Arabian Bedroom Sets'"></p>
        <div style="height:1px; margin-top:6px; background:#c9a96e; transition:width 400ms ease;"
             :style="hubHoveredZone === 'bedroom' ? 'width:100%' : 'width:0%'"></div>
      </div>

      <!-- Label 5: Storage & Almirahs -->
      <div class="absolute pointer-events-none"
           style="z-index:30; left:84%; top:24%; transition:transform 300ms ease;"
           :style="hubHoveredZone === 'storage' ? 'transform:scale(1.1)' : 'transform:scale(1)'">
        <p class="text-[0.55rem] font-bold uppercase tracking-[0.45em] mb-1"
           style="transition:all 2000ms ease;"
           :style="isNight()
             ? 'color:rgba(251,191,36,0.85); text-shadow:0 0 12px rgba(234,179,8,0.7)'
             : 'color:rgba(201,169,110,0.95); text-shadow:0 2px 6px rgba(0,0,0,0.9)'"
           x-text="lang === 'ar' ? 'قريباً' : 'Coming Soon'"></p>
        <p class="font-light leading-tight"
           style="font-family:'Playfair Display','Georgia',serif; font-size:clamp(0.9rem,1.6vw,1.2rem); transition:all 2000ms ease;"
           :style="isNight()
             ? 'color:#f5f0e8; text-shadow:0 0 10px rgba(234,179,8,0.55), 0 2px 20px rgba(0,0,0,0.8)'
             : 'color:#fff; text-shadow:0 2px 6px rgba(0,0,0,0.9)'"
           x-text="lang === 'ar' ? 'الخزائن والأدراج' : 'Storage & Almirahs'"></p>
        <div style="height:1px; margin-top:6px; background:#c9a96e; transition:width 400ms ease;"
             :style="hubHoveredZone === 'storage' ? 'width:100%' : 'width:0%'"></div>
      </div>

      <!-- ── LAYER 3: Hero Content Block ── -->
      <div class="absolute inset-x-0 bottom-0 pointer-events-none"
           style="z-index:30; padding:0 2rem 4rem 2.5rem;">

        <!-- Circadian time indicator pill -->
        <div class="flex items-center gap-2 mb-5"
             style="transition:opacity 2000ms ease;"
             :style="isNight() ? 'opacity:1' : 'opacity:0.75'">
          <div class="rounded-full animate-pulse"
               style="width:6px; height:6px; transition:background 2000ms ease;"
               :style="isNight() ? 'background:#fbbf24' : 'background:#c9a96e'"></div>
          <span class="font-bold uppercase"
                style="font-size:0.6rem; letter-spacing:0.35em; transition:all 2000ms ease;"
                :style="isNight()
                  ? 'color:rgba(251,191,36,0.9); text-shadow:0 0 8px rgba(234,179,8,0.5)'
                  : 'color:rgba(255,255,255,0.7)'"
                x-text="isNight()
                  ? (lang === 'ar' ? 'جلسة مسائية — المعرض مفتوح' : 'Evening Session — Showroom Open')
                  : (lang === 'ar' ? 'جلسة نهارية — تصفح المجموعات' : 'Day Session — Explore Collections')"></span>
        </div>

        <!-- Headline -->
        <h1 class="font-light text-white leading-tight mb-4 max-w-[600px]"
            style="font-family:'Playfair Display','Georgia',serif; font-size:clamp(2rem,4.5vw,3.8rem); text-shadow:0 4px 40px rgba(0,0,0,0.7);"
            x-text="lang === 'ar' ? (content.hero?.titleArabic || 'أثاث فاخر بلمسة سعودية') : 'Luxury Majlis with Authentic Saudi Touch'"></h1>

        <!-- Sub -->
        <p class="mb-8 max-w-[440px] leading-relaxed"
           style="font-size:0.9rem; color:rgba(255,255,255,0.65); text-shadow:0 2px 10px rgba(0,0,0,0.8);"
           x-text="lang === 'ar' ? (content.hero?.subtitleArabic || 'مرر المؤشر فوق الغرف لاستكشاف مجموعاتنا') : 'Hover the room zones above to explore our collections.'"></p>

        <!-- CTAs (pointer-events re-enabled here) -->
        <div class="flex items-center gap-5 pointer-events-auto">
          <button @click="routeHubZone('majlis')"
                  class="group rounded-full font-bold uppercase transition-all duration-300 hover:scale-105 active:scale-95"
                  style="padding:0.9rem 2.2rem; background:#c9a96e; color:#0a0a0a; font-size:0.7rem; letter-spacing:0.2em; box-shadow:0 4px 24px rgba(201,169,110,0.4);"
                  onmouseover="this.style.boxShadow='0 6px 40px rgba(201,169,110,0.6)'"
                  onmouseout="this.style.boxShadow='0 4px 24px rgba(201,169,110,0.4)'">
            <span x-text="lang === 'ar' ? 'استكشف المجلس' : 'Explore Majlis'"></span>
            <span class="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </button>
          <a href="#usp"
             class="text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300"
             style="color:rgba(255,255,255,0.45);"
             onmouseover="this.style.color='#c9a96e'"
             onmouseout="this.style.color='rgba(255,255,255,0.45)'"
             x-text="lang === 'ar' ? 'اكتشف المزيد' : 'Discover More'"></a>
        </div>
      </div>

      <!-- Scroll cue -->
      <div class="absolute flex flex-col items-center pointer-events-none"
           style="z-index:30; bottom:1.5rem; left:50%; transform:translateX(-50%); transition:opacity 500ms ease;"
           :style="scrolled ? 'opacity:0' : 'opacity:1'">
        <div style="width:1px; height:2rem; background:linear-gradient(to bottom, transparent, #c9a96e); animation:pulse 2s infinite;"></div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" stroke-width="2" style="margin-top:4px; animation:bounce 1.5s infinite;"><path d="M19 12l-7 7-7-7"/></svg>
      </div>

    </section>\n\n"""

new_content = content[:start_idx] + new_hero + content[end_idx:]

with codecs.open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replacement successful")
