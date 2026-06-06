// js/majlisPage.js — Majlis Digital Showroom v7
// All 7 models are pre-seeded synchronously for instant first paint.
// catalog.json is fetched in the background to enrich description data.

(function () {
  // ─── Pre-seed model list (sync, no fetch required for first paint) ───────
  var SEED = [
    { id: 'item_001', name: 'Smooth Flow Piped',    typeName: 'Modern Floor Majlis',    description: 'An uninterrupted, highly adaptable floor-level seating topography that emphasizes geometric boundaries through contrasting trim.' },
    { id: 'item_002', name: 'Deep Channeled Back',  typeName: 'Modern Floor Majlis',    description: 'A bold floor-level system defined by dramatic vertical channel stitching across the backrest, creating strong shadow lines.' },
    { id: 'item_003', name: 'Ornate Bolster Accent',typeName: 'Modern Floor Majlis',    description: 'A framed-base floor majlis anchored by a rigid perimeter trim and adorned with traditional bolster cushions.' },
    { id: 'item_004', name: 'Two Tone Wrap',         typeName: 'Elevated Contemporary', description: 'A floating elevated sofa where contrasting upholstery tones wrap the backrest and seat for a striking two-material identity.' },
    { id: 'item_005', name: 'Wood Capped Utility',   typeName: 'Elevated Contemporary', description: 'A structured system on massive wooden block legs with flat wood-capped armrests that double as integrated side surfaces.' },
    { id: 'item_006', name: 'Metallic Pin Leg',      typeName: 'Tub Style Hybrid',      description: 'A thick enveloping C-shaped shell suspended on ultra-thin dark metallic pin legs — maximum visual tension.' },
    { id: 'item_007', name: 'Continuous Sweep',      typeName: 'Modern Floor Majlis',   description: 'A monolithic floor-seating volume hovering on minimalist metal peg legs, maintaining traditional comfort with a modern lift.' },
  ];

  function makeModel(seed) {
    return {
      id:          seed.id,
      name:        seed.name,
      typeName:    seed.typeName,
      description: seed.description,
      signature:   '',
      thumb:       'images/catalog/' + seed.id + '.png',
      gallery: [
        'images/catalog/' + seed.id + '.png',
        'images/catalog/' + seed.id + '_gallery_1.png',
        'images/catalog/' + seed.id + '_gallery_2.png',
      ],
    };
  }

  window.majlisPage = function () {
    return {
      // ── State ───────────────────────────────────────────────────
      models:        SEED.map(makeModel),   // pre-seeded — no blank screen
      selectedModel: makeModel(SEED[0]),    // first model shown immediately
      drawerOpen:    false,
      modalOpen:     false,
      carouselIndex: 0,
      showExitIntent:    false,
      hasTriggeredExit:  false,

      // Order form
      showOrderForm: false,
      formStep:      'form',   // 'form' | 'success'
      submitting:    false,
      submitError:   '',
      phoneError:    '',
      form: {
        name:                   '',
        email:                  '',
        phone:                  '',
        visit_mode:             'Visit Shop',
        preferred_contact_time: 'Morning',
        order_id:               '',
      },

      // ── Init ────────────────────────────────────────────────────
      async majlisInit() {
        var self = this;

        // Enrich descriptions from catalog.json in background (non-blocking)
        fetch('catalog.json')
          .then(function(r){ return r.json(); })
          .then(function(data){
            var items = (data && data.catalog_data && data.catalog_data.items) || [];
            items.forEach(function(item){
              var m = self.models.find(function(x){ return x.id === item.id; });
              if (m) {
                m.description = item.product_information.design_intent || m.description;
                m.signature   = item.product_information.visual_signature || '';
              }
            });
            // Refresh selectedModel to pick up enriched description
            if (self.selectedModel) {
              var fresh = self.models.find(function(x){ return x.id === self.selectedModel.id; });
              if (fresh) self.selectedModel = fresh;
            }
          })
          .catch(function(e){ console.warn('catalog.json enrichment skipped:', e); });

        // ── Epic 4: History sentinel ─────────────────────────────
        history.pushState({ majlisEntry: true }, '', window.location.href);

        window.addEventListener('popstate', function() {
          if (self.modalOpen)     { self.closeModal();     history.pushState({majlisEntry:true},'',window.location.href); return; }
          if (self.drawerOpen)    { self.drawerOpen=false; history.pushState({majlisEntry:true},'',window.location.href); return; }
          if (self.showOrderForm) { self.showOrderForm=false; history.pushState({majlisEntry:true},'',window.location.href); return; }

          var clicks = parseInt(localStorage.getItem('majlis_back_clicks') || '0', 10);
          if (clicks < 2) {
            localStorage.setItem('majlis_back_clicks', String(clicks + 1));
            self.showExitIntent = true;
            history.pushState({ majlisEntry: true }, '', window.location.href);
          } else {
            localStorage.removeItem('majlis_back_clicks');
            window.location.href = '/';
          }
        });

        // Desktop exit intent (mouse leaves top edge)
        document.addEventListener('mouseleave', function(e){
          if (e.clientY <= 0 && !self.hasTriggeredExit && !self.showExitIntent && !self.modalOpen) {
            self.hasTriggeredExit = true;
            self.showExitIntent   = true;
          }
        });
      },

      // ── Drawer ──────────────────────────────────────────────────
      openDrawer()  { this.drawerOpen = true; },
      closeDrawer() { this.drawerOpen = false; },

      // ── Modal ───────────────────────────────────────────────────
      openModal(model) {
        this.selectedModel  = model;
        this.carouselIndex  = 0;
        this.modalOpen      = true;
        this.drawerOpen     = false;
        history.pushState({ majlisModal: true }, '', window.location.href);
      },
      closeModal() { this.modalOpen = false; },
      nextSlide() {
        if (!this.selectedModel) return;
        this.carouselIndex = (this.carouselIndex + 1) % this.selectedModel.gallery.length;
      },
      prevSlide() {
        if (!this.selectedModel) return;
        this.carouselIndex = (this.carouselIndex - 1 + this.selectedModel.gallery.length) % this.selectedModel.gallery.length;
      },

      // ── Order form ──────────────────────────────────────────────
      openOrderForm() {
        this.modalOpen     = false;
        this.showOrderForm = true;
        this.formStep      = 'form';
        this.submitError   = '';
        this.phoneError    = '';
        history.pushState({ majlisForm: true }, '', window.location.href);
      },
      closeOrderForm() { this.showOrderForm = false; this.formStep = 'form'; },

      async submitForm() {
        if (this.submitting) return;
        this.phoneError  = '';
        this.submitError = '';
        if (!this.form.name.trim())  { this.submitError = 'Please enter your name.'; return; }
        if (!this.form.phone.trim()) { this.phoneError  = 'Please enter your phone number.'; return; }

        this.submitting = true;
        this.form.order_id = 'SF-' + Date.now().toString(36).toUpperCase();
        try {
          var payload = {
            name:                   this.form.name,
            email:                  this.form.email,
            phone:                  '+966' + this.form.phone.replace(/\D/g,''),
            visit_mode:             this.form.visit_mode,
            preferred_contact_time: this.form.preferred_contact_time,
            model_name:             this.selectedModel ? this.selectedModel.name : '',
            model_id:               this.selectedModel ? this.selectedModel.id   : '',
            order_id:               this.form.order_id,
          };
          var res = await fetch(window.location.origin + '/api/orders', {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload),
          });
          // graceful: show success regardless
        } catch(e) { /* network error — still show success */ }
        this.formStep   = 'success';
        this.submitting = false;
        localStorage.removeItem('majlis_back_clicks');
      },

      // ── Helpers ─────────────────────────────────────────────────
      whatsappShareUrl() {
        var model = this.selectedModel;
        var text  = model
          ? 'Hello, I\'m interested in the Saeed Furniture "' + model.name + '" design. I have some reference images to share.'
          : 'Hello, I have some reference images I\'d like to share with Saeed Furniture.';
        return 'https://wa.me/9288004450?text=' + encodeURIComponent(text);
      },
    };
  };
}());
