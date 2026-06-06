const fs = require('fs');
const path = require('path');

const filesToUpdate = ['almirah.html', 'bedroom.html', 'cot.html', 'kitchen.html'];
const directory = path.join(__dirname);

const footerReplacement = `  <!-- ── Footer ───────────────────────────────────────── -->
  <footer id="footer" class="bg-[#07070a] border-t border-[#c9a96e]/10 py-16 px-6 text-center">
    <!-- WhatsApp Big Button -->
    <a :href="'https://wa.me/' + (content.brand?.whatsappNumber || '9289288004450')"
       class="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25d366] text-white font-bold text-sm uppercase tracking-[0.15em] hover:bg-[#20bd5a] transition-all duration-300 shadow-[0_8px_30px_rgba(37,211,102,0.3)] mb-8">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      <span x-text="lang === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'"></span>
    </a>
    <!-- Phone + Address -->
    <p class="text-white/50 text-sm mb-1" dir="ltr">+966 92 880 04450 — Al Qurayyat, Al Jawf, KSA</p>
    <p class="text-[#c9a96e]/60 text-xs mb-8" style="font-family:'Noto Kufi Arabic',sans-serif;">القريات، الجوف، المملكة العربية السعودية — شركة سعيد للأثاث</p>
    <!-- Logo -->
    <img src="https://ik.imagekit.io/de7qvcvqv/images/logo.png" loading="lazy" alt="Saeed Furniture"
         class="h-8 w-auto mx-auto mb-6 object-contain opacity-60"
         style="filter: invert(1) sepia(1) saturate(1.5) hue-rotate(5deg) brightness(1.1);">
    <!-- Nav Links -->
    <nav class="flex flex-wrap justify-center gap-6 mb-8">
      <a href="/" class="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40 hover:text-[#c9a96e] transition-colors" x-text="lang === 'ar' ? 'الرئيسية' : 'Home'"></a>
      <a href="/select.html" class="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40 hover:text-[#c9a96e] transition-colors" x-text="lang === 'ar' ? 'المجموعات' : 'Collections'"></a>
      <a href="/index.html#about" class="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40 hover:text-[#c9a96e] transition-colors" x-text="lang === 'ar' ? 'من نحن' : 'About'"></a>
      <a href="/index.html#faq" class="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40 hover:text-[#c9a96e] transition-colors" x-text="lang === 'ar' ? 'الأسئلة' : 'FAQ'"></a>
      <a href="/contact.html" class="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40 hover:text-[#c9a96e] transition-colors" x-text="lang === 'ar' ? 'تواصل' : 'Contact'"></a>
    </nav>
    <div class="w-16 h-px bg-[#c9a96e]/20 mx-auto mb-6"></div>
    <div class="text-white/20 text-[0.65rem] uppercase tracking-[0.15em] font-bold relative">
      <a href="/auth" class="absolute bottom-0 left-4 text-[0.5rem] opacity-20 hover:opacity-100 transition-opacity">Atelier Login</a>
      &copy; 2026 Saeed Furniture. All Rights Reserved.
    </div>
  </footer>

  <!-- Floating WhatsApp -->
  <div class="fixed bottom-8 end-6 z-40 animate-pulse-ring rounded-full">
    <a :href="'https://wa.me/' + (content.brand?.whatsappNumber || '9289288004450')"
       class="w-14 h-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] relative z-10 hover:scale-110 transition-transform"
       aria-label="WhatsApp">
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  </div>`;

filesToUpdate.forEach(file => {
  const filePath = path.join(directory, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the footer (find everything from <!-- ── Footer to the end before <div id="customCursor")
  content = content.replace(/<!-- ── Footer ─+ -->[\s\S]*?(?=<div id="customCursor")/g, footerReplacement + '\n  ');
  
  // Ensure "Contact" nav link exists in mobile menu if missing
  if (content.includes('x-show="mobileMenuOpen"')) {
    if (!content.includes('href="/contact.html" @click="mobileMenuOpen = false"')) {
      content = content.replace(
        /<button @click="handleOrderClick\(\); mobileMenuOpen = false"[^>]+>.*?<\/button>/,
        `<a href="/contact.html" @click="mobileMenuOpen = false" class="text-xl font-light text-white/70 hover:text-amber-500 transition-colors uppercase tracking-[0.3em]" x-text="lang === 'ar' ? 'تواصل' : 'Contact'"></a>\n    $&`
      );
    }
  }

  // Double check desktop nav has /contact.html
  content = content.replace(/href="#" @click\.prevent="scrollToFooter\(\)"/g, 'href="/contact.html"');
  content = content.replace(/href="\/portfolio\.html"/g, 'href="/select.html"');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
