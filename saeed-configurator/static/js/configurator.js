/**
 * configurator.js — Saeed Luxury Majlis
 * Extracted JS + sophisticated step-transition engine + lazy-loader
 */

'use strict';

/* ── Material palette ─────────────────────────────────────────────────────── */
const MATERIAL_PALETTE = {
  velvet:   [
    { name: 'كريمي ملكي فاخر',    value: '#F4EFEA' },
    { name: 'أزرق ملكي داكن',     value: '#1B2A47' },
    { name: 'تيل عميق ساحر',      value: '#184E5B' },
  ],
  jacquard: [
    { name: 'زيتوني ذهبي مكسو',   value: '#8A8D63' },
    { name: 'بيج منقوش تقليدي',   value: '#D6C7B2' },
    { name: 'رمادي رماد فاخر',    value: '#7A7D80' },
  ],
  leather:  [
    { name: 'جملي فاخر كلاسيك',   value: '#C17A43' },
    { name: 'بني إكسبريسو داكن',  value: '#3D261C' },
    { name: 'أسود أونيكس ملكي',   value: '#1A1A1A' },
  ],
};

/* ── App state ────────────────────────────────────────────────────────────── */
let state = {
  order_id: '',
  currentStep: 1,
  shape: '',
  knowsDimensions: null,
  dimensions: {},
  specialNotes: '',
  inspirationType: '',
  inspirationValue: '',
  configurator: {
    angle: 'front',
    primaryMaterial: 'velvet',
    primaryColorName: 'كريمي ملكي فاخر',
    primaryColorHex:  '#F4EFEA',
    accentEnabled: false,
    secondaryMaterial: 'velvet',
    secondaryColorName: 'كريمي ملكي فاخر',
    secondaryColorHex:  '#F4EFEA',
  },
  contact: { name: '', phone: '', city: '' },
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const $  = (id)  => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);
const save = () => localStorage.setItem('saeed_cfg', JSON.stringify(state));

/* ── Init ─────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadSession();
  bindEvents();
  syncUI();
  renderSwatches('primary');
  renderSwatches('secondary');
  updateConfigurator();
  initLazyLoader();
});

/* ── Session persistence ──────────────────────────────────────────────────── */
function loadSession() {
  try {
    const raw = localStorage.getItem('saeed_cfg');
    if (raw) Object.assign(state, JSON.parse(raw));
  } catch (_) {}

  if (!state.order_id) {
    const d = new Date();
    const ds = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    state.order_id = `SAEED-${ds}-${Math.floor(1000 + Math.random() * 9000)}`;
    save();
  }
}

/* ── Lazy image loader (IntersectionObserver) ─────────────────────────────── */
function initLazyLoader() {
  const imgs = $$('img.lazy');
  if (!imgs.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = img.dataset.src;
      if (!src) return;

      img.src = src;
      img.onload  = () => img.classList.add('loaded');
      img.onerror = () => {}; // fallback div stays visible
      io.unobserve(img);
    });
  }, { rootMargin: '200px 0px' });

  imgs.forEach(img => io.observe(img));
}

/* ── Step transition engine ───────────────────────────────────────────────── */
function goTo(next) {
  const prev = state.currentStep;
  if (next === prev) return;

  const prevEl = $(`step${prev}`);
  const nextEl = $(`step${next}`);
  if (!nextEl) return;

  // 1. Exit current step
  if (prevEl) {
    prevEl.classList.add('step-exit');
    prevEl.addEventListener('animationend', () => {
      prevEl.classList.remove('active', 'step-exit');
    }, { once: true });
  }

  // 2. Enter next step after a short overlap delay
  setTimeout(() => {
    nextEl.classList.add('active');
    // Force reflow so animation triggers fresh
    void nextEl.offsetWidth;
    nextEl.classList.add('step-enter');
    nextEl.addEventListener('animationend', () => {
      nextEl.classList.remove('step-enter');
    }, { once: true });

    // Lazy-load any images that just became visible
    initLazyLoader();
  }, 180);

  state.currentStep = next;
  save();

  if (next === 6) buildSummary();
  updateStepperUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function forward() {
  if (!validateStep(state.currentStep)) return;
  if (state.currentStep < 7) goTo(state.currentStep + 1);
}
function backward() {
  if (state.currentStep > 1) goTo(state.currentStep - 1);
}

/* ── Validation ───────────────────────────────────────────────────────────── */
function validateStep(s) {
  if (s === 1 && !state.shape) {
    toast('يرجى اختيار أحد أشكال المجالس أولاً'); return false;
  }
  if (s === 2 && state.knowsDimensions === null) {
    toast('يرجى تحديد مسار القياسات'); return false;
  }
  if (s === 4 && !state.inspirationType) {
    toast('يرجى اختيار ملف مرجعي أو تخطي هذه الخطوة'); return false;
  }
  return true;
}

/* ── Stepper UI ───────────────────────────────────────────────────────────── */
function updateStepperUI() {
  const total = 7;
  const pct   = ((state.currentStep - 1) / (total - 1)) * 100;
  const bar   = $('stepperProgress');
  if (bar) bar.style.width = pct + '%';

  $$('.step-dot').forEach(dot => {
    const n = parseInt(dot.dataset.stepTarget);
    dot.classList.remove('active', 'completed');
    if (n === state.currentStep)  dot.classList.add('active');
    else if (n < state.currentStep) dot.classList.add('completed');
  });

  const next = $('nextBtn');
  const prev = $('prevBtn');
  if (prev) prev.style.display = state.currentStep === 1 ? 'none' : 'block';
  if (next) {
    if (state.currentStep === 7) { next.style.display = 'none'; return; }
    next.style.display = 'block';
    next.textContent = state.currentStep === 6 ? 'متابعة إلى بيانات التواصل' : 'متابعة';
  }
}

/* ── Collapsible helper ───────────────────────────────────────────────────── */
function openBlock(el)  { el.classList.add('open');  el.setAttribute('aria-hidden','false'); }
function closeBlock(el) { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
function toggleBlock(el, show) { show ? openBlock(el) : closeBlock(el); }

/* ── Dimension form builder ───────────────────────────────────────────────── */
const DIM_FIELDS = {
  U:      [{ id:'left', label:'طول الجدار الأيسر (م)' }, { id:'back', label:'طول الجدار الخلفي (م)' }, { id:'right', label:'طول الجدار الأيمن (م)' }],
  L:      [{ id:'long', label:'طول الجدار الطويل (م)' },  { id:'short', label:'طول الجدار القصير (م)' }],
  single: [{ id:'length', label:'إجمالي طول مساحة الجدار (م)' }],
};

function buildDimFields() {
  const wrap = $('dimensionsFormContainer');
  if (!wrap) return;
  wrap.innerHTML = '';
  (DIM_FIELDS[state.shape] || []).forEach(f => {
    const g = document.createElement('div'); g.className = 'form-group';
    g.innerHTML = `
      <label for="dim_${f.id}">${f.label}</label>
      <input type="number" step="0.01" min="0.5" id="dim_${f.id}" class="premium-input" placeholder="مثال: 3.5">
      <div class="input-underline-animation"></div>
      <div id="hint_${f.id}" class="live-calc-hint">مساحة الجلوس المتاحة التقريبية: —</div>`;
    wrap.appendChild(g);
    const inp = g.querySelector('input');
    if (state.dimensions[f.id]) inp.value = state.dimensions[f.id];
    inp.addEventListener('input', e => {
      const v = parseFloat(e.target.value) || 0;
      state.dimensions[f.id] = v;
      const hint = $(`hint_${f.id}`);
      if (hint) hint.textContent = v > 0.85
        ? `مساحة الجلوس بعد خصم العمق: ${(v - 0.85).toFixed(2)} م`
        : 'القياس غير كافٍ لأريكة قياسية';
      save();
    });
  });
}

/* ── Swatches ─────────────────────────────────────────────────────────────── */
function renderSwatches(role) {
  const isPrimary = role === 'primary';
  const mat  = isPrimary ? state.configurator.primaryMaterial : state.configurator.secondaryMaterial;
  const box  = $(isPrimary ? 'primarySwatchesContainer' : 'secondarySwatchesContainer');
  const hex  = isPrimary ? state.configurator.primaryColorHex : state.configurator.secondaryColorHex;
  if (!box) return;
  box.innerHTML = '';
  (MATERIAL_PALETTE[mat] || []).forEach((c, i) => {
    const sw = document.createElement('div');
    sw.className = 'swatch-item swatch-pop';
    sw.style.cssText = `background:${c.value}; animation-delay:${i * 55}ms`;
    sw.title = c.name;
    if (c.value === hex) sw.classList.add('active');
    sw.addEventListener('click', () => {
      box.querySelectorAll('.swatch-item').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      if (isPrimary) {
        state.configurator.primaryColorName = c.name;
        state.configurator.primaryColorHex  = c.value;
      } else {
        state.configurator.secondaryColorName = c.name;
        state.configurator.secondaryColorHex  = c.value;
      }
      updateConfigurator(); save();
    });
    box.appendChild(sw);
  });
}

/* ── Live SVG configurator ────────────────────────────────────────────────── */
function updateConfigurator() {
  const c   = state.configurator;
  const svg = $('svgSofaRender');
  const back  = $('sofaBack');
  const base  = $('sofaBase');
  const armL  = $('sofaAccentL');
  const armR  = $('sofaAccentR');
  const label = $('renderOverlayText');

  if (back)  back.style.fill  = c.primaryColorHex;
  if (base)  base.style.fill  = c.primaryColorHex;
  const accent = c.accentEnabled ? c.secondaryColorHex : c.primaryColorHex;
  if (armL) armL.style.fill = accent;
  if (armR) armR.style.fill = accent;

  const shapeLabel = { U:'شكل U', L:'شكل L', single:'قطعة واحدة' }[state.shape] || 'شكل U';
  const angleLabel = { front:'أمامي', threequarter:'بزاوية 3/4', side:'جانبي' }[c.angle] || 'أمامي';
  if (label) label.textContent = `${shapeLabel} | ${angleLabel}`;

  if (svg) {
    const t = { front:'rotateY(0deg)', threequarter:'rotateY(28deg)', side:'rotateY(58deg) scaleX(0.82)' };
    svg.style.transform = t[c.angle] || 'rotateY(0deg)';
  }
}

/* ── Summary builder ──────────────────────────────────────────────────────── */
function buildSummary() {
  const box = $('summaryCardContainer');
  if (!box) return;

  const shapeMap = { U:'تصميم حرف U', L:'تصميم حرف L', single:'قطعة واحدة متصلة' };
  const matMap   = { velvet:'قطيفة فاخرة', jacquard:'جاكار ملكي', leather:'جلد طبيعي' };

  let dimsText = 'متروك لمعاينة الفريق الفني';
  if (state.knowsDimensions && Object.keys(state.dimensions).length) {
    const sideLabel = { left:'أيسر', back:'خلفي', right:'أيمن', long:'طويل', short:'قصير', length:'إجمالي' };
    dimsText = Object.entries(state.dimensions).map(([k,v]) => `${sideLabel[k]||k}: ${v}م`).join(' × ');
  }

  const primaryStr  = `${matMap[state.configurator.primaryMaterial]} — ${state.configurator.primaryColorName}`;
  const accentStr   = state.configurator.accentEnabled
    ? `${matMap[state.configurator.secondaryMaterial]} — ${state.configurator.secondaryColorName}`
    : 'لون موحد (بدون تباين)';
  const notesStr    = state.specialNotes.trim() || 'لا توجد ملاحظات إضافية';
  const inspireStr  = state.inspirationValue     || 'لم يتم اختيار مرجع';

  box.innerHTML = [
    ['رقم الطلب',           `<span style="color:var(--accent-gold);font-family:Cairo;">${state.order_id}</span>`],
    ['شكل الهيكل',          shapeMap[state.shape] || '—'],
    ['الأبعاد',             `<span dir="ltr">${dimsText}</span>`],
    ['المادة واللون الأساسي', primaryStr],
    ['التفاصيل الفرعية',    accentStr],
    ['المرجع الإلهامي',     inspireStr],
    ['الملاحظات الخاصة',    notesStr],
  ].map(([label, val]) => `
    <div class="summary-row">
      <span class="summary-label">${label}:</span>
      <span class="summary-value">${val}</span>
    </div>`).join('');
}

/* ── Toast ────────────────────────────────────────────────────────────────── */
function toast(msg, olive = false) {
  const el   = $('toastSystemAlert');
  const text = $('toastSystemMessage');
  if (!el || !text) return;
  text.textContent = msg;
  el.style.borderRightColor = olive ? 'var(--success-olive)' : 'var(--accent-gold)';
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3500);
}

/* ── WhatsApp submit ──────────────────────────────────────────────────────── */
function submitWhatsApp() {
  const { name, phone, city } = state.contact;
  if (!name || !phone || !city) { toast('يرجى ملء جميع حقول التواصل'); return; }
  if (!/^(?:\+966|00966|0)?5\d{8}$/.test(phone)) { toast('يرجى إدخال رقم جوال سعودي صحيح'); return; }

  const shapeStr = { U:'حرف U', L:'حرف L', single:'قطعة واحدة' }[state.shape] || '—';
  const matStr   = { velvet:'قطيفة', jacquard:'جاكار', leather:'جلد' }[state.configurator.primaryMaterial] || '—';
  let dimsStr    = 'متروك للفريق الفني';
  if (state.knowsDimensions && Object.keys(state.dimensions).length)
    dimsStr = Object.entries(state.dimensions).map(([k,v]) => `${k}:${v}م`).join(', ');

  const msg = encodeURIComponent(
    `مرحباً، أرغب في طلب أريكة: [${shapeStr}] | الأبعاد: [${dimsStr}] | المادة: [${matStr} - ${state.configurator.primaryColorName}] | ملاحظات: [${state.specialNotes || 'لا يوجد'}] | الاسم: [${name}] | المدينة: [${city}] | رقم الطلب: [${state.order_id}]`
  );
  window.open(`https://wa.me/966500000000?text=${msg}`, '_blank');
}

/* ── syncUI: restore state to DOM ────────────────────────────────────────── */
function syncUI() {
  if (state.shape) {
    const card = document.querySelector(`[data-shape="${state.shape}"]`);
    if (card) card.classList.add('selected');
    buildDimFields();
  }
  if (state.knowsDimensions !== null) applyDimPath(state.knowsDimensions);

  $('specialNotesInput').value  = state.specialNotes;
  $('clientNameInput').value    = state.contact.name;
  $('clientPhoneInput').value   = state.contact.phone;
  $('clientCityInput').value    = state.contact.city;

  $$('[data-mat-type]').forEach(b => b.classList.toggle('active', b.dataset.matType === state.configurator.primaryMaterial));
  $$('[data-sec-mat-type]').forEach(b => b.classList.toggle('active', b.dataset.secMatType === state.configurator.secondaryMaterial));
  $('accentToggleCheck').checked = state.configurator.accentEnabled;
  toggleBlock($('accentCustomizationPanel'), state.configurator.accentEnabled);

  if (state.inspirationType) applyInspirationTab(state.inspirationType);

  // Navigate to saved step without animation on initial load
  const target = $(`step${state.currentStep}`);
  if (target) { $$('.wizard-step').forEach(s => s.classList.remove('active')); target.classList.add('active'); }
  updateStepperUI();
}

/* ── Dimension path toggle ────────────────────────────────────────────────── */
function applyDimPath(knows) {
  state.knowsDimensions = knows;
  const dimBlock = $('dimensionsFormContainer');
  const msgBlock = $('reassuringBlock');
  const yesBtn   = $('knowsDimsBtn');
  const noBtn    = $('noDimsBtn');

  toggleBlock(dimBlock, knows);
  toggleBlock(msgBlock, !knows);
  yesBtn.classList.toggle('active', knows);
  noBtn.classList.toggle('active', !knows);

  if (!knows) state.dimensions = {};
  if (knows) buildDimFields();
  save();
}

/* ── Inspiration tab ──────────────────────────────────────────────────────── */
function applyInspirationTab(type) {
  const gBlock = $('galleryViewBlock');
  const uBlock = $('uploadViewBlock');
  toggleBlock(gBlock, type === 'gallery');
  toggleBlock(uBlock, type === 'upload');
  $('triggerGalleryTab').classList.toggle('active', type === 'gallery');
  $('triggerUploadTab').classList.toggle('active', type === 'upload');
  if (type === 'gallery') initLazyLoader();
}

/* ── Event bindings ───────────────────────────────────────────────────────── */
function bindEvents() {
  // Navigation
  $('nextBtn').addEventListener('click', forward);
  $('prevBtn').addEventListener('click', backward);

  // Stepper dots
  $$('.step-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const n = parseInt(dot.dataset.stepTarget);
      if (n < state.currentStep || validateStep(state.currentStep)) goTo(n);
    });
  });

  // Header scroll
  window.addEventListener('scroll', () => {
    $('mainHeader').classList.toggle('scrolled', window.scrollY > 40);
    $('floatingWhatsAppShortcut').classList.toggle('hidden', window.scrollY <= 180);
  }, { passive: true });

  // Step 1: shape cards
  $$('[data-shape]').forEach(card => {
    const go = () => {
      $$('[data-shape]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.shape = card.dataset.shape;
      buildDimFields(); save();
      setTimeout(forward, 400);
    };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => e.key === 'Enter' && go());
  });

  // Step 2: dimension path
  $('knowsDimsBtn').addEventListener('click', () => applyDimPath(true));
  $('noDimsBtn').addEventListener('click',    () => applyDimPath(false));

  // Step 3: notes
  $('specialNotesInput').addEventListener('input', e => { state.specialNotes = e.target.value; save(); });

  // Step 4: tabs
  $('triggerGalleryTab').addEventListener('click', () => { state.inspirationType = 'gallery'; applyInspirationTab('gallery'); save(); });
  $('triggerUploadTab').addEventListener('click',  () => { state.inspirationType = 'upload';  applyInspirationTab('upload');  save(); });

  // Gallery items
  $$('[data-gallery-src]').forEach(item => {
    const pick = () => {
      $$('[data-gallery-src]').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      state.inspirationType  = 'gallery';
      state.inspirationValue = item.dataset.gallerySrc;
      save(); setTimeout(forward, 400);
    };
    item.addEventListener('click', pick);
    item.addEventListener('keydown', e => e.key === 'Enter' && pick());
  });

  // File upload
  const dropzone = $('dropzoneBox');
  const fileInp  = $('fileInpRef');
  dropzone.addEventListener('click', () => fileInp.click());
  dropzone.addEventListener('keydown', e => e.key === 'Enter' && fileInp.click());
  fileInp.addEventListener('change', e => {
    if (!e.target.files.length) return;
    const fname = e.target.files[0].name;
    state.inspirationType  = 'upload';
    state.inspirationValue = fname;
    $('uploadStatusText').textContent = `تم رفع الملف: ${fname}`;
    toast('تم تحميل الصورة المرجعية بنجاح');
    save(); setTimeout(forward, 600);
  });

  // Drag & drop
  dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.style.borderColor = 'var(--accent-gold)'; });
  dropzone.addEventListener('dragleave', () => { dropzone.style.borderColor = ''; });
  dropzone.addEventListener('drop', e => {
    e.preventDefault(); dropzone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) fileInp.dispatchEvent(Object.assign(new Event('change'), { target: { files: [file] } }));
  });

  // Step 5: cycle shape
  $('cycleShapeBtn').addEventListener('click', () => {
    const shapes = ['U', 'L', 'single'];
    state.shape = shapes[(shapes.indexOf(state.shape || 'U') + 1) % shapes.length];
    buildDimFields(); updateConfigurator(); save();
    toast('تم تغيير الشكل — الألوان محفوظة');
  });

  // Angle buttons
  $$('[data-angle]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-angle]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.configurator.angle = btn.dataset.angle;
      updateConfigurator();
    });
  });

  // Primary material
  $$('[data-mat-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-mat-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.configurator.primaryMaterial = btn.dataset.matType;
      const def = MATERIAL_PALETTE[state.configurator.primaryMaterial][0];
      state.configurator.primaryColorName = def.name;
      state.configurator.primaryColorHex  = def.value;
      renderSwatches('primary'); updateConfigurator(); save();
    });
  });

  // Secondary material
  $$('[data-sec-mat-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-sec-mat-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.configurator.secondaryMaterial = btn.dataset.secMatType;
      const def = MATERIAL_PALETTE[state.configurator.secondaryMaterial][0];
      state.configurator.secondaryColorName = def.name;
      state.configurator.secondaryColorHex  = def.value;
      renderSwatches('secondary'); updateConfigurator(); save();
    });
  });

  // Accent toggle
  $('accentToggleCheck').addEventListener('change', e => {
    state.configurator.accentEnabled = e.target.checked;
    toggleBlock($('accentCustomizationPanel'), e.target.checked);
    updateConfigurator(); save();
  });

  // Contact fields
  ['clientNameInput','clientPhoneInput','clientCityInput'].forEach(id => {
    $(id).addEventListener('input', () => {
      state.contact.name  = $('clientNameInput').value;
      state.contact.phone = $('clientPhoneInput').value;
      state.contact.city  = $('clientCityInput').value;
    });
  });

  // Submit buttons
  $('submitWhatsAppActionBtn').addEventListener('click', submitWhatsApp);
  $('saveDraftActionBtn').addEventListener('click', () => { save(); toast('تم حفظ تكوين الجلسة بأمان', true); });
}
