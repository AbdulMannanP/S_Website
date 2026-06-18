require('esbuild').build({
  entryPoints: ['frontend/src/react/index.jsx'],
  bundle: true,
  outfile: 'frontend/dist/react-bundle.js',
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' }
}).catch(() => process.exit(1));
