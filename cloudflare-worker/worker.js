/**
 * Cloudflare Worker — proxies lifox.com.ng/yearbook/* to the UMIC Yearbook
 * Flask app hosted on Render, so visitors only ever see the school domain.
 *
 * SETUP:
 * 1. Cloudflare dashboard → Workers & Pages → Create → "Create Worker".
 * 2. Paste this file's contents into the Worker editor, replacing the default code.
 * 3. Deploy the Worker.
 * 4. Cloudflare dashboard → your zone (lifox.com.ng) → Workers Routes →
 *    Add route:
 *      Route:  lifox.com.ng/yearbook*
 *      Worker: (the worker you just created)
 * 5. Done. Visiting lifox.com.ng/yearbook will now transparently serve the
 *    Flask app running at the BACKEND_ORIGIN below.
 *
 * If you ever change Render services or move to Railway, only BACKEND_ORIGIN
 * below needs to change — nothing else.
 */

const BACKEND_ORIGIN = "https://umic-yearbook.onrender.com";
const MOUNT_PATH = "/yearbook"; // must match URL_PREFIX set on the Flask app

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only handle paths under the mount path; let everything else on the
    // zone fall through to whatever else Cloudflare/your main site serves.
    if (!url.pathname.startsWith(MOUNT_PATH)) {
      return fetch(request);
    }

    // Build the backend URL: same path/query, just swapped onto Render's origin.
    // We keep the /yearbook prefix in the forwarded path because the Flask
    // app's URL_PREFIX env var expects it there (it strips it internally).
    const backendUrl = new URL(url.pathname + url.search, BACKEND_ORIGIN);

    // Clone the incoming request so we can forward method/body/most headers,
    // but rewrite Host so Render's routing doesn't get confused.
    const forwardHeaders = new Headers(request.headers);
    forwardHeaders.set("Host", new URL(BACKEND_ORIGIN).host);
    // X-Forwarded-* headers let Flask's ProxyFix middleware know the real
    // client-facing scheme/host, so generated links use https://lifox.com.ng
    // instead of the internal Render hostname. The /yearbook prefix itself
    // is handled by the URL_PREFIX environment variable on the Render side,
    // not by a header, so it isn't set here.
    forwardHeaders.set("X-Forwarded-Host", url.host);
    forwardHeaders.set("X-Forwarded-Proto", "https");

    const backendRequest = new Request(backendUrl.toString(), {
      method: request.method,
      headers: forwardHeaders,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "manual",
    });

    const response = await fetch(backendRequest);

    // Pass the response straight through. Because url_for() inside Flask
    // already generates /yearbook/-prefixed links (via URL_PREFIX), we don't
    // need to rewrite HTML/CSS/JS bodies here — only headers, if anything.
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};
