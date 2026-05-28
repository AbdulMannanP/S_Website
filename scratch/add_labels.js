const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// The replacement logic:
// 1. Add x-data="{ hoverTarget: null }" to <section id="hero">
html = html.replace('<section id="hero"\n             class="relative overflow-hidden bg-stone-950 w-full h-screen"', '<section id="hero" x-data="{ hoverTarget: null }"\n             class="relative overflow-hidden bg-stone-950 w-full h-screen"');

// 2. Add @mouseenter and @mouseleave to each polygon
html = html.replace(/<polygon id="poly-majlis"(.*?)@click="([^"]+)" \/>/g, '<polygon id="poly-majlis"$1@click="$2" @mouseenter="hoverTarget = \'majlis\'" @mouseleave="hoverTarget = null" />');
html = html.replace(/<polygon id="poly-kitchens"(.*?)@click="([^"]+)" \/>/g, '<polygon id="poly-kitchens"$1@click="$2" @mouseenter="hoverTarget = \'kitchen\'" @mouseleave="hoverTarget = null" />');
html = html.replace(/<polygon id="poly-cots"(.*?)@click="([^"]+)" \/>/g, '<polygon id="poly-cots"$1@click="$2" @mouseenter="hoverTarget = \'cot\'" @mouseleave="hoverTarget = null" />');
html = html.replace(/<polygon id="poly-bedroom"(.*?)@click="([^"]+)" \/>/g, '<polygon id="poly-bedroom"$1@click="$2" @mouseenter="hoverTarget = \'bedroom\'" @mouseleave="hoverTarget = null" />');
html = html.replace(/<polygon id="poly-almirah"(.*?)@click="([^"]+)" \/>/g, '<polygon id="poly-almirah"$1@click="$2" @mouseenter="hoverTarget = \'almirah\'" @mouseleave="hoverTarget = null" />');

// 3. Inject Layer 5 for the hover labels
const layer5 = `
      <!-- LAYER 5: Hover Labels -->
      <div class="absolute inset-0 z-30 pointer-events-none">
        <!-- Majlis Label -->
        <div class="absolute top-[75%] left-[25%] -translate-x-1/2 -translate-y-10 transition-all duration-300"
             :class="hoverTarget === 'majlis' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'">
          <span class="bg-black/80 backdrop-blur-md text-[#c9a96e] text-xs px-3 py-1.5 rounded-full border border-[#c9a96e]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] tracking-widest uppercase font-bold" x-text="lang === 'ar' ? 'المجلس' : 'The Majlis'"></span>
        </div>
        <!-- Kitchens Label -->
        <div class="absolute top-[35%] left-[52.5%] -translate-x-1/2 -translate-y-10 transition-all duration-300"
             :class="hoverTarget === 'kitchen' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'">
          <span class="bg-black/80 backdrop-blur-md text-[#c9a96e] text-xs px-3 py-1.5 rounded-full border border-[#c9a96e]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] tracking-widest uppercase font-bold" x-text="lang === 'ar' ? 'المطابخ' : 'Bespoke Kitchens'"></span>
        </div>
        <!-- Cots Label -->
        <div class="absolute top-[62.5%] left-[70%] -translate-x-1/2 -translate-y-10 transition-all duration-300"
             :class="hoverTarget === 'cot' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'">
          <span class="bg-black/80 backdrop-blur-md text-[#c9a96e] text-xs px-3 py-1.5 rounded-full border border-[#c9a96e]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] tracking-widest uppercase font-bold" x-text="lang === 'ar' ? 'الأسرة' : 'Premium Cots'"></span>
        </div>
        <!-- Bedroom Label -->
        <div class="absolute top-[65%] left-[87.5%] -translate-x-1/2 -translate-y-10 transition-all duration-300"
             :class="hoverTarget === 'bedroom' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'">
          <span class="bg-black/80 backdrop-blur-md text-[#c9a96e] text-xs px-3 py-1.5 rounded-full border border-[#c9a96e]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] tracking-widest uppercase font-bold" x-text="lang === 'ar' ? 'غرف النوم' : 'Arabian Bedroom'"></span>
        </div>
        <!-- Almirah Label -->
        <div class="absolute top-[35%] left-[87.5%] -translate-x-1/2 -translate-y-10 transition-all duration-300"
             :class="hoverTarget === 'almirah' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'">
          <span class="bg-black/80 backdrop-blur-md text-[#c9a96e] text-xs px-3 py-1.5 rounded-full border border-[#c9a96e]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] tracking-widest uppercase font-bold" x-text="lang === 'ar' ? 'الخزائن' : 'Storage & Almirah'"></span>
        </div>
      </div>
      </section>`;

html = html.replace('      </section>', layer5);

fs.writeFileSync('frontend/index.html', html);
console.log('Hover targets and labels added!');
