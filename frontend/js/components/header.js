/**
 * header.js — Universal Header Component
 * Saeed Furniture | Principal Frontend Architecture
 *
 * Injects the canonical global header into any element with id="global-header".
 * - Brutalist solid background (no glassmorphism)
 * - Stacked two-line premium logo lockup
 * - RTL-safe logical properties (ms-auto, pe-6)
 * - WCAG-compliant 44x44px touch targets
 * - Full Alpine.js reactivity (reads x-data from parent body scope)
 *
 * Usage: <div id="global-header"></div>
 *        <script src="/js/components/header.js"></script>
 */
(function () {
  const HEADER_HTML = `
    <!-- ── Universal Global Header ─────────────────────── -->
    <div x-data="{ mobileMenuOpen: false, headerHidden: false, lastScroll: window.pageYOffset || 0, currY: window.pageYOffset || 0 }" @scroll.window="currY = window.pageYOffset; headerHidden = (currY > lastScroll && currY > 100); lastScroll = currY;">
    <header
      class="fixed top-0 left-0 w-full z-[100] h-20 flex items-center justify-between px-6 sm:px-12 transition-all duration-300 ease-in-out border-b border-[#c9a96e]/10"
      :class="[(headerHidden ? '-translate-y-full' : 'translate-y-0'), (lang === 'ar' ? 'flex-row-reverse' : ''), (currY > 50 ? 'bg-[#050506] shadow-md' : 'bg-transparent')]"
    >
      <!-- ── Logo Lockup ──────────────────────────────── -->
      <a href="/index.html" class="h-12 flex items-center gap-3 transition-transform duration-500 hover:scale-105 flex-shrink-0" :class="lang === 'ar' ? 'flex-row-reverse' : ''">
        <img
          src="https://ik.imagekit.io/de7qvcvqv/images/logo.png?updatedAt=1779608592778"
          loading="eager"
          alt="Saeed Furniture"
          width="32" height="32"
          class="h-8 w-auto object-contain drop-shadow-[0_0_15px_rgba(201,169,110,0.3)]"
          style="filter: invert(1) sepia(1) saturate(1.5) hue-rotate(5deg) brightness(1.2);"
        >
        <!-- Stacked Two-Line Premium Logo -->
        <div class="flex flex-col justify-center">
          <span class="block font-serif text-2xl leading-none text-white">Saeed</span>
          <span class="block font-sans text-[0.65rem] uppercase tracking-[0.3em] text-[#A68A56] mt-1">Furniture</span>
        </div>
      </a>

      <!-- ── Desktop Navigation ───────────────────────── -->
      <nav class="hidden md:flex items-center gap-6 text-[0.75rem] font-bold text-white/60 uppercase tracking-[0.12em] min-h-[44px] ms-auto pe-6" :class="lang === 'ar' ? 'flex-row-reverse' : ''">
        <a href="/index.html#about"
           x-show="!isSelectionMode"
           class="hover:text-[#c9a96e] transition-colors flex items-center min-h-[44px] whitespace-nowrap text-start"
           x-text="lang === 'ar' ? 'من نحن' : 'About'">About</a>

        <a href="/select.html"
           x-show="!isSelectionMode"
           class="hover:text-[#c9a96e] transition-colors flex items-center min-h-[44px] whitespace-nowrap text-start"
           x-text="lang === 'ar' ? 'المجموعات' : 'Collections'">Collections</a>

        <a href="/index.html#faq"
           x-show="!isSelectionMode"
           class="hover:text-[#c9a96e] transition-colors flex items-center min-h-[44px] whitespace-nowrap text-start"
           x-text="lang === 'ar' ? 'الأسئلة' : 'FAQ'">FAQ</a>

        <a href="/contact.html"
           class="hover:text-[#c9a96e] transition-colors flex items-center min-h-[44px] whitespace-nowrap text-start"
           x-text="lang === 'ar' ? 'تواصل' : 'Contact'">Contact</a>

        <button
          @click="typeof handleOrderClick === 'function' ? handleOrderClick() : null"
          class="relative hover:text-white transition-colors flex items-center min-h-[44px] font-bold uppercase tracking-[0.12em] text-[0.75rem] text-[#c9a96e] whitespace-nowrap text-start"
          x-text="\$store.saeedAuth?.user ? (lang === 'ar' ? 'طلباتي' : 'My Orders') : (lang === 'ar' ? 'اطلب الآن' : 'Order')">
          Order
        </button>

        <!-- Desktop Language Toggle -->
        <div class="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 relative z-50 ms-4" dir="ltr">
          <button
            @click="lang = 'en'; localStorage.setItem('saeed_lang', 'en'); document.documentElement.dir = 'ltr'; document.documentElement.lang = 'en';"
            :class="lang === 'en' ? 'bg-[#c9a96e] text-white' : 'text-white/60 hover:text-white'"
            class="px-3 py-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-xs font-bold rounded-full transition-all">
            EN
          </button>
          <button
            @click="lang = 'ar'; localStorage.setItem('saeed_lang', 'ar'); document.documentElement.dir = 'rtl'; document.documentElement.lang = 'ar';"
            :class="lang === 'ar' ? 'bg-[#c9a96e] text-white' : 'text-white/60 hover:text-white'"
            class="px-3 py-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-xs font-bold rounded-full transition-all"
            style="font-family:'Noto Kufi Arabic',sans-serif;">
            عربي
          </button>
        </div>
      </nav>

      <!-- ── Mobile Hamburger ─────────────────────────── -->
      <div class="flex items-center gap-4 flex-shrink-0 ms-auto md:ms-0" dir="ltr">
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle Mobile Menu"
          class="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/70 hover:text-[#c9a96e] transition-colors">
          <svg x-show="!mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <svg x-show="mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
            <line x1="6" y1="6" x2="18" y2="18"/>
            <line x1="18" y1="6" x2="6" y2="18"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- ── Mobile Full-Screen Overlay Menu ─────────────── -->
    <div
      x-show="mobileMenuOpen"
      x-cloak
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0"
      x-transition:enter-end="opacity-100"
      x-transition:leave="transition ease-in duration-200"
      x-transition:leave-start="opacity-100"
      x-transition:leave-end="opacity-0"
      class="fixed inset-0 z-[90] bg-[#080809]/97 flex flex-col items-center justify-center gap-8 md:hidden">

      <!-- Close Button -->
      <button
        @click="mobileMenuOpen = false"
        aria-label="Close Menu"
        class="absolute top-6 end-6 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-[#c9a96e]/30 text-white hover:bg-[#c9a96e] hover:text-black transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Mobile Logo -->
      <div class="flex flex-col items-center mb-4">
        <span class="block font-serif text-3xl leading-none text-white">Saeed</span>
        <span class="block font-sans text-[0.65rem] uppercase tracking-[0.4em] text-[#A68A56] mt-1">Furniture</span>
      </div>

      <div class="w-12 h-px bg-[#c9a96e]/30"></div>

      <a href="/index.html#about"   @click="mobileMenuOpen = false" class="text-xl font-light text-white/70 hover:text-[#c9a96e] transition-colors uppercase tracking-[0.3em] text-start" x-text="lang === 'ar' ? 'من نحن' : 'About'">About</a>
      <a href="/select.html"         @click="mobileMenuOpen = false" class="text-xl font-light text-white/70 hover:text-[#c9a96e] transition-colors uppercase tracking-[0.3em] text-start" x-text="lang === 'ar' ? 'المجموعات' : 'Collections'">Collections</a>
      <a href="/index.html#faq"      @click="mobileMenuOpen = false" class="text-xl font-light text-white/70 hover:text-[#c9a96e] transition-colors uppercase tracking-[0.3em] text-start" x-text="lang === 'ar' ? 'الأسئلة' : 'FAQ'">FAQ</a>
      <a href="/contact.html"        @click="mobileMenuOpen = false" class="text-xl font-light text-white/70 hover:text-[#c9a96e] transition-colors uppercase tracking-[0.3em] text-start" x-text="lang === 'ar' ? 'تواصل' : 'Contact'">Contact</a>

      <button
        @click="typeof handleOrderClick === 'function' ? handleOrderClick() : null; mobileMenuOpen = false"
        class="text-2xl font-light text-[#c9a96e] hover:text-[#c9a96e]/80 transition-colors uppercase tracking-[0.3em] text-start"
        x-text="\$store.saeedAuth?.user ? (lang === 'ar' ? 'طلباتي' : 'My Orders') : (lang === 'ar' ? 'اطلب الآن' : 'Order')">
        Order
      </button>

      <div class="w-12 h-px bg-[#c9a96e]/30"></div>

      <!-- Mobile Language Toggle -->
      <div class="flex items-center bg-white/5 border border-white/10 rounded-full p-1" dir="ltr">
        <button
          @click="lang = 'en'; localStorage.setItem('saeed_lang', 'en'); document.documentElement.dir = 'ltr'; document.documentElement.lang = 'en';"
          :class="lang === 'en' ? 'bg-[#c9a96e] text-white' : 'text-white/60 hover:text-white'"
          class="px-6 py-2 min-h-[44px] text-sm font-bold rounded-full transition-all">
          EN
        </button>
        <button
          @click="lang = 'ar'; localStorage.setItem('saeed_lang', 'ar'); document.documentElement.dir = 'rtl'; document.documentElement.lang = 'ar';"
          :class="lang === 'ar' ? 'bg-[#c9a96e] text-white' : 'text-white/60 hover:text-white'"
          class="px-6 py-2 min-h-[44px] text-sm font-bold rounded-full transition-all"
          style="font-family:'Noto Kufi Arabic',sans-serif;">
          عربي
        </button>
      </div>
    </div>
    </div>`;

  // Find the mount point and inject
  function mountHeader() {
    const mountPoint = document.getElementById('global-header');
    if (!mountPoint) return;
    mountPoint.innerHTML = HEADER_HTML;

    // Re-initialize Alpine on the newly injected DOM if Alpine is already booted
    if (window.Alpine) {
      window.Alpine.initTree(mountPoint);
    }
  }

  // Mount immediately if DOM is ready, otherwise wait for it
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountHeader);
  } else {
    mountHeader();
  }
})();
