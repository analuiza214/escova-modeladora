function appendScript(src: string, attributes: Record<string, string> = {}) {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
  document.head.appendChild(script);
}

export const GOOGLE_ANALYTICS_ID = String(import.meta.env.VITE_GA_ID || "G-93HTBGTSWB").trim();

export function initializeMarketingScripts() {
  const gtmId = String(import.meta.env.VITE_GTM_ID || "").trim();
  const gaId = GOOGLE_ANALYTICS_ID;
  const googleAdsId = "AW-18518738981";
  const utmifyPixelId = String(import.meta.env.VITE_UTMIFY_PIXEL_ID || "").trim();

  window.dataLayer = window.dataLayer || [];

  if (gtmId) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    appendScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
  }

  if (gaId || googleAdsId) {
    appendScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId || googleAdsId)}`);
    const gtag = (...args: unknown[]) => window.dataLayer.push(args as unknown as Record<string, unknown>);
    window.gtag = gtag;
    gtag("js", new Date());
    if (gaId) gtag("config", gaId);
    gtag("config", googleAdsId);
  }

  if (utmifyPixelId) {
    (window as unknown as { pixelId: string }).pixelId = utmifyPixelId;
    appendScript("https://cdn.utmify.com.br/scripts/pixel/pixel.js");
  }

  {
    const target = window as unknown as Record<string, unknown>;
    if (typeof target.fbq !== "function") {
      type FbqLoader = ((...args: unknown[]) => void) & {
        callMethod?: (...args: unknown[]) => void;
        queue: unknown[][];
        loaded: boolean;
        version: string;
      };
      const fbq = ((...args: unknown[]) => {
        if (typeof fbq.callMethod === "function") fbq.callMethod(...args);
        else fbq.queue.push(args);
      }) as FbqLoader;
      Object.assign(fbq, { queue: [], loaded: true, version: "2.0" });
      target.fbq = fbq;
      target._fbq = fbq;
      // Preserve events emitted while the public pixel ID loads from the server.
      void fetch("/api/marketing-config", { cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) return;
          const config = await response.json();
          const pixelId = String(config.facebookPixelId || "");
          if (!/^\d+$/.test(pixelId)) return;
          fbq.queue.unshift(["init", pixelId], ["track", "PageView"]);
          appendScript("https://connect.facebook.net/en_US/fbevents.js");
        })
        .catch(() => { /* Marketing availability must not interrupt checkout. */ });
    }
  }
}
