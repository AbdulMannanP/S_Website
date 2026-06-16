// Changed to local path to load the newly generated HD images directly from the filesystem.
  const IMAGE_BASE_URL = './';
  window.IMAGE_BASE_URL = IMAGE_BASE_URL;
  // Relative URL
  const API = window.location.origin;
  let autoSaveController = null;

  window.saeedApp = function saeedApp() {
    return {
      /* ── UI State ─────────────────────────────────────── */
      lang:              'ar',
      isSelectionMode:   false,
      step:              'hero', // hero, selection, form, success
      showExitPopup:     false,
      selectedVariationItem: null,
      isNightMode:       false,
      currentHour:       new Date().getHours(), // Chronological Hub: real-time hour
      hubHoveredZone:    null,                  // which SVG zone is hovered
      progress:          5,
      loading:           true,
      submitting:        false,
      submitError:       '',
      phoneError:        '',
      accessoriesClicked: false,
      scrolled:          false,
      activeShowroom:    'gateway', // SPA route: gateway|majlis|kitchen|bedroom|cot|almirah
      mobileMenuOpen:    false,
      highlightWhatsApp: false,

      /* ── Content CMS ──────────────────────────────────── */
      content: { brand:{}, hero:{}, usps:[], styles:{options:[]}, capacity:{options:[]}, contact:{}, success:{} },

      /* ── Debounce Timers ──────────────────────────────── */
      _phoneTimer: null,
      _nameTimer:  null,
      _cityTimer:  null,
      _visionTimer: null,

      /* ── Session State Model ──────────────────────────── */
      form: {
        order_id:          null,
        session_id:        null,
        name:              '',
        phone:             '',
        district_city:     '',
        selected_model_id: '',
        capacity_selected: '',
        visit_mode:        'Home Visit',
        vision_notes:      '',
        last_step:         'hero',
        status:            'draft',
        score:             0,
        time_spent:        0,
        source:            'website',
        user_agent:        '',
        referrer:          '',
        company_name:      '',
        preferred_contact_time: 'Morning',
        email:             ''
      },

      /* ── Catalog Hierarchy State ──────────────────────── */
      catalog:           null,
      selectionLevel:    'type', // 'type', 'subtype', 'variation'
      selectedType:      null,
      selectedSubtype:   null,
      selectedVariation: null,
      selectedVariationUrl: '',
      heroImageLoaded:   false,
      showOptional:      false,
      lookbookStageVisible: false,
      toastMessage:      '',
      toastVisible:      false,
      swiper:            null,
      
      get lookbookItems() {
        if (!this.catalog || !this.catalog.taxonomy_tree) return [];
        let items = [];
        let imgIndex = 0;
        this.catalog.taxonomy_tree.forEach(type => {
          if(!type.subtypes) return;
          type.subtypes.forEach(subtype => {
            if(!subtype.variations) return;
            subtype.variations.forEach(variation => {
              const mainImg = IMAGE_BASE_URL + ['images/hero.png?v=2','images/modern.png','images/authentic.png','images/heritage.png'][imgIndex % 4];
              const var1 = IMAGE_BASE_URL + ['images/modern.png','images/authentic.png','images/heritage.png','images/hero.png?v=2'][imgIndex % 4];
              const var2 = IMAGE_BASE_URL + ['images/authentic.png','images/heritage.png','images/hero.png?v=2','images/modern.png'][imgIndex % 4];
              items.push({
                type: type,
                subtype: subtype,
                variation: variation,
                id: variation.internal_id,
                catalog_item_id: variation.catalog_item_id,
                name: variation.public_display_name,
                typeName: type.public_display_name,
                unsplashUrl: mainImg,
                gallery: [mainImg, var1, var2]
              });
              imgIndex++;
            });
          });
        });
        return items;
      },
      
      shareReference() {
        const text = this.lang === 'ar' 
          ? `مرحباً، أنا مهتم بتصميم هذا المجلس:\nالنمط: ${this.selectedType?.public_display_name}\nالموديل: ${this.selectedVariation?.public_display_name}\nالرمز: ${this.selectedVariation?.internal_id}`
          : `Hello, I'm interested in this design:\nStyle: ${this.selectedType?.public_display_name}\nModel: ${this.selectedVariation?.public_display_name}\nCode: ${this.selectedVariation?.internal_id}`;
        
        if (navigator.share) {
          navigator.share({ title: 'Saeed Furniture Design', text: text }).catch(console.error);
        } else {
          navigator.clipboard.writeText(text);
          this.showToast(this.lang === 'ar' ? 'تم نسخ المرجع إلى الحافظة' : 'Reference copied to clipboard');
        }
      },
      
      showToast(msg) {
        this.toastMessage = msg;
        this.toastVisible = true;
        setTimeout(() => { this.toastVisible = false; }, 3000);
      },
      
      initSwiper() {
        if(this.swiper || typeof Swiper === 'undefined') return;
        this.swiper = new Swiper('.lookbook-swiper', {
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          spaceBetween: 16,
          touchStartPreventDefault: false,
          touchReleaseOnEdges: true,
          passiveListeners: true,
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          on: {
            sliderMove: () => { 
              if(!this.lookbookStageVisible) this.lookbookStageVisible = true; 
            },
            slideChange: (s) => {
              const items = this.lookbookItems;
              if (items[s.activeIndex]) {
                const item = items[s.activeIndex];
                this.heroImageLoaded = false;
                this.selectedVariation = item.variation;
                this.selectedSubtype = item.subtype;
                this.selectedType = item.type;
                this.selectedVariationUrl = item.unsplashUrl;
                this.selectedVariationItem = item;
                
                // Preload to trigger fade-in transition
                const img = new Image();
                img.onload = () => { this.heroImageLoaded = true; };
                img.onerror = () => { this.heroImageLoaded = true; };
                img.src = item.unsplashUrl || IMAGE_BASE_URL + 'images/hero.png?v=2';
              }
            }
          }
        });
        const items = this.lookbookItems;
        if(items.length > 0) {
          this.selectedVariation = items[0].variation;
          this.selectedSubtype = items[0].subtype;
          this.selectedType = items[0].type;
          this.selectedVariationUrl = items[0].unsplashUrl;
          this.selectedVariationItem = items[0];
          
          this.heroImageLoaded = false;
          const img = new Image();
          img.onload = () => { this.heroImageLoaded = true; };
          img.onerror = () => { this.heroImageLoaded = true; };
          img.src = items[0].unsplashUrl || IMAGE_BASE_URL + 'images/hero.png';
        }
      },
      
      scrollToCategory(typeName) {
        const items = this.lookbookItems;
        const idx = items.findIndex(i => i.typeName === typeName);
        if(idx !== -1 && this.swiper) {
          this.swiper.slideTo(idx);
          this.lookbookStageVisible = true;
        }
      },

      /* ── init ─────────────────────────────────────────── */
      /* ── Chronological State Helper ───────────────────── */
      isNight() {
        return this.currentHour < 6 || this.currentHour >= 18;
      },

      showHubToast(msgEn, msgAr) {
        this.toastMessage = this.lang === 'ar' ? msgAr : msgEn;
        this.toastVisible = true;
        setTimeout(() => { this.toastVisible = false; }, 3200);
      },

      routeHubZone(zone) {
          const validNodes = ['majlis', 'kitchen', 'bedroom', 'cot', 'almirah'];
          if (validNodes.includes(zone)) {
            this.activeShowroom = zone;
            window.scrollTo({ top: 0 });
            if (zone === 'majlis') {
              this.isSelectionMode = true;
              this.step = 'selection';
            }
          } else {
            this.showHubToast('Coming Soon', 'قريباً');
          }
        },

      async init() {
        const currentHour = new Date().getHours();
        this.currentHour = currentHour;
        this.isNightMode = currentHour >= 18 || currentHour < 6;

        // Twilight Crossfade — re-check every 60s for threshold crossing
        setInterval(() => {
          const h = new Date().getHours();
          this.currentHour = h;
          this.isNightMode = h >= 18 || h < 6;
        }, 60_000);
        
        this.form.user_agent = navigator.userAgent;
        this.form.referrer   = document.referrer;

        // Safety timeout: force splash screen dismissal after 2.5s
        // even if a non-critical asset (favicon, CDN image) fails to load
        const splashTimeout = setTimeout(() => {
          if (this.loading) {
            console.warn('[SPLASH] Safety timeout — forcing transition');
            this.loading = false;
          }
        }, 2500);
        
        // Load language preference from local storage if exists
        const savedLang = localStorage.getItem('saeed_lang');
        if (savedLang === 'en') {
          this.toggleLang(false);
        }

        try {
          const r = await fetch('./content.json');
          this.content = await r.json();
        } catch (e) { console.error('[CMS]', e); }

        try {
          const r = await fetch('./catalog.json');
          this.catalog = (await r.json()).catalog_data;
        } catch (e) { console.error('[CATALOG]', e); }

        try {
          const r = await fetch(`${API}/api/session`);
          const d = await r.json();
          if (d.success) {
            this.form.order_id   = d.order_id;
            this.form.session_id = d.session_id;
          } else {
            throw new Error('Session creation failed');
          }
        } catch (e) {
          this.form.order_id   = 'SF-LOCAL';
          this.form.session_id = crypto.randomUUID?.() || 'local-session';
        }

        clearTimeout(splashTimeout);
        this.loading = false;

        // Watch auth state — smart pre-fill name/phone when user logs in
        this.$watch('$store.saeedAuth.user', (user) => {
          if (user) {
            this.form.email = user.email;
            const auth = Alpine.store('saeedAuth');
            if (!this.form.name  && auth.fullName) this.form.name  = auth.fullName;
            if (!this.form.phone && auth.phone)    this.form.phone = auth.phone;
          }
        });
        // Also pre-fill immediately if already logged in at load time
        Alpine.nextTick(() => {
          const auth = Alpine.store('saeedAuth');
          if (auth?.user) {
            if (!this.form.name  && auth.fullName) this.form.name  = auth.fullName;
            if (!this.form.phone && auth.phone)    this.form.phone = auth.phone;
            this.form.email = auth.user.email || '';
          }
        });

        setInterval(() => {
          if (this.form.status === 'final') return;
          this.form.time_spent += 25;
          this.autoSave();
        }, 25_000);

        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            if (!this.form.order_id || this.form.order_id === 'SF-LOCAL') return;
            const auth = Alpine.store('saeedAuth');
            const headers = { 'Content-Type': 'application/json' };
            if (auth?.user?.email) headers['x-user-email'] = auth.user.email;
            
            const sendFetch = (h) => {
              fetch(`${API}/api/lead`, {
                method: 'POST',
                headers: h,
                body: JSON.stringify(this.form),
                keepalive: true
              }).catch(() => {});
            };

            if (auth?.supabase) {
              auth.supabase.auth.getSession().then(({ data }) => {
                if (data?.session?.access_token) headers['Authorization'] = `Bearer ${data.session.access_token}`;
                sendFetch(headers);
              }).catch(() => sendFetch(headers));
            } else {
              sendFetch(headers);
            }
          }
        });
      },

      /* ── Language Toggle ──────────────────────────────── */
      toggleLang(toggle = true) {
        if (toggle) {
          this.lang = this.lang === 'ar' ? 'en' : 'ar';
        } else {
          this.lang = 'en';
        }
        document.documentElement.lang = this.lang;
        document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('saeed_lang', this.lang);
      },

      /* ── autoSave ─────────────────────────────────────── */
      async autoSave() {
        if (!this.isSelectionMode || !this.form.order_id || this.form.order_id === 'SF-LOCAL' || this.submitting) return;

        // Prevent multiple concurrent saves
        if (autoSaveController) autoSaveController.abort();
        autoSaveController = new AbortController();

        try {
          const auth = Alpine.store('saeedAuth');
          const headers = { 'Content-Type': 'application/json' };
          if (auth?.user?.email) headers['x-user-email'] = auth.user.email;
          if (auth?.supabase) {
             const { data } = await auth.supabase.auth.getSession();
             if (data?.session?.access_token) headers['Authorization'] = `Bearer ${data.session.access_token}`;
          }

          await fetch(`${API}/api/lead`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(this.form),
            signal: autoSaveController.signal
          });
        } catch (e) {
          if (e.name !== 'AbortError') console.warn('[AUTOSAVE] failed');
        }
      },

      calculateScore() {
        let s = 0;
        if (this.form.style_selected || this.form.selected_model_id) s += 10;
        if (this.form.capacity_selected) s += 20;
        if (this.form.phone.trim())      s += 80;
        if (this.form.status === 'final') s += 100;
        return s;
      },

      goToStep(next) {
        this.step            = next;
        this.form.last_step  = next;
        this.form.score      = this.calculateScore();
        this.updateProgress();
        // Scroll handled by fixed overlay positioning — no DOM scroll needed
        this.autoSave();
      },

      updateProgress() {
        const map = { hero: 5, selection: 45, form: 82, success: 100 };
        this.progress = map[this.step] ?? 5;
      },

      onWhatsAppClick() {
        this.form.last_step = 'whatsapp-clicked';
        this.autoSave();
      },

      selectStyle(style) {
        if (style.id === 'accessories') {
          this.accessoriesClicked = !this.accessoriesClicked;
          this.form.style_selected = 'Accessories & Steel';
          this.form.last_step = 'accessories-interest';
          this.autoSave();
          return;
        }
        this.accessoriesClicked   = false;
        this.form.style_selected  = style.name;
        this.form.score           = this.calculateScore();
        this.goToStep(style.id === 'modern' ? 'capacity' : 'soft-phone');
      },

      selectCapacity(cap) {
        this.form.capacity_selected = cap.name;
        this.form.score             = this.calculateScore();
        this.goToStep('soft-phone');
      },

      onPhoneInput() {
        clearTimeout(this._phoneTimer);
        this.form.score   = this.calculateScore();
        this._phoneTimer  = setTimeout(() => this.autoSave(), 700);
      },
      onPhoneBlur() {
        clearTimeout(this._phoneTimer);
        this.form.score = this.calculateScore();
        this.autoSave();
      },
      onNameInput() {
        clearTimeout(this._nameTimer);
        this._nameTimer = setTimeout(() => this.autoSave(), 700);
      },
      onCityInput() {
        clearTimeout(this._cityTimer);
        this._cityTimer = setTimeout(() => this.autoSave(), 700);
      },
      onVisionInput() {
        clearTimeout(this._visionTimer);
        this._visionTimer = setTimeout(() => this.autoSave(), 1000);
      },
      proceedToForm() {
        this.form.score = this.calculateScore();
        this.goToStep('form');
      },

      /* ── Order Button Handler (Auth Gate) ─────────────── */
      handleOrderClick() {
        const auth = Alpine.store('saeedAuth');
        if (!auth.user) {
          auth.showAuthModal = true;
          auth.pendingAction = () => { window.location.href = '/dashboard/client'; };
        } else {
          window.location.href = '/dashboard/client';
        }
      },
      async submitForm() {
        if (this.submitting) return;
        const auth = Alpine.store('saeedAuth');
        
        // Require Authentication
        if (!auth.user) {
          auth.pendingAction = () => { this.submitForm(); };
          auth.showAuthModal = true;
          return;
        }

        if (!this.form.name.trim()) {
          this.submitError = this.lang === 'ar' ? 'الرجاء إدخال اسمك الكريم' : 'Please enter your name';
          return;
        }
        const digits = this.form.phone.replace(/\D/g, '');
        if (!this.form.phone.trim() || digits.length < 9) {
          this.phoneError = this.lang === 'ar' ? 'يرجى إدخال رقم جوال صحيح (9 أرقام على الأقل)' : 'Please enter a valid phone number (min 9 digits)';
          this.submitError = this.phoneError;
          return;
        }
        this.phoneError = '';

        const prevStatus = this.form.status;
        const prevStep = this.form.last_step;

        this.submitError  = '';
        this.submitting   = true;
        this.form.status  = 'final';
        this.form.last_step = 'success';
        this.form.score   = this.calculateScore();

        try {
          const { data, error } = await auth.supabase
            .from('orders')
            .insert({
              client_id: auth.user.id,
              configuration_details: this.form,
              status: 'new'
            });

          if (error) throw error;

          // Background: upsert name+phone into profiles for next visit
          auth.supabase.from('profiles').update({
            full_name: this.form.name,
            phone:     this.form.phone
          }).eq('id', auth.user.id).then(() => {
            Alpine.store('saeedAuth').fullName = this.form.name;
            Alpine.store('saeedAuth').phone    = this.form.phone;
          });

          // Sync with local backend for dashboard parity
          await this.autoSave();
          
          window.location.href = '/dashboard/client';
        } catch (e) {
          console.error('Submission error:', e);
          this.submitError = this.lang === 'ar' ? 'تعذّر حفظ الطلب. يرجى المحاولة لاحقاً.' : 'Failed to save order. Please try again.';
          this.form.status = prevStatus;
          this.form.last_step = prevStep;
          this.submitting = false;
        } finally {
          this.submitting = false;
        }
      },

      /* ── Selection Logic (OPEN — no auth gate) ───────── */
      selectType(type) {
        this.selectedType = type;
        this.selectionLevel = 'subtype';
        this.autoSave();
      },
      selectSubtype(subtype) {
        this.selectedSubtype = subtype;
        if (subtype.variations && subtype.variations.length === 1) {
          this.selectVariation(subtype.variations[0]);
        } else {
          this.selectionLevel = 'variation';
        }
        this.autoSave();
      },
      selectVariation(variation) {
        this.selectedVariation = variation;
        this.form.selected_model_id = `${this.selectedType.public_display_name} - ${variation.public_display_name}`;
        
        // Map to legacy fields for scoring/backend compatibility
        this.form.style_selected = this.selectedType.public_display_name;
        this.form.capacity_selected = this.selectedSubtype.public_display_name;
        
        this.goToStep('form');
        this.autoSave();
      },
      closeSelectionMode() {
        this.isSelectionMode = false;
        this.step = 'hero';
        this.selectionLevel = 'type';
        this.selectedType = null;
        this.selectedSubtype = null;
        this.selectedVariation = null;
        window.scrollTo({top: 0, behavior: 'smooth'});
      },
      goBack() {
        if (this.step === 'form') {
          this.step = 'selection';
          this.lookbookStageVisible = true;
          return;
        }
        if (this.step === 'selection') {
          if (this.lookbookStageVisible) {
            this.lookbookStageVisible = false;
          } else {
            this.closeSelectionMode();
          }
        }
      },
      scrollToFooter() {
        const footer = document.getElementById('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
          this.highlightWhatsApp = true;
          setTimeout(() => this.highlightWhatsApp = false, 3000);
        }
      },
      
      get selectedItemData() {
        if (!this.selectedVariation || !this.catalog) return null;
        return this.catalog.catalog.find(i => i.id === this.selectedVariation.catalog_item_id);
      }
    };
  }
  


    document.addEventListener("DOMContentLoaded", (event) => {
      // 1. Lenis Smooth Scroll
      if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        })

        function raf(time) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        // Sync GSAP ScrollTrigger with Lenis
        if (typeof ScrollTrigger !== 'undefined') {
          lenis.on('scroll', ScrollTrigger.update)
          gsap.ticker.add((time)=>{
            lenis.raf(time * 1000)
          })
          gsap.ticker.lagSmoothing(0)
        }
      }

      
      // 3. GSAP Scroll Reveals
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Standard reveals
        gsap.utils.toArray('.gsap-reveal').forEach(elem => {
          gsap.fromTo(elem, 
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          );
        });

        // Gold line reveal
        gsap.utils.toArray('.gsap-line').forEach(line => {
          gsap.to(line, {
            scaleX: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: line,
              start: "top 85%"
            }
          });
        });

        // Parallax effect on hero backgrounds or section backgrounds if applicable
        // The arabesque-bg can have a subtle parallax
        gsap.utils.toArray('section.arabesque-bg').forEach(sec => {
          gsap.to(sec, {
            backgroundPosition: "50% 100px",
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        });
      }


      // 2. Custom Magnetic Cursor Logic
      const cursor = document.getElementById('customCursor');
      if (window.matchMedia("(pointer: fine)").matches && cursor) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let speed = 0.2;

        window.addEventListener('mousemove', e => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        });

        function animateCursor() {
          let distX = mouseX - cursorX;
          let distY = mouseY - cursorY;
          cursorX = cursorX + (distX * speed);
          cursorY = cursorY + (distY * speed);
          cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
          requestAnimationFrame(animateCursor);
        }
        animateCursor();

        function bindCursorHover() {
          const hoverElements = document.querySelectorAll('a:not(.cursor-bound), button:not(.cursor-bound), [role="button"]:not(.cursor-bound), input:not(.cursor-bound), textarea:not(.cursor-bound)');
          hoverElements.forEach(el => {
            el.classList.add('cursor-bound');
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
          });
        }
        bindCursorHover();

        const observer = new MutationObserver(() => bindCursorHover());
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });