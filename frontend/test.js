function saeedApp(){return {}}
 const obj = { {
    ...saeedApp(),
    sidebarOpen: false,
    activeModel: null,
    exitPopupOpen: false,
    bookingModalOpen: false,
    bookingName: '',
    bookingPhone: '',
    models: [],
    
    async fetchCatalog() {
      try {
        const res = await fetch('/catalog.json');
        const data = await res.json();
        const taxonomyMap = {};
        data.catalog.taxonomy_types.forEach(t => { taxonomyMap[t.type_id] = t.name; });
        this.models = data.catalog.items.map((item, idx) => ({
          id: item.id,
          name: item.selection_metadata.public_display_name,
          taxonomy: taxonomyMap[item.selection_metadata.type_id] || '',
          desc: item.product_information.design_intent,
          imgs: [
            'https://ik.imagekit.io/de7qvcvqv/images/Day%20room%20Hero?updatedAt=1779819466896',
            'https://ik.imagekit.io/de7qvcvqv/images/Day%20room%20Hero?updatedAt=1779819466896&tr=w-800'
          ],
          tag: '0' + (idx + 1)
        }));
      } catch (e) {
        console.error(e);
      }
    },
    selectModel(model) {
      this.activeModel = model;
      this.sidebarOpen = false;
      history.replaceState({ majlisView: true }, '', location.href);
      window.scrollTo({top: 0, behavior: 'smooth'});
    },
    shareReference() {
      const model = this.activeModel;
      if (!model) return;
      const msg = `I am interested in the majlis design: ${model.name} (${model.id})`;
      window.open('https://wa.me/9289288004450?text=' + encodeURIComponent(msg), '_blank');
    },
    bookModel() {
      const model = this.activeModel;
      if (!model) return;
      if (!this.bookingName || !this.bookingPhone) return;
      const msg = `Booking Request\nName: ${this.bookingName}\nPhone: ${this.bookingPhone}\nModel: ${model.name} (${model.id})`;
      window.open('https://wa.me/9289288004450?text=' + encodeURIComponent(msg), '_blank');
      this.bookingModalOpen = false;
    },
    handlePopstate(e) {
      if (this.bookingModalOpen) { this.bookingModalOpen = false; history.replaceState({ majlisPage: true }, '', location.href); return; }
      if (this.sidebarOpen) { this.sidebarOpen = false; history.replaceState({ majlisPage: true }, '', location.href); return; }
      if (this.activeModel) { 
        this.activeModel = null; 
        history.replaceState({ majlisPage: true }, '', location.href); 
        return; 
      }
    },
    handleScroll(e) {
      if (e.deltaY < -50 && !this.activeModel) {
        this.exitPopupOpen = true;
      }
    }
  } }; console.log('Parsed successfully');
