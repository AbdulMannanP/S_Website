import re

def patch_file(filepath, is_index=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Phase 3: Purge the Redundant Master CTA
    cta_pattern = re.compile(r'<!-- ── Ultimate Floating CTA \(Glowing \+ Floating\) ──────── -->.*?</button>\s*', re.DOTALL)
    html = cta_pattern.sub('', html)

    if is_index:
        # Phase 1 & 2 on index.html
        # Replace LAYER 4 and LAYER 5 completely
        layer4_5 = """      <!-- LAYER 4: Visual Pulse Markers -->
      <div class="absolute inset-0 z-[25] pointer-events-none">
        <div class="absolute w-4 h-4 bg-white/80 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,1)] top-[75%] left-[25%] -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute w-4 h-4 bg-white/80 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,1)] top-[35%] left-[52.5%] -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute w-4 h-4 bg-white/80 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,1)] top-[62.5%] left-[70%] -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute w-4 h-4 bg-white/80 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,1)] top-[65%] left-[87.5%] -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute w-4 h-4 bg-white/80 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,1)] top-[35%] left-[77.5%] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <!-- LAYER 5: Hover Labels -->
      <div class="absolute inset-0 z-30 pointer-events-none">
        <div class="absolute top-[75%] left-[25%] -translate-x-1/2 -translate-y-10 transition-all duration-300 opacity-0 pointer-events-none"
             :class="hoverTarget === 'majlis' ? '!opacity-100 translate-y-0' : '!opacity-0 translate-y-2'">
          <span class="bg-black/80 backdrop-blur-md text-[#c9a96e] text-xs px-3 py-1.5 rounded-full border border-[#c9a96e]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] tracking-widest uppercase font-bold" x-text="lang === 'ar' ? 'المجلس' : 'The Majlis Collection'"></span>
        </div>
        <div class="absolute top-[35%] left-[52.5%] -translate-x-1/2 -translate-y-10 transition-all duration-300 opacity-0 pointer-events-none"
             :class="hoverTarget === 'kitchen' ? '!opacity-100 translate-y-0' : '!opacity-0 translate-y-2'">
          <span class="bg-black/80 backdrop-blur-md text-[#c9a96e] text-xs px-3 py-1.5 rounded-full border border-[#c9a96e]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] tracking-widest uppercase font-bold" x-text="lang === 'ar' ? 'المطابخ' : 'Bespoke Kitchens'"></span>
        </div>
        <div class="absolute top-[62.5%] left-[70%] -translate-x-1/2 -translate-y-10 transition-all duration-300 opacity-0 pointer-events-none"
             :class="hoverTarget === 'cot' ? '!opacity-100 translate-y-0' : '!opacity-0 translate-y-2'">
          <span class="bg-black/80 backdrop-blur-md text-[#c9a96e] text-xs px-3 py-1.5 rounded-full border border-[#c9a96e]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] tracking-widest uppercase font-bold" x-text="lang === 'ar' ? 'الأسرة' : 'Premium Cots'"></span>
        </div>
        <div class="absolute top-[65%] left-[87.5%] -translate-x-1/2 -translate-y-10 transition-all duration-300 opacity-0 pointer-events-none"
             :class="hoverTarget === 'bedroom' ? '!opacity-100 translate-y-0' : '!opacity-0 translate-y-2'">
          <span class="bg-black/80 backdrop-blur-md text-[#c9a96e] text-xs px-3 py-1.5 rounded-full border border-[#c9a96e]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] tracking-widest uppercase font-bold" x-text="lang === 'ar' ? 'غرف النوم' : 'Arabian Bedroom'"></span>
        </div>
        <div class="absolute top-[35%] left-[77.5%] -translate-x-1/2 -translate-y-10 transition-all duration-300 opacity-0 pointer-events-none"
             :class="hoverTarget === 'almirah' ? '!opacity-100 translate-y-0' : '!opacity-0 translate-y-2'">
          <span class="bg-black/80 backdrop-blur-md text-[#c9a96e] text-xs px-3 py-1.5 rounded-full border border-[#c9a96e]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] tracking-widest uppercase font-bold" x-text="lang === 'ar' ? 'الخزائن' : 'Storage & Almirah'"></span>
        </div>
      </div>"""

        # Replace the existing layer 4 and 5 block
        pattern_layer45 = re.compile(r'<!-- LAYER 4: Visual Pulse Markers -->.*?</div>\s*</div>', re.DOTALL)
        
        # We need to make sure we only match up to the end of LAYER 5.
        # Let's be safer:
        html = re.sub(r'<!-- LAYER 4: Visual Pulse Markers -->.*?(?=\s*</section>)', layer4_5, html, flags=re.DOTALL)
        # The above replaces everything from LAYER 4 up to </section> of the hero. Let's make sure it's correct.

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Patched {filepath}")

patch_file('frontend/index.html', is_index=True)
for page in ['majlis.html', 'kitchen.html', 'bedroom.html', 'cot.html', 'almirah.html']:
    patch_file(f'frontend/{page}', is_index=False)
