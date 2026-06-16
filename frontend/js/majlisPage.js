// js/majlisPage.js — Majlis Digital Showroom v8 (Grouped Carousels)

(function () {
  // ─── Grouped Catalog Data ───────
  const CATALOG_GROUPS = [
    {
      "group": "Framed Grid-Tufted Line",
      "items": [
        { "image": "Set B1.png", "name": "Framed Grid-Tufted Sectional", "desc": "Low-profile modular sectional featuring a flush framed base, perfectly flat seat cushions, and a highly structured, rigid square biscuit-tufted backrest." },
        { "image": "Set B2.png", "name": "Framed Grid-Tufted Sectional (Close-Up)", "desc": "Detailed view showcasing the stark contrast between the smooth seat blocks and the deep biscuit-tufting isolated to the backrest." }
      ]
    },
    {
      "group": "Elevated Sloped-Arm Line",
      "items": [
        { "image": "Set A1.png", "name": "Elevated Sloped-Arm Sofa", "desc": "Multi-seater sofa elevated on a thick wooden perimeter frame with block legs, featuring flat cushions and a distinct, sweeping downward curve on the armrests." },
        { "image": "Set A2.png", "name": "Elevated Sloped-Arm Sofa (Variation)", "desc": "Extended variation highlighting the continuous, smooth slope from the top of the backrest down through the tapered armrests." }
      ]
    },
    {
      "group": "Exoskeleton Platform Line",
      "items": [
        { "image": "WhatsApp Image 2026-05-12 at 9.32.29 PM.jpeg", "name": "Exoskeleton Platform Majlis", "desc": "Elevated on a thick wooden platform with flatly tailored cushions, defined by a rigid, exposed wooden exoskeleton frame wrapping the exterior." }
      ]
    },
    {
      "group": "Flush Fluted Line",
      "items": [
        { "image": "WhatsApp Image 2026-05-12 at 9.29.54 PM.jpeg", "name": "Flush Fluted Crescent Sectional", "desc": "Sweeping, crescent-shaped silhouette sitting perfectly flush to the floor, wrapped entirely in deep, continuous vertical channel tufting without separate armrests." }
      ]
    },
    {
      "group": "Elevated Track-Arm Line",
      "items": [
        { "image": "A hyper-realistic, high-end editorial architectura (1).png", "name": "Elevated Track-Arm Set", "desc": "Rigid, boxy seating set elevated by a linear wooden frame. Features un-tufted rectangular cushions and severe, straight-edged track arms." }
      ]
    },
    {
      "group": "Soft-Edge Underframe Line",
      "items": [
        { "image": "WhatsApp Image 2026-05-12 at 9.26.05 PM.jpeg", "name": "Elevated Soft-Edge Underframe Sofa", "desc": "Rounded contemporary silhouette elevated by a continuous wooden underframe that gently curves upward to cradle softly padded armrests." }
      ]
    },
    {
      "group": "Elevated Barrel-Back Line",
      "items": [
        { "image": "Set F2.png", "name": "Elevated Barrel-Back Loveseats", "desc": "Compact seating featuring a continuous, curved 'barrel' outer shell that seamlessly forms the backrest and armrests on tapered wooden legs." }
      ]
    },
    {
      "group": "Flush Fluted Platform Line",
      "items": [
        { "image": "Set C2.png", "name": "Flush Fluted Platform Sectional (Close-Up)", "desc": "Heavy modular sectional resting directly on a flush metallic plinth, contrasting smooth, flat seat blocks with deep vertical channel tufting on the backrest." },
        { "image": "Set C1.png", "name": "Flush Fluted Platform Sectional (U-Shape)", "desc": "Massive U-shaped configuration showcasing the continuous vertical fluting wrapping seamlessly around the inner corners over a flush base." }
      ]
    },
    {
      "group": "Framed Slab-Arm Line",
      "items": [
        { "image": "Set M1.png", "name": "Framed Slab-Arm Set", "desc": "Right-angled geometric set featuring a flush heavy wooden base, flat cushions, and massive, solid wooden block slabs acting as the armrests." },
        { "image": "Set M2.png", "name": "Framed Slab-Arm Set (Sofa Pair)", "desc": "Sofa pairing highlighting the stark contrast between the soft minimalist cushion inserts and the heavy, solid wood outer casing." }
      ]
    },
    {
      "group": "Elevated Block Line",
      "items": [
        { "image": "Set D2.png", "name": "Elevated Block Sectional (Close-Up)", "desc": "Low-profile piece elevated by a subtle wooden perimeter frame, defined by exceptionally thick, flat, and sharply box-tailored seat cushions." },
        { "image": "Set D1.png", "name": "Elevated Block Sectional (L-Shape)", "desc": "L-shaped configuration maintaining the uniform, massive, block-like proportioning of the cushions resting on a minimal wooden rim." }
      ]
    },
    {
      "group": "Flush Monolithic Line",
      "items": [
        { "image": "Set E2.png", "name": "Flush Monolithic Sectional", "desc": "Highly uniform structure with no visible framework or legs. Upholstered, smooth, flat blocks appear to rest directly and heavily on the ground." }
      ]
    },
    {
      "group": "Flush Banded-Curve Line",
      "items": [
        { "image": "Set K2.png", "name": "Flush Banded-Curve Sofa", "desc": "Flush-to-floor silhouette with totally smooth, un-tufted cushions. Features sharply downward-curving armrests highlighted by thick, rigid outer banding." },
        { "image": "Set K1.png", "name": "Flush Banded-Curve Sofa (Pair)", "desc": "Matching pair showcasing the highly visible outer banding that frames the extreme curve of the arms from top to floor." }
      ]
    },
    {
      "group": "Flush Bolster-Arm Line",
      "items": [
        { "image": "Set G.png", "name": "Flush Bolster-Arm Sectional", "desc": "Low, rigid, flush-to-floor blocky profile. The armrests feature prominent, rounded bolster shapes integrated directly atop a squared base block." }
      ]
    },
    {
      "group": "Hidden Plinth Slab-Seat Line",
      "items": [
        { "image": "Set I2.png", "name": "Hidden Plinth Slab-Seat Sofa", "desc": "Grounded silhouette floating on a deeply recessed plinth. Features an exceptionally thick, monolithic slab seat cushion with no dividing seams and ultra-wide arm blocks." },
        { "image": "Set I1.png", "name": "Hidden Plinth Slab-Seat Sofa (Variation)", "desc": "Extended variation emphasizing the unbroken, continuous thickness of the single seat cushion stretching across the heavy frame." }
      ]
    },
    {
      "group": "Elevated Fluted-Back Line",
      "items": [
        { "image": "Set H2.png", "name": "Elevated Fluted-Back Sofa", "desc": "Architectural sofa elevated on a squared wooden frame with corner legs. Contrasts perfectly flat seat cushions with tight, continuous vertical channel tufting on the back." },
        { "image": "Set H1.png", "name": "Elevated Fluted-Back Sofa (Set)", "desc": "Multi-piece arrangement demonstrating the consistent rigid wooden underframe supporting the heavily fluted backrests." }
      ]
    },
    {
      "group": "Flush Wide-Fluted Line",
      "items": [
        { "image": "Set J2.png", "name": "Flush Wide-Fluted Sectional", "desc": "Massive, grounded sectional on a flush baseboard, featuring smooth square seat blocks and extremely wide vertical channel tufting across the back." },
        { "image": "Set J1.png", "name": "Flush Wide-Fluted Sectional (U-Shape)", "desc": "Full U-shaped arrangement highlighting the heavy, continuous wide fluting wrapping around the interior." }
      ]
    },
    {
      "group": "Elevated Pin-Leg Line",
      "items": [
        { "image": "A hyper-realistic, high-end editorial architectura (4).png", "name": "Elevated Pin-Leg Sectional", "desc": "Lightweight, minimalist design elevated on thin cylindrical pin legs. A thin, rigid outer shell encases the flatly tailored seating area." }
      ]
    },
    {
      "group": "Flush Narrow-Fluted Line",
      "items": [
        { "image": "Set L2.png", "name": "Flush Narrow-Fluted Sectional (Corner)", "desc": "Upright, flush-to-floor silhouette contrasting completely smooth seat blocks with tightly spaced, narrow vertical channel tufting on the backrest." },
        { "image": "Set L1.png", "name": "Flush Narrow-Fluted Sectional (L-Shape)", "desc": "L-shaped configuration maintaining the finely striped texture of the tall backrest extending cleanly to the floor." }
      ]
    },
    {
      "group": "Flush Monolithic Curved Line",
      "items": [
        { "image": "type_elevated_contemporary_gallery_1.png", "name": "Flush Monolithic Curved Sectional", "desc": "Chunky, unbroken organic flow sitting flush to the ground. Exceptionally thick padding blends the backrest directly into the armrests without sharp joints." }
      ]
    },
    {
      "group": "Flush Piped-Edge Line",
      "items": [
        { "image": "item_001_gallery_1.png", "name": "Flush Piped-Edge Modular Sofa", "desc": "Geometric, flush-to-floor modular blocks. Smooth, un-tufted cushions are strictly outlined by prominent, continuous contrasting piped trim (welting)." }
      ]
    },
    {
      "group": "Cylinder-Base Fluted Line",
      "items": [
        { "image": "item_003.png", "name": "Cylinder-Base Fluted Sofa", "desc": "Elevated on a massive, prominent cylindrical wooden base rail. Features a single un-tufted seat cushion and wide vertical channel tufting on the back." }
      ]
    },
    {
      "group": "Hidden Plinth Dual-Shell Line",
      "items": [
        { "image": "item_004.png", "name": "Hidden Plinth Dual-Shell Sofa", "desc": "Floating boxy silhouette on a hidden plinth. Characterized by a rigid outer structural shell that sits noticeably higher than the softer inner back cushions." }
      ]
    },
    {
      "group": "Recessed Plinth Curved Line",
      "items": [
        { "image": "item_006.png", "name": "Recessed Plinth Curved Sectional", "desc": "Sprawling, heavy sectional floating on a deeply recessed plinth. Features massively thick, flat slab cushions with softly rounded, flowing corner edges." }
      ]
    },
    {
      "group": "Elevated Heavy-Block Line",
      "items": [
        { "image": "item_007.png", "name": "Elevated Heavy-Block Sectional", "desc": "Pairs sharply tailored, extremely thick cushions with a massive, exposed wooden perimeter frame and heavy squared block legs." }
      ]
    },
    {
      "group": "Elevated Pin-Leg Modular Line",
      "items": [
        { "image": "item_007_gallery_1.png", "name": "Elevated Pin-Leg Modular Sectional", "desc": "Severe right-angled minimalist design floating on delicate metal pin legs. The backrests and armrests sit at identical heights forming an unbroken barrier." }
      ]
    },
    {
      "group": "Stepped-Wood Framed Majlis Line",
      "items": [
        { "image": "subtype_framed_base_gallery_1.png", "name": "Stepped-Wood Framed Majlis", "desc": "Traditional low-profile seating resting on a heavy wooden base frame with architectural stepped molding. Features flat seats and free-resting cylindrical arm bolsters." }
      ]
    },
    {
      "group": "Hidden Plinth / Recessed Base Line",
      "items": [
        { "image": "subtype_hidden_plinth_gallery_1.png", "name": "Hidden Plinth Track-Arm Sofa", "desc": "Low, horizontal contemporary sofa floating on a solid recessed plinth. Squared-off, smooth cushions sit flush between rigid, perfectly flat track armrests." }
      ]
    },
    {
      "group": "Elevated Block-Leg Table-Arm Line",
      "items": [
        { "image": "item_005_gallery_1.png", "name": "Elevated Table-Arm Sofa", "desc": "Highly geometric design elevated on chunky square wooden legs. Defined by solid, flat wooden planks capped onto the wide armrests to act as built-in side tables." }
      ]
    }
  ];

  // Helper to map an item to a standardized model format for the app
  function mapItemToModel(item, groupName) {
    return {
      id:          item.name.replace(/\s+/g, '_').toLowerCase(),
      name:        item.name,
      typeName:    groupName,
      description: item.desc,
      signature:   '',
      thumb:       'https://ik.imagekit.io/de7qvcvqv/images/catalog/' + item.image,
      gallery: [
        'https://ik.imagekit.io/de7qvcvqv/images/catalog/' + item.image
      ],
    };
  }

  // Pre-process groups to include standard model format
  const PROCESSED_GROUPS = CATALOG_GROUPS.map(g => ({
    group: g.group,
    models: g.items.map(item => mapItemToModel(item, g.group))
  }));

  window.majlisPage = function () {
    return {
      getImageUrl(path) {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return window.IMAGE_BASE_URL + path;
      },
      // ── State ───────────────────────────────────────────────────
      catalogGroups: PROCESSED_GROUPS,
      selectedModel: PROCESSED_GROUPS[0].models[0], // first model shown immediately
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
          const auth = Alpine.store('saeedAuth');
          let token = null;
          if (auth && auth.supabase) {
             const { data } = await auth.supabase.auth.getSession();
             if (data?.session?.access_token) {
                 token = data.session.access_token;
             }
          }
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
          const headers = {'Content-Type':'application/json'};
          if (token) headers['Authorization'] = `Bearer ${token}`;

          var res = await fetch(window.location.origin + '/api/orders', {
            method: 'POST', headers: headers,
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
