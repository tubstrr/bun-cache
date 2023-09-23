// Helpers
import { parseCookies, makeHash, fetchHTML } from './helpers';
import { initDB, insertPages, getPage, updatePages, deletePagesBySlug, deleteAllPages } from './db';

// Create
initDB;

const server = Bun.serve({
	async fetch(req) {
		const frozenHeaders = JSON.parse(JSON.stringify(req.headers));
		const cookies = parseCookies(frozenHeaders);

		const url = new URL(req.url);

		const shouldRefresh = url.searchParams.has('refresh');
		if (shouldRefresh) {
			const mode = url.searchParams.get('refresh');
			if (mode === 'all') {
				deleteAllPages();
			} else if (mode === 'slug') {
				const slug = url.pathname + url.hash + url.search;
				deletePagesBySlug([slug]);
			}
		}
		const hash = makeHash(url + JSON.stringify(cookies));

		const cachedPage = getPage(hash);

		// This is the
		let html;
		if (!cachedPage) {
			const fetchPage = await fetchHTML(url.pathname + url.hash + url.search, cookies);

			// If this isn't an HTML page, just proxy it
			if (fetchPage instanceof Response) {
				return fetchPage;
			}

			// If it is an HTML page, cache it
			html = fetchPage;
			const pages = [
				{
					$hash: hash,
					$html: html,
					$date: Date.now(),
					$slug: url.pathname + url.hash + url.search,
				},
			];
			insertPages(pages);
		} else {
			// If we have a cached page, check if it's expired
			const now = Date.now();
			const oneDay = 1000 * 60 * 60 * 24;
			const pageAge = now - cachedPage.date;
			if (pageAge > oneDay) {
				console.log('expired');
				// If it's expired, fetch a new page
				const fetchPage = await fetchHTML(url.pathname + url.hash + url.search, cookies);
				html = fetchPage;
				const pages = [
					{
						$hash: hash,
						$html: html,
						$date: Date.now(),
					},
				];
				updatePages(pages);
			} else {
				// If it's not expired, use the cached page
				html = cachedPage.html;
			}
		}

		// Base HTML response
		return new Response(html, {
			status: 200,
			headers: {
				'Content-Type': 'text/html',
			},
		});
	},
	port: 443,
});

console.log(`Listening on http://localhost:${server.port} ...`);
