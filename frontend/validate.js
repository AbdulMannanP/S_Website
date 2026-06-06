const fs = require('fs');
const content = fs.readFileSync('majlis.html', 'utf8');
const match = content.match(/x-data="([\s\S]*?)"\s+x-init/);
if (match) {
  let xdata = match[1];
  if (xdata.startsWith('{')) xdata = xdata.slice(1, -1);
  try {
    const fn = new Function('saeedApp', 'return {' + xdata + '}');
    fn(() => ({}));
    console.log('Valid JS!');
  } catch(e) {
    console.log('Syntax Error:', e.message);
  }
} else {
  console.log('No match for x-data');
}
