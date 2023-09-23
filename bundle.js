// build.js
await Bun.build({
	entrypoints: ['./index.js'],
	outdir: './public',
	target: 'node',
	minify: true,
});
