const fs = require('fs');
let c = fs.readFileSync('majlis.html', 'utf8');
c = c.replace(/data\.catalog\.items/g, 'data.catalog_data.catalog');
c = c.replace(/\$store\.saeedAuth\.user/g, '\$store.saeedAuth?.user');
c = c.replace(/src="\/js\/app\.js"/g, 'src="js/app.js"');
c = c.replace(/fetch\('\/catalog\.json'\)/g, "fetch('catalog.json')");
c = c.replace(/<script defer src="https:\/\/unpkg\.com\/@alpinejs\/intersect@3\.14\.1\/dist\/cdn\.min\.js"><\/script>\s*<script defer src="https:\/\/unpkg\.com\/alpinejs@3\.14\.1\/dist\/cdn\.min\.js"><\/script>\s*<script defer src="js\/app\.js"><\/script>/g, '');
fs.writeFileSync('majlis.html', c);
console.log('Fixed auth and catalog paths');
