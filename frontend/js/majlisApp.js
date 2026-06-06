window.majlisApp = function majlisApp() {
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
            
            this.$watch('activeModel', () => {
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
            ? `مرحباً، أنا مهتم بتصميم هذا المجلس:\nالنمط: ${this.activeModel.taxonomy}\nالموديل: ${this.activeModel.name}\nالرمز: ${this.activeModel.id}`
            : `Hello, I am interested in this design:\nStyle: ${this.activeModel.taxonomy}\nModel: ${this.activeModel.name}\nCode: ${this.activeModel.id}`;
          
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
          window.open(whatsappUrl, '_blank');
        },
        
        bookModel() {
          if (!this.bookingName || !this.bookingPhone) {
            alert(this.lang === 'ar' ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Please enter your name and phone number');
            return;
          }
          const text = this.lang === 'ar'
            ? `طلب حجز مجلس:\nالاسم: ${this.bookingName}\nالهاتف: ${this.bookingPhone}\nالموديل: ${this.activeModel.name} (${this.activeModel.id})`
            : `Majlis Booking Request:\nName: ${this.bookingName}\nPhone: ${this.bookingPhone}\nModel: ${this.activeModel.name} (${this.activeModel.id})`;
          
          const whatsappUrl = `https://wa.me/966500000000?text=${encodeURIComponent(text)}`;
          window.open(whatsappUrl, '_blank');
          this.bookingModalOpen = false;
          this.bookingName = '';
          this.bookingPhone = '';
        }
      };
    }
