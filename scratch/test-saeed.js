const fs = require('fs');

const html = fs.readFileSync('frontend/index.html', 'utf8');

// Extract saeedApp script block
const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
let saeedAppScript = '';
scriptMatch.forEach(s => {
  if (s.includes('function saeedApp')) {
    saeedAppScript = s.replace(/<script[^>]*>|<\/script>/g, '');
  }
});

try {
  // Try to define and call saeedApp
  const code = saeedAppScript + '\nconst app = saeedApp(); console.log("saeedApp() returned successfully.");';
  new Function('window', 'document', 'localStorage', 'navigator', 'crypto', 'Alpine', code)({}, {}, {getItem:()=>null, setItem:()=>{}}, {userAgent:''}, {randomUUID:()=>''}, {store:()=>({}), nextTick:()=>{}});
} catch (e) {
  console.log('RUNTIME ERROR WHEN CALLING saeedApp():', e.message);
}
