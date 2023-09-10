export const parseCookies = (headers) => {
 const list = {};
 const cookieHeader = headers?.cookie;
 if (!cookieHeader) return list;

 cookieHeader.split(`;`).forEach(function (cookie) {
  let [name, ...rest] = cookie.split(`=`);
  name = name?.trim();
  if (!name) return;
  const value = rest.join(`=`).trim();
  if (!value) return;
  list[name] = decodeURIComponent(value);
 });

 return list;
};

export const makeHash = (string) => {
 var hash = 0,
  i,
  chr;
 if (string.length === 0) return hash;
 for (i = 0; i < string.length; i++) {
  chr = string.charCodeAt(i);
  hash = (hash << 5) - hash + chr;
  hash |= 0; // Convert to 32bit integer
 }
 return hash;
};

const baseURL = "https://chicago-beyond.vercel.thisismess.io";
export const fetchHTML = async (slug = "", cookies = null) => {
 if (cookies) {
  cookies = Object.entries(cookies)
   .map(([key, value]) => `${key}=${value}`)
   .join("; ");
 }

 const response = await fetch(baseURL + slug, {
  headers: {
   cookie: cookies,
  },
 });
 const contentType = response.headers.get("content-type");
 if (contentType && contentType.includes("text/html")) {
  const html = await response.text();
  return html;
 }
 return response;
};
