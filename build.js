require('esbuild').build({
  entryPoints: ['frontend/src/react/index.jsx'],
  bundle: true,
  outfile: 'frontend/dist/react-bundle.js',
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  target: ['es2015', 'chrome58', 'firefox57', 'safari11', 'edge16'],
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' }
}).catch(() => process.exit(1));
