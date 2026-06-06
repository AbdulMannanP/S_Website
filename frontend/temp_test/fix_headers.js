const fs = require('fs');
const path = require('path');

const dir = '../';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const langToggleHtml = `
      <div class="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 ml-2" dir="ltr">
        <button @click="lang = 'en'" :class="lang === 'en' ? 'bg-[#c9a96e] text-white' : 'text-white/60 hover:text-white'" class="px-3 py-1 text-[0.6rem] font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-300">EN</button>
        <button @click="lang = 'ar'" :class="lang === 'ar' ? 'bg-[#c9a96e] text-white' : 'text-white/60 hover:text-white'" class="px-3 py-1 text-[0.65rem] font-bold rounded-full transition-all duration-300 font-cairo">عربي</button>
      </div>`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove the standalone fixed-lang-toggle block entirely.
  content = content.replace(/<!-- Fixed Language Toggle.*?<\/div>/s, '');
  content = content.replace(/<div class="fixed-lang-toggle[^>]*>[\s\S]*?<\/div>/g, '');

  // 2. Remove any existing lang toggles inside the header to prevent duplicates.
  content = content.replace(/<div class="flex items-center bg-white\/10 backdrop-blur-md rounded-full p-1 border border-white\/20 ml-2".*?<\/div>/s, '');

  // 3. Inject the new language toggle inside the header's right-side flex container
  // We look for: <div class="flex items-center gap-4 flex-shrink-0" dir="ltr">
  content = content.replace(
    /<div class="flex items-center gap-4 flex-shrink-0" dir="ltr">/g,
    `<div class="flex items-center gap-4 flex-shrink-0" dir="ltr">\n${langToggleHtml}`
  );

  // If the file didn't have that exact div, we can inject it before the closing </header>
  if (!content.includes(langToggleHtml) && content.includes('</header>')) {
      // Find </header> and put it right before
      content = content.replace('</header>', `  <div class="flex items-center gap-4 flex-shrink-0" dir="ltr">\n${langToggleHtml}\n  </div>\n</header>`);
  }

  // 4. Remove padding-right: 120px !important from header since it's no longer fixed right
  content = content.replace(/style="padding-right: 120px !important;"/g, '');

  // 5. Remove Collections link from select.html header
  if (file === 'select.html') {
    content = content.replace(/<a href="\/select\.html"[^>]*>.*?<\/a>/g, '');
  }

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Headers updated in all HTML files.');
