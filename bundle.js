// build.js
await Bun.build({
	entrypoints: ['./index.js'],
	outdir: './api',
	outfile: 'index.js',
	target: 'node',
	minify: true,
});
