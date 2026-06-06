const fs = require('fs');
const content = \<!DOCTYPE html>
<html :lang="lang" :dir="lang === 'ar' ? 'rtl' : 'ltr'" class="scroll-smooth" x-data="majlisApp()">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="data:,">
  <title x-text="lang === 'ar' ? '??????? | ???? ??????' : 'Majlis | Saeed Furniture'"></title>
  
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&family=Noto+Kufi+Arabic:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  <link rel="stylesheet" href="dist/output.css">

  <style>
    body { font-family: 'Cairo', sans-serif; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .glass-panel { background: rgba(17, 17, 20, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
  </style>

  <!-- Load Auth and App -->
  <script defer src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script defer src="js/auth.js"></script>
  <script defer src="js/app.js"></script>

  <!-- Load Swiper and Alpine -->
  <script defer src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <script defer src="https://unpkg.com/@alpinejs/intersect@3.14.1/dist/cdn.min.js"></script>
  <script defer src="https://unpkg.com/alpinejs@3.14.1/dist/cdn.min.js"></script>

  <script>
    function majlisApp() {
      // Safely inherit from saeedApp if it exists, otherwise provide fallback
      let base = { lang: 'ar', mobileMenuOpen: false, toggleLang() { this.lang = this.lang === 'ar' ? 'en' : 'ar'; } };
      if (typeof saeedApp === 'function') {
        base = saeedApp();
      }

      return {
        ...base,
        models: [],
        activeModel: null,
        sidebarOpen: false, // Desktop sidebar
        bottomSheetOpen: false, // Mobile bottom sheet
        bookingModalOpen: false,
        bookingName: '',
        bookingPhone: '',
        swiper: null,

        async init() {
          try {
            const res = await fetch('catalog.json');
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            
            // Extract the 7 items from catalog
            const items = Object.values(data.catalog_data.catalog).slice(0, 7);
            
            const localImages = [
              'images/hero.png?v=2', 
              'images/modern.png', 
              'images/authentic.png', 
              'images/heritage.png'
            ];

            this.models = items.map((item, idx) => {
              const taxonomy = item.selection_metadata.type_id.replace('type_', '').replace(/_/g, ' ');
              return {
                id: item.id,
                name: item.selection_metadata.public_display_name,
                taxonomy: taxonomy.charAt(0).toUpperCase() + taxonomy.slice(1),
                desc: item.product_information.design_intent,
                imgs: [
                  localImages[idx % localImages.length],
                  localImages[(idx + 1) % localImages.length],
                  localImages[(idx + 2) % localImages.length]
                ]
              };
            });

            if (this.models.length > 0) {
              this.activeModel = this.models[0];
            }
            
            this.\('activeModel', () => {
              this.initSwiper();
            });
            
            setTimeout(() => this.initSwiper(), 100);

          } catch (err) {
            console.error('Failed to load catalog:', err);
          }
        },
        
        selectModel(model) {
          this.activeModel = model;
          this.sidebarOpen = false;
          this.bottomSheetOpen = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        initSwiper() {
          if (this.swiper) {
            this.swiper.destroy(true, true);
          }
          if (typeof Swiper !== 'undefined') {
            this.swiper = new Swiper('.majlis-swiper', {
              pagination: { el: '.swiper-pagination', clickable: true },
              navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
              loop: true,
              grabCursor: true
            });
          }
        },

        shareReference() {
          const text = this.lang === 'ar'
            ? \??????? ??? ???? ?????? ??? ??????:\\n?????: \\\n???????: \\\n?????: \\
            : \Hello, I am interested in this design:\\nStyle: \\\nModel: \\\nCode: \\;
          
          const whatsappUrl = \https://wa.me/?text=\\;
          window.open(whatsappUrl, '_blank');
        },
        
        bookModel() {
          if (!this.bookingName || !this.bookingPhone) {
            alert(this.lang === 'ar' ? '???? ????? ????? ???? ??????' : 'Please enter your name and phone number');
            return;
          }
          const text = this.lang === 'ar'
            ? \??? ??? ????:\\n?????: \\\n??????: \\\n???????: \ (\)\
            : \Majlis Booking Request:\\nName: \\\nPhone: \\\nModel: \ (\)\;
          
          const whatsappUrl = \https://wa.me/966500000000?text=\\;
          window.open(whatsappUrl, '_blank');
          this.bookingModalOpen = false;
          this.bookingName = '';
          this.bookingPhone = '';
        }
      };
    }
  </script>
</head>
<body class="bg-[#111114] text-white font-sans antialiased overflow-x-hidden selection:bg-[#c9a96e]/30 selection:text-white">

  <!-- Fixed Header (No collections links) -->
  <header class="fixed top-0 inset-x-0 z-50 transition-all duration-500 glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
    <a href="index.html" class="flex items-center gap-3">
      <img src="images/logo.png" alt="Saeed Furniture" class="h-8 object-contain" style="filter: invert(1) sepia(1) saturate(1.5) hue-rotate(5deg) brightness(1.2);">
      <span class="text-sm font-bold tracking-wide" style="font-family: 'Noto Kufi Arabic', sans-serif;">???? ????</span>
    </a>
    
    <div class="flex items-center gap-4">
      <button @click="toggleLang()" class="text-xs font-bold uppercase tracking-widest px-3 py-1.5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
        <span x-text="lang === 'ar' ? 'EN' : 'AR'"></span>
      </button>
      
      <!-- Desktop Gallery Toggle -->
      <button @click="sidebarOpen = !sidebarOpen" class="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 bg-[#c9a96e] text-black rounded-full hover:bg-[#d4b87a] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        <span x-text="lang === 'ar' ? '??????' : 'Gallery'"></span>
      </button>
      
      <!-- Mobile Gallery Toggle -->
      <button @click="bottomSheetOpen = true" class="md:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 bg-[#c9a96e] text-black rounded-full hover:bg-[#d4b87a] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      </button>
    </div>
  </header>

  <!-- Main Split Layout (Desktop) / Stacked (Mobile) -->
  <main class="pt-20 min-h-screen flex flex-col md:flex-row relative">
    
    <!-- Primary Viewer -->
    <div class="flex-1 flex flex-col relative transition-all duration-500" :class="sidebarOpen ? 'md:pr-[400px]' : ''" dir="ltr">
      <template x-if="activeModel">
        <div class="flex-1 flex flex-col p-4 md:p-8">
          
          <!-- Image Carousel -->
          <div class="relative w-full aspect-square md:aspect-[16/9] lg:aspect-[2/1] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <div class="swiper majlis-swiper w-full h-full">
              <div class="swiper-wrapper">
                <template x-for="img in activeModel.imgs">
                  <div class="swiper-slide w-full h-full bg-[#1a1a1f] flex items-center justify-center">
                    <img :src="img" class="w-full h-full object-cover">
                  </div>
                </template>
              </div>
              <div class="swiper-pagination"></div>
              <div class="swiper-button-prev !text-white/70 hover:!text-white after:!text-2xl"></div>
              <div class="swiper-button-next !text-white/70 hover:!text-white after:!text-2xl"></div>
            </div>
          </div>
          
          <!-- Details & Actions -->
          <div class="mt-8 flex flex-col md:flex-row gap-8 justify-between items-start" :dir="lang === 'ar' ? 'rtl' : 'ltr'">
            <div class="max-w-2xl">
              <span class="text-xs uppercase tracking-[0.3em] text-[#c9a96e] font-bold" x-text="activeModel.taxonomy"></span>
              <h1 class="text-3xl md:text-5xl font-light mt-2 mb-4" style="font-family: 'Playfair Display', serif;" x-text="activeModel.name"></h1>
              <p class="text-white/60 leading-relaxed text-sm md:text-base" x-text="activeModel.desc"></p>
            </div>
            
            <div class="flex flex-col gap-3 w-full md:w-auto shrink-0">
              <button @click="bookingModalOpen = true" class="w-full md:w-64 py-4 bg-[#c9a96e] text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#d4b87a] transition-colors rounded-sm text-center">
                <span x-text="lang === 'ar' ? '??? ??? ???????' : 'Book This Design'"></span>
              </button>
              <button @click="shareReference()" class="w-full md:w-64 py-4 bg-transparent border border-[#c9a96e]/40 text-[#c9a96e] font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#c9a96e]/10 transition-colors rounded-sm flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                <span x-text="lang === 'ar' ? '?????? ??????' : 'Share Reference'"></span>
              </button>
            </div>
          </div>

        </div>
      </template>
    </div>

    <!-- Desktop Sidebar Gallery -->
    <div class="hidden md:flex flex-col fixed top-0 right-0 bottom-0 w-[400px] glass-panel border-l border-white/10 z-40 transition-transform duration-500 pt-20"
         :class="sidebarOpen ? 'translate-x-0' : 'translate-x-full'" dir="ltr">
      <div class="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 class="text-lg font-bold" style="font-family: 'Playfair Display', serif;" x-text="lang === 'ar' ? '??????' : 'Gallery'"></h3>
        <button @click="sidebarOpen = false" class="text-white/50 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto hide-scrollbar p-6 grid grid-cols-2 gap-4 content-start">
        <template x-for="model in models" :key="model.id">
          <div @click="selectModel(model)" class="cursor-pointer group relative aspect-square border border-white/5 rounded-sm overflow-hidden" :class="activeModel?.id === model.id ? 'border-[#c9a96e] shadow-[0_0_0_1px_#c9a96e]' : 'hover:border-white/20'">
            <img :src="model.imgs[0]" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
            <div class="absolute bottom-3 inset-x-3">
              <div class="text-[0.6rem] text-[#c9a96e] uppercase tracking-widest truncate" x-text="model.taxonomy"></div>
              <div class="text-xs font-bold text-white truncate" x-text="model.name"></div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Mobile Bottom Sheet Gallery -->
    <div class="md:hidden fixed inset-0 z-50 flex flex-col justify-end pointer-events-none" :class="bottomSheetOpen ? 'pointer-events-auto' : ''" dir="ltr">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
           :class="bottomSheetOpen ? 'opacity-100' : 'opacity-0'" 
           @click="bottomSheetOpen = false"></div>
      
      <!-- Sheet -->
      <div class="relative bg-[#111114] border-t border-white/10 rounded-t-2xl w-full h-[80vh] flex flex-col transition-transform duration-500"
           :class="bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'">
        <div class="p-4 flex justify-center">
          <div class="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>
        <div class="px-6 pb-4 flex items-center justify-between border-b border-white/5">
          <h3 class="text-lg font-bold" style="font-family: 'Playfair Display', serif;" x-text="lang === 'ar' ? '??????' : 'Gallery'"></h3>
          <button @click="bottomSheetOpen = false" class="text-white/50 hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto hide-scrollbar p-6 grid grid-cols-2 gap-4 content-start">
          <template x-for="model in models" :key="model.id">
            <div @click="selectModel(model)" class="cursor-pointer group relative aspect-square border border-white/5 rounded-sm overflow-hidden" :class="activeModel?.id === model.id ? 'border-[#c9a96e] shadow-[0_0_0_1px_#c9a96e]' : 'hover:border-white/20'">
              <img :src="model.imgs[0]" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
              <div class="absolute bottom-3 inset-x-3">
                <div class="text-[0.6rem] text-[#c9a96e] uppercase tracking-widest truncate" x-text="model.taxonomy"></div>
                <div class="text-xs font-bold text-white truncate" x-text="model.name"></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

  </main>

  <!-- Booking Modal -->
  <div x-show="bookingModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="display: none;" :dir="lang === 'ar' ? 'rtl' : 'ltr'">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="bookingModalOpen = false" x-transition.opacity></div>
    <div class="relative glass-panel border border-white/10 rounded-lg w-full max-w-md p-8 shadow-2xl" x-transition>
      <button @click="bookingModalOpen = false" class="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      
      <h3 class="text-2xl font-light mb-2 text-[#c9a96e]" style="font-family: 'Playfair Display', serif;" x-text="lang === 'ar' ? '????? ?????' : 'Confirm Booking'"></h3>
      <p class="text-white/60 text-sm mb-8" x-text="lang === 'ar' ? '???? ??????? ???????? ??? ?????? ??????.' : 'Enter your details and our team will contact you shortly.'"></p>
      
      <div class="space-y-4">
        <div>
          <label class="block text-xs uppercase tracking-widest text-white/50 mb-2" x-text="lang === 'ar' ? '????? ??????' : 'Full Name'"></label>
          <input type="text" x-model="bookingName" class="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#c9a96e] transition-colors">
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest text-white/50 mb-2" x-text="lang === 'ar' ? '??? ??????' : 'Phone Number'"></label>
          <input type="tel" x-model="bookingPhone" class="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#c9a96e] transition-colors" dir="ltr">
        </div>
        
        <button @click="bookModel()" class="w-full mt-4 py-4 bg-[#c9a96e] text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#d4b87a] transition-colors rounded-sm text-center">
          <span x-text="lang === 'ar' ? '????? ?????' : 'Submit Request'"></span>
        </button>
      </div>
    </div>
  </div>

</body>
</html>
\
fs.writeFileSync('majlis.html', content);
console.log('Successfully created majlis.html');
