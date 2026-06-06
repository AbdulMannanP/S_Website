const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('../majlis.html', 'utf8');

// Read scripts manually
const appJsCode = fs.readFileSync('../js/app.js', 'utf8');

// Fetch Alpine directly to avoid network issues inside jsdom
const https = require('https');

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  try {
    const alpineJsCode = await download('https://unpkg.com/alpinejs@3.14.1/dist/cdn.min.js');
    
    // We replace the external script tags so JSDOM doesn't try to fetch them
    let cleanHtml = html
      .replace(/<script defer src="[^"]*alpinejs[^"]*"><\/script>/g, '')
      .replace(/<script defer src="js\/app.js"><\/script>/g, '');

    const dom = new JSDOM(cleanHtml, {
      url: "http://localhost:8000/majlis.html",
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true
    });

    const window = dom.window;

    // Mock fetch for catalog.json
    window.fetch = async (url) => {
      if (url === '/catalog.json') {
        return {
          json: async () => JSON.parse(fs.readFileSync('../catalog.json', 'utf8'))
        };
      }
      return { json: async () => ({}) };
    };

    // Capture errors
    window.console.error = (...args) => console.log('[Console Error]', ...args);
    window.console.log = (...args) => console.log('[Console Log]', ...args);
    window.console.warn = (...args) => console.log('[Console Warn]', ...args);
    
    window.addEventListener('error', (e) => {
      console.log('[Window Error]', e.message, e.filename, e.lineno);
    });

    // Execute app.js and Alpine manually
    const scriptApp = window.document.createElement('script');
    scriptApp.textContent = appJsCode;
    window.document.body.appendChild(scriptApp);

    const scriptAlpine = window.document.createElement('script');
    scriptAlpine.textContent = alpineJsCode;
    window.document.body.appendChild(scriptAlpine);

    console.log("Scripts injected, waiting for Alpine to initialize...");
    
    setTimeout(() => {
      console.log("Models length:", window.document.querySelectorAll('template[x-for] + div').length);
      console.log("Active model status:", window.document.querySelector('main').style.display);
      process.exit(0);
    }, 2000);
  } catch (err) {
    console.error("Test setup error", err);
  }
})();
