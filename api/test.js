export const config = {
 runtime: "experimental-edge",
};
import { parseCookies, makeHash, fetchHTML } from "../helpers";
export default async function MyEdgeFunction(request, context) {
 // This is test
 const frozenHeaders = JSON.parse(JSON.stringify(request.headers));
 const cookies = parseCookies(frozenHeaders);

 const url = new URL(request.url);

 const fetchPage = await fetchHTML(url.pathname + url.hash + url.search, cookies);
 if (fetchPage instanceof Response) {
  return fetchPage;
 } else {
  return new Response(fetchPage, {
   status: 200,
   headers: {
    "Content-Type": "text/html",
   },
  });
 }
}
