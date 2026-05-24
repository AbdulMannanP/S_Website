'use strict';
/**
 * main.js — Saeed Furniture | Editorial Split-Screen
 * GSAP + ScrollTrigger | State Machine | Zero-Latency Preloader
 */

gsap.registerPlugin(ScrollTrigger);

/* ── Color palette per material ──────────────────────────── */
const COLORS = {
  velvet:   [
    { id:'cream',    label:'كريمي',      hex:'#F4EFEA' },
    { id:'navy',     label:'أزرق ملكي',  hex:'#1B2A47' },
    { id:'teal',     label:'تيل',        hex:'#184E5B' },
  ],
  jacquard: [
    { id:'olive',    label:'زيتوني',     hex:'#8A8D63' },
    { id:'beige',    label:'بيج',        hex:'#D6C7B2' },
    { id:'grey',     label:'رمادي',      hex:'#7A7D80' },
  ],
  leather:  [
    { id:'camel',    label:'جملي',       hex:'#C17A43' },
    { id:'espresso', label:'إسبريسو',    hex:'#3D261C' },
    { id:'black',    label:'أسود',       hex:'#1A1A1A' },
  ],
};

const IMG_BASE  = '/static/img/mockups/';
const SOFA_PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85&auto=format&fit=crop';
const getBaseImage = (shape, angle) => `${IMG_BASE}base-sofa-${shape}-${angle}.png`;

const SHAPE_DIMS = {
  U:      [{ id:'wallA', label:'جدار أ (اليسار) — م' }, { id:'wallB', label:'جدار ب (الخلف) — م' }, { id:'wallC', label:'جدار ج (اليمين) — م' }],
  L:      [{ id:'wallA', label:'جدار أ (الطول) — م' }, { id:'wallB', label:'جدار ب (العرض) — م' }],
  single: [{ id:'wallA', label:'جدار أ (الإجمالي) — م' }],
};

/* ── State Machine ───────────────────────────────────────── */
const State = {
  orderId:   genId(),
  shape:     'U',
  knowsDims: true,
  dims:      {},
  notes:     '',
  checks:    {},
  config:    { material:'velvet', color:'cream', angle:'front' },
  contact:   { name:'', phone:'', city:'' },

  setShape(s)    { this.shape = s; this.dims = {}; onShapeChange(); },
  setMaterial(m) { this.config.material = m; this.config.color = COLORS[m][0].id; onMaterialChange(); },
  setColor(c)    { this.config.color = c; swapImage(); },
  setAngle(a)    { this.config.angle = a; swapImage(); },
  setKnows(v)    { this.knowsDims = v; onKnowsChange(); },
};

function genId() {
  const d = new Date();
  return `SAEED-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(1000+Math.random()*9000)}`;
}

const $ = id => document.getElementById(id);
const $$ = s => document.querySelectorAll(s);

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showDiagram(State.shape);
  buildSwatches();
  buildDimInputs();
  onKnowsChange();
  bindEvents();
  initGSAP();
  initParallax();
});

/* ── GSAP Animations ─────────────────────────────────────── */
function initGSAP() {
  // Hero entrance
  const heroTL = gsap.timeline({ delay:.1 });
  heroTL
    .from('#heroEyebrow',  { y:30, opacity:0, duration:.9, ease:'expo.out' })
    .from('#heroHeading',  { y:50, opacity:0, duration:1.1, ease:'expo.out' }, '-=.6')
    .from('#heroSub',      { y:20, opacity:0, duration:.8, ease:'expo.out' }, '-=.5')
    .from('#heroCta',      { y:20, opacity:0, duration:.7, ease:'expo.out' }, '-=.4');

  // Header scroll transparency
  gsap.to('.site-header', {
    scrollTrigger: { trigger:'.hero', start:'bottom 80%', toggleActions:'play none reverse none' },
    borderBottomColor:'rgba(193,154,91,0.2)'
  });

  // Setup section entrance
  gsap.from('.setup-section .section-header', {
    scrollTrigger: { trigger:'#setup', start:'top 80%' },
    y:40, opacity:0, duration:1, ease:'expo.out'
  });
  gsap.from('.shape-selector', {
    scrollTrigger: { trigger:'#setup', start:'top 75%' },
    y:30, opacity:0, duration:.8, ease:'expo.out', delay:.1
  });
  gsap.from('.setup-grid > *', {
    scrollTrigger: { trigger:'.setup-grid', start:'top 80%' },
    y:50, opacity:0, stagger:.15, duration:1, ease:'expo.out'
  });
  gsap.from('.check-item', {
    scrollTrigger: { trigger:'.checklist-block', start:'top 85%' },
    x:20, opacity:0, stagger:.1, duration:.6, ease:'expo.out'
  });

  // Configurator right panel: sections stagger up as user scrolls
  $$('.ctrl-section').forEach(section => {
    gsap.from(section, {
      scrollTrigger: { trigger:section, start:'top 85%' },
      y:40, opacity:0, duration:.9, ease:'expo.out'
    });
  });

  // Swatch entrance (will also re-trigger after rebuild)
  animateSwatches();
}

function animateSwatches() {
  const swatches = $$('.swatch-v');
  gsap.from(swatches, {
    scrollTrigger: { trigger:'#ctrlColor', start:'top 85%' },
    scale:0, opacity:0, stagger:.06, duration:.5, ease:'back.out(1.5)'
  });
}

/* ── Shape Change ────────────────────────────────────────── */
function onShapeChange() {
  // Sync both shape selectors (setup pills + control panel cards)
  $$('.shape-pill').forEach(b => b.classList.toggle('active', b.dataset.shape === State.shape));
  $$('.shape-card-v').forEach(b => b.classList.toggle('active', b.dataset.shape === State.shape));

  // Animate SVG swap in setup section
  const grid = $('setupGrid');
  gsap.to(grid, {
    opacity:0, y:-8, duration:.28, ease:'power2.in',
    onComplete: () => {
      showDiagram(State.shape);
      buildDimInputs();
      gsap.to(grid, { opacity:1, y:0, duration:.5, ease:'power3.out' });
    }
  });

  // Update sofa preview
  swapImage();
}

function showDiagram(shape) {
  $$('.shape-diagram').forEach(d => d.classList.remove('active'));
  const t = $(`diagram-${shape}`);
  if (t) t.classList.add('active');
}

/* ── Knows Dims Toggle ───────────────────────────────────── */
function onKnowsChange() {
  const wrap    = $('measureInputsWrap');
  const calming = $('calmingBlock');

  if (State.knowsDims) {
    gsap.to(calming, { height:0, opacity:0, duration:.3, ease:'power2.in',
      onComplete:() => calming.style.display = 'none' });
    wrap.style.display = 'block';
    gsap.fromTo(wrap, { height:0, opacity:0 }, { height:'auto', opacity:1, duration:.5, ease:'power3.out' });
  } else {
    gsap.to(wrap, { height:0, opacity:0, duration:.3, ease:'power2.in',
      onComplete:() => wrap.style.display = 'none' });
    calming.style.display = 'block';
    gsap.fromTo(calming, { height:0, opacity:0 }, { height:'auto', opacity:1, duration:.5, ease:'power3.out' });
  }
}

/* ── Dimension Inputs ────────────────────────────────────── */
function buildDimInputs() {
  const c = $('measureInputs');
  if (!c) return;
  c.innerHTML = '';
  (SHAPE_DIMS[State.shape] || []).forEach(f => {
    c.insertAdjacentHTML('beforeend', `
      <div class="input-field">
        <label for="dim_${f.id}">${f.label}</label>
        <input type="number" step=".1" min="0" id="dim_${f.id}" class="line-input"
               placeholder="مثال: 3.5" value="${State.dims[f.id]||''}">
        <div class="line-fx"></div>
      </div>`);
    document.getElementById(`dim_${f.id}`).addEventListener('input', e => {
      State.dims[f.id] = parseFloat(e.target.value) || 0;
      updateSeating();
    });
  });
  updateSeating();
}

function updateSeating() {
  const el  = $('seatingResult');
  if (!el) return;
  const vals = Object.values(State.dims).filter(v => v > 0);
  if (!vals.length) { el.textContent = ''; return; }
  const seating = Math.max(0, vals.reduce((a,b)=>a+b,0) - 0.85 * vals.length);
  el.textContent = `مساحة الجلوس الإجمالية المتاحة: ${seating.toFixed(2)} م`;
}

/* ── Material Change ─────────────────────────────────────── */
function onMaterialChange() {
  $$('.mat-row').forEach(b => b.classList.toggle('active', b.dataset.mat === State.config.material));
  buildSwatches();
  swapImage();
  preloadCombination();
}

/* ── Swatches ────────────────────────────────────────────── */
function buildSwatches() {
  const row = $('swatchGridV');
  if (!row) return;
  row.innerHTML = '';
  const colorLabelEl = $('activeColorName');
  const activeColorObj = COLORS[State.config.material]?.find(c => c.id === State.config.color);
  if (colorLabelEl && activeColorObj) {
    colorLabelEl.textContent = `اللون المحدد: ${activeColorObj.label}`;
  }
  
  (COLORS[State.config.material] || []).forEach((c, i) => {
    const sw = document.createElement('button');
    sw.className = 'swatch-v' + (c.id === State.config.color ? ' active' : '');
    sw.style.cssText = `background:${c.hex}`;
    sw.setAttribute('aria-label', c.label);
    sw.addEventListener('click', () => {
      $$('.swatch-v').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      State.setColor(c.id);
      if (colorLabelEl) {
        colorLabelEl.textContent = `اللون المحدد: ${c.label}`;
      }
    });
    row.appendChild(sw);

    // GSAP swatch pop-in
    gsap.fromTo(sw,
      { scale:0, opacity:0 },
      { scale:1, opacity:1, duration:.4, delay:i*.05, ease:'back.out(1.7)' }
    );
  });
}

/* ── Image & Tint Swap ───────────────────────────────────── */
function swapImage() {
  const img = $('previewImg');
  const tint = $('tintOverlay');
  if (!img || !tint) return;

  // Determine selected color
  const colorObj = COLORS[State.config.material]?.find(c => c.id === State.config.color);
  const targetHex = colorObj ? colorObj.hex : 'transparent';

  // Animate the tint overlay using GSAP
  gsap.to(tint, {
    backgroundColor: targetHex,
    duration: 0.8,
    ease: 'power3.inOut'
  });

  // Only swap the actual image file if shape or angle changed
  const targetSrc = getBaseImage(State.shape, State.config.angle);
  
  // If the source is already the target, we are done
  // Note: we check endsWith to handle absolute vs relative paths safely
  if (img.src.endsWith(targetSrc)) return;

  const tmp = new Image();
  tmp.onload = () => {
    // Elegant crossfade for base image
    gsap.to(img, {
      opacity: 0.2, 
      duration: 0.3, 
      ease: 'power2.inOut',
      onComplete: () => {
        img.src = targetSrc;
        gsap.to(img, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      }
    });
  };
  tmp.onerror = () => {
    // Fallback to placeholder if asset is missing
    if (!img.src.endsWith(SOFA_PLACEHOLDER)) {
      gsap.to(img, {
        opacity: 0.2, duration: 0.3, ease: 'power2.inOut',
        onComplete: () => {
          img.src = SOFA_PLACEHOLDER;
          gsap.to(img, { opacity: 1, duration: 0.5, ease: 'power2.out' });
        }
      });
    }
  };
  tmp.src = targetSrc;
}

function preloadCombination() {
  // We only need to preload the base images for the current shape across all angles
  ['front','three_quarter','side'].forEach(a => { 
    new Image().src = getBaseImage(State.shape, a); 
  });
}

/* ── Summary Card ────────────────────────────────────────── */
function buildSummary() {
  const box = $('summaryCard');
  if (!box) return;
  const shapeMap  = { U:'شكل U', L:'شكل L', single:'قطعة واحدة' };
  const matMap    = { velvet:'قطيفة', jacquard:'جاكار', leather:'جلد' };
  const colorLbl  = COLORS[State.config.material]?.find(c=>c.id===State.config.color)?.label||'—';
  let dimsText    = 'متروك لمعاينة الفريق';
  if (State.knowsDims && Object.keys(State.dims).length)
    dimsText = Object.entries(State.dims).map(([k,v])=>`${k}: ${v}م`).join(' × ');

  box.innerHTML = [
    ['رقم الطلب',   `<span style="color:var(--gold)">${State.orderId}</span>`],
    ['الشكل',       shapeMap[State.shape]],
    ['الأبعاد',     dimsText],
    ['الخامة',      `${matMap[State.config.material]} — ${colorLbl}`],
    ['الملاحظات',   State.notes||'لا توجد'],
  ].map(([k,v])=>
    `<div class="summary-row"><span class="s-key">${k}:</span><span class="s-val">${v}</span></div>`
  ).join('');
}

/* ── WhatsApp Submit ─────────────────────────────────────── */
function submitWA() {
  const {name,phone,city} = State.contact;
  if (!name||!phone||!city) { toast('يرجى ملء بيانات التواصل'); return; }
  if (!/^(?:\+966|00966|0)?5\d{8}$/.test(phone)) { toast('رقم الجوال غير صحيح'); return; }

  const shapeMap = { U:'U — ثلاثة جدران', L:'L — جداران', single:'قطعة واحدة' };
  const matMap   = { velvet:'قطيفة', jacquard:'جاكار', leather:'جلد' };
  const colorLbl = COLORS[State.config.material]?.find(c=>c.id===State.config.color)?.label||'—';
  let dims       = 'متروك للفريق';
  if (State.knowsDims && Object.keys(State.dims).length)
    dims = Object.entries(State.dims).map(([k,v])=>`${k}:${v}م`).join(', ');

  const checks = Object.entries(State.checks).filter(([,v])=>v).map(([k])=>k).join('، ');

  const msg = encodeURIComponent(
    `مرحباً Saeed Furniture،\nأود طلب مجلس فاخر:\n` +
    `• رقم الطلب: ${State.orderId}\n• الشكل: ${shapeMap[State.shape]}\n` +
    `• الأبعاد: ${dims}\n• الخامة: ${matMap[State.config.material]} — ${colorLbl}\n` +
    `• ملاحظات: ${State.notes||'لا توجد'}\n• تقنية: ${checks||'لا توجد'}\n` +
    `• الاسم: ${name}\n• الجوال: ${phone}\n• المدينة: ${city}`
  );
  window.open(`https://wa.me/966500000000?text=${msg}`, '_blank');
}

/* ── Toast ───────────────────────────────────────────────── */
let _tt;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(_tt); _tt = setTimeout(() => el.classList.remove('show'), 3500);
}

/* ── Event Binding ───────────────────────────────────────── */
function bindEvents() {
  // Setup: shape pills
  $$('.shape-pill').forEach(b =>
    b.addEventListener('click', () => State.setShape(b.dataset.shape))
  );
  // Configurator: shape cards
  $$('.shape-card-v').forEach(b =>
    b.addEventListener('click', () => State.setShape(b.dataset.shape))
  );

  // Knows dims
  $$('.knows-btn').forEach(b => b.addEventListener('click', () => {
    $$('.knows-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    State.setKnows(b.dataset.knows === 'yes');
  }));

  // Notes
  $('specialNotes')?.addEventListener('input', e => State.notes = e.target.value);

  // Material
  $$('.mat-row').forEach(b =>
    b.addEventListener('click', () => State.setMaterial(b.dataset.mat))
  );

  // Angle tabs
  $$('.angle-tab').forEach(b => b.addEventListener('click', () => {
    $$('.angle-tab').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    State.setAngle(b.dataset.angle);
  }));

  // Custom checkboxes
  $$('.check-item input').forEach(inp =>
    inp.addEventListener('change', () => { State.checks[inp.dataset.check] = inp.checked; })
  );

  // Contact fields
  [['inpName','name'],['inpPhone','phone'],['inpCity','city']].forEach(([id,field]) =>
    $(id)?.addEventListener('input', e => State.contact[field] = e.target.value)
  );

  // Summary auto-build on scroll
  ScrollTrigger.create({
    trigger:'#ctrlSummary', start:'top 80%',
    onEnter: buildSummary
  });

  // Order CTA
  $('orderBtn')?.addEventListener('click', submitWA);
}

/* ── Mouse Parallax ──────────────────────────────────────── */
function initParallax() {
  const stageCol = $('stageCol');
  const previewImg = $('previewImg');
  const shadow = document.querySelector('.stage-shadow');
  const wrap = document.querySelector('.stage-img-wrap');
  if (!stageCol || !previewImg || !wrap) return;

  stageCol.addEventListener('mousemove', e => {
    const rect = stageCol.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    gsap.to(wrap, {
      x: normX * 25,
      y: normY * 15,
      rotateY: normX * 8,
      rotateX: -normY * 8,
      duration: 0.8,
      ease: 'power2.out',
      transformPerspective: 1000
    });
    
    if (shadow) {
      gsap.to(shadow, {
        x: normX * -10,
        y: normY * -5,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  });

  stageCol.addEventListener('mouseleave', () => {
    gsap.to(wrap, {
      x: 0,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.75)'
    });
    if (shadow) {
      gsap.to(shadow, {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.75)'
      });
    }
  });
}
