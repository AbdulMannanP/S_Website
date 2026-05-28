const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// Phase 3: Add classes to node containers
const showrooms = ['majlis', 'kitchen', 'bedroom', 'cot', 'almirah'];
showrooms.forEach(room => {
  const searchStr = `<div x-show="activeShowroom === '${room}' && !isSelectionMode"`;
  if (!html.includes(searchStr + ' class=')) {
    html = html.replace(searchStr, searchStr + ' class="relative w-full min-h-screen overflow-hidden block"');
  }
});

// Fix Back button positioning and styling
const oldBackBtnContainer = '<div class="fixed top-20 left-6 z-50">';
const newBackBtnContainer = '<div class="absolute top-24 left-8 z-50">';
html = html.split(oldBackBtnContainer).join(newBackBtnContainer);

const oldBtnClass = 'class="flex items-center gap-2 text-white/60 hover:text-[#c9a96e] transition-all duration-300 group bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 hover:border-[#c9a96e]/40"';
const newBtnClass = 'class="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 group bg-[#080809]/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 hover:border-[#c9a96e]/50 shadow-lg"';
html = html.split(oldBtnClass).join(newBtnClass);

// Purge duplicate generic CTA buttons from nodes
// Let's use regex to find and remove:
// <button class="absolute bottom-10 left-10 z-50 ..."> ... </button>
// Wait, is there a CTA section inside the node? Let's check HTML.
fs.writeFileSync('frontend/index.html', html);
console.log('Fixed node containers and back buttons.');
