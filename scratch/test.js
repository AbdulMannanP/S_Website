const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');

// Check x-text
const xTextMatches = html.match(/x-text="([^"]+)"/g) || [];
xTextMatches.forEach(s => {
  try {
    const code = s.substring(8, s.length - 1);
    new Function(code);
  } catch (e) {
    console.log('ERROR IN x-text:', s);
    console.log(e.message);
  }
});

// Check x-html
const xHtmlMatches = html.match(/x-html="([^"]+)"/g) || [];
xHtmlMatches.forEach(s => {
  try {
    const code = s.substring(8, s.length - 1);
    new Function(code);
  } catch (e) {
    console.log('ERROR IN x-html:', s);
    console.log(e.message);
  }
});

// Check x-show
const xShowMatches = html.match(/x-show="([^"]+)"/g) || [];
xShowMatches.forEach(s => {
  try {
    const code = s.substring(8, s.length - 1);
    new Function(code);
  } catch (e) {
    console.log('ERROR IN x-show:', s);
    console.log(e.message);
  }
});

console.log('Done checking Alpine directives.');
