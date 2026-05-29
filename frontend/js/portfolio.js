const IMAGE_BASE = 'https://ik.imagekit.io/de7qvcvqv/';

    function portfolioApp() {
      return {
        lang: 'ar',
        activeFilter: 'all',
        lightboxItem: null,

        filters: [
          { id: 'all',          label: 'All Works',           labelAr: 'جميع الأعمال' },
          { id: 'floor',        label: 'Floor Majlis',        labelAr: 'مجلس أرضي' },
          { id: 'elevated',     label: 'Elevated Majlis',     labelAr: 'مجلس مرتفع' },
          { id: 'contemporary', label: 'Contemporary',        labelAr: 'معاصر' },
          { id: 'tub',          label: 'Tub-Style',           labelAr: 'تب ستايل' },
        ],

        portfolio: [
          {
            id: 1, category: 'elevated', featured: false, tall: true,
            image: IMAGE_BASE + 'images/catalog/subtype_elevated_peg_base_gallery_1.png',
            tag: 'Elevated Majlis',     tagAr: 'مجلس مرتفع',
            title: 'Peg-Base Serenity', titleAr: 'هدوء القاعدة الوتدية',
            desc: 'A bespoke elevated majlis set with hand-finished peg-base legs and deep-cushioned wraparound seating. Delivered in Riyadh.',
            descAr: 'طقم مجلس مرتفع مخصص بأرجل وتدية مشطوبة يدوياً ومقاعد ذات وسائد عميقة. تم التسليم في الرياض.',
          },
          {
            id: 2, category: 'floor', featured: false, tall: false,
            image: IMAGE_BASE + 'images/catalog/type_modern_floor_majlis_gallery_1.png',
            tag: 'Floor Majlis',        tagAr: 'مجلس أرضي',
            title: 'Cloud-Base Flow',   titleAr: 'انسياب القاعدة السحابية',
            desc: 'A sweeping floor majlis in ivory bouclé, with cloud-soft base sections sized to a 7×5m reception room.',
            descAr: 'مجلس أرضي فسيح بقماش بوكليه عاجي، بأقسام قاعدة ناعمة كالسحاب مقاسة لغرفة استقبال 7×5م.',
          },
          {
            id: 3, category: 'contemporary', featured: false, tall: false,
            image: IMAGE_BASE + 'images/catalog/type_elevated_contemporary_gallery_1.png',
            tag: 'Contemporary',        tagAr: 'معاصر',
            title: 'Flush-Base Precision', titleAr: 'دقة القاعدة المستوية',
            desc: 'Clean-line contemporary seating with a flush timber base and tone-on-tone upholstery. Jeddah commission.',
            descAr: 'مقاعد معاصرة بخطوط نظيفة مع قاعدة خشبية مستوية ونسيج متناسق. طلب من جدة.',
          },
          {
            id: 4, category: 'elevated', featured: false, tall: true,
            image: IMAGE_BASE + 'images/catalog/subtype_framed_base_gallery_1.png',
            tag: 'Elevated Majlis',     tagAr: 'مجلس مرتفع',
            title: 'Framed Heritage',   titleAr: 'إطار التراث',
            desc: 'Ornate framed-base majlis in warm beige with gold-tone button tufting. A family heirloom commission.',
            descAr: 'مجلس بإطار زخرفي بقاعدة مؤطرة بدرجات بيج دافئة ونتف ذهبية. طلب تذكاري عائلي.',
          },
          {
            id: 5, category: 'floor', featured: false, tall: false,
            image: IMAGE_BASE + 'images/catalog/type_modern_floor_majlis_gallery_2.png',
            tag: 'Floor Majlis',        tagAr: 'مجلس أرضي',
            title: 'Low-Profile Luxe',  titleAr: 'الرفاهية المنخفضة',
            desc: 'Extra-low floor sections with feather-blend fill and a custom L-shaped layout for an open-plan majlis.',
            descAr: 'أقسام أرضية منخفضة للغاية بحشوة ريش مخصصة وتخطيط L مخصص لمجلس مفتوح.',
          },
          {
            id: 6, category: 'tub', featured: false, tall: true,
            image: IMAGE_BASE + 'images/catalog/type_tub_style_hybrid_gallery_1.png',
            tag: 'Tub-Style Hybrid',    tagAr: 'هجين تب ستايل',
            title: 'Warm Tub Embrace',  titleAr: 'احتضان الدفء',
            desc: 'A tub-hybrid majlis combining traditional depth with modern tapered timber legs. Dammam project.',
            descAr: 'مجلس هجين يجمع بين العمق التقليدي والأرجل الخشبية المدببة المعاصرة. مشروع الدمام.',
          },
          {
            id: 7, category: 'contemporary', featured: false, tall: false,
            image: IMAGE_BASE + 'images/catalog/type_elevated_contemporary_gallery_2.png',
            tag: 'Contemporary',        tagAr: 'معاصر',
            title: 'Block-Leg Clarity', titleAr: 'وضوح الساق المكعبة',
            desc: 'Exposed block-leg sections in natural ash wood and stone-grey velvet. A minimalist study commission.',
            descAr: 'أقسام بأرجل مكعبة من خشب الرماد الطبيعي ومخمل رمادي. طلب دراسة بسيط.',
          },
          {
            id: 8, category: 'floor', featured: false, tall: true,
            image: IMAGE_BASE + 'images/catalog/type_modern_floor_majlis_gallery_3.png',
            tag: 'Floor Majlis',        tagAr: 'مجلس أرضي',
            title: 'Hidden-Plinth Calm', titleAr: 'هدوء القاعدة الخفية',
            desc: 'A seamless floor majlis with hidden-plinth base for a floating illusion, in warm taupe chenille.',
            descAr: 'مجلس أرضي سلس بقاعدة خفية لوهم الطفو، بقماش شينيل ترابي دافئ.',
          },
          {
            id: 9, category: 'elevated', featured: false, tall: false,
            image: IMAGE_BASE + 'images/catalog/subtype_elevated_peg_base_gallery_3.png',
            tag: 'Elevated Majlis',     tagAr: 'مجلس مرتفع',
            title: 'Crossover Accent',  titleAr: 'لمسة التقاطع',
            desc: 'A crossover-base elevated set with contrast piped detailing and matching bolster cushions.',
            descAr: 'طقم مرتفع بقاعدة متقاطعة وتفاصيل مقلمة متباينة ووسائد بولستر متناسقة.',
          },
          {
            id: 10, category: 'tub', featured: false, tall: true,
            image: IMAGE_BASE + 'images/catalog/type_tub_style_hybrid_gallery_3.png',
            tag: 'Tub-Style Hybrid',    tagAr: 'هجين تب ستايل',
            title: 'Deep Comfort Haven', titleAr: 'عمق الراحة',
            desc: 'Deep-sink tub sections for a true immersive seating experience, in sandstone velvet. Riyadh Villa.',
            descAr: 'أقسام تب عميقة لتجربة جلوس غامرة حقيقية، بمخمل حجري. فيلا الرياض.',
          },
          {
            id: 11, category: 'contemporary', featured: false, tall: false,
            image: IMAGE_BASE + 'images/catalog/subtype_flush_base_gallery_1.png',
            tag: 'Contemporary',        tagAr: 'معاصر',
            title: 'Sculptural Silence', titleAr: 'صمت نحتي',
            desc: 'Geometric flush-base sections with micro-fibre in warm white. Designed for a minimalist villa in Jeddah.',
            descAr: 'أقسام هندسية بقاعدة مستوية بميكروفايبر أبيض دافئ. مصمم لفيلا بسيطة في جدة.',
          },
          {
            id: 12, category: 'floor', featured: false, tall: true,
            image: IMAGE_BASE + 'images/catalog/type_modern_floor_majlis_gallery_5.png',
            tag: 'Floor Majlis',        tagAr: 'مجلس أرضي',
            title: 'Panoramic Sweep',   titleAr: 'اتساع بانورامي',
            desc: 'A panoramic U-shaped floor majlis filling a 9×6m hall with continuous plush seating.',
            descAr: 'مجلس أرضي بانورامي على شكل U يملأ قاعة 9×6م بمقاعد مخملية متواصلة.',
          },
        ],

        get filteredItems() {
          if (this.activeFilter === 'all') return this.portfolio;
          return this.portfolio.filter(i => i.category === this.activeFilter);
        },

        openLightbox(item) {
          this.lightboxItem = item;
          document.body.style.overflow = 'hidden';
        },

        waLink(item) {
          const msg = this.lang === 'ar'
            ? `مرحباً، أعجبني تصميم "${item.titleAr}" في معرض أعمالكم. هل بالإمكان الاستفسار عن تصميم مماثل؟`
            : `Hello, I loved the "${item.title}" from your portfolio. Can I inquire about a similar design?`;
          return `https://wa.me/9660536768019?text=${encodeURIComponent(msg)}`;
        },

        init() {
          // Language from localStorage or default ar
          const saved = localStorage.getItem('saeed_lang');
          if (saved === 'en') { this.lang = 'en'; document.documentElement.lang = 'en'; document.documentElement.dir = 'ltr'; }

          // Close lightbox on Escape
          this.$watch('lightboxItem', val => {
            document.body.style.overflow = val ? 'hidden' : '';
          });
        },
      };
    }