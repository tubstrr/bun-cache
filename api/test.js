export const config = {
 runtime: "experimental-edge",
};

export default function MyEdgeFunction(request, context) {
 return new Response(`Hello, from ${request.url} I'm an Edge Function!`);
}
