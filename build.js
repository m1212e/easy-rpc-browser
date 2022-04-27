const esbuild = require('esbuild');
const fs = require('fs');

esbuild.buildSync({
        entryPoints: ['./main.ts'],
        outdir: 'dist',
        bundle: true,
        sourcemap: true,
        format: "esm",
        minify: true,
        platform: 'browser',
        target: ['es2018'],
});


fs.copyFileSync('package.json', 'dist/package.json');
fs.copyFileSync('LICENSE', 'dist/LICENSE');