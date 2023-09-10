import { Database } from "bun:sqlite";

export const db = new Database(":memory:");

export const initDB = db
 .query("CREATE TABLE pages (hash integer PRIMARY KEY, html text NOT NULL, date integer NOT NULL);")
 .run();

const insertPage = db.prepare("INSERT INTO pages (hash, html, date) VALUES ($hash, $html, $date)");
export const insertPages = db.transaction((pages) => {
 for (const page of pages) insertPage.run(page);
});

const updatePage = db.prepare("UPDATE pages SET html = $html, date = $date WHERE hash = $hash");
export const updatePages = db.transaction((pages) => {
 for (const page of pages) updatePage.run(page);
});

export const getPage = (hash) => {
 const query = db.query(`SELECT * FROM pages where hash = $hash;`);
 return query.get({ $hash: hash });
};
