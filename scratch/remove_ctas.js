const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// The CTA block usually looks like:
// <!-- CTA -->
// <button ... >
//   <span ... ></span>
// </button>

// Let's use a regex to match and remove them.
html = html.replace(/<!-- CTA -->\s*<button[^>]*@click="isSelectionMode = true[^>]*>[\s\S]*?<\/button>/g, '');

fs.writeFileSync('frontend/index.html', html);
console.log('Removed duplicate CTAs.');
