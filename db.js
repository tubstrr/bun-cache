import { Database } from "bun:sqlite";

export const db = new Database(":memory:");

export const initDB = db
 .query("CREATE TABLE pages (hash integer PRIMARY KEY, html text NOT NULL, date integer NOT NULL, slug text NOT NULL);")
 .run();

const insertPage = db.prepare("INSERT INTO pages (hash, html, date, slug) VALUES ($hash, $html, $date, $slug)");
export const insertPages = db.transaction((pages) => {
 for (const page of pages) insertPage.run(page);
});

const updatePage = db.prepare("UPDATE pages SET html = $html, date = $date WHERE hash = $hash");
export const updatePages = db.transaction((pages) => {
 for (const page of pages) updatePage.run(page);
});

const deleteAllBySlug = db.prepare("DELETE FROM pages WHERE slug = $slug");
export const deletePagesBySlug = db.transaction((slugs) => {
 for (const slug of slugs) deleteAllBySlug.run({ $slug: slug });
});

const deleteAll = db.prepare("DELETE FROM pages");
export const deleteAllPages = () => {
 deleteAllPages.run();
};

export const getPage = (hash) => {
 const query = db.query(`SELECT * FROM pages where hash = $hash;`);
 return query.get({ $hash: hash });
};
