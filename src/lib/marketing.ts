function appendScript(src: string, attributes: Record<string, string> = {}) {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
  document.head.appendChild(script);
}

export function initializeMarketingScripts() {
  const gtmId = String(import.meta.env.VITE_GTM_ID || "").trim();
  const gaId = String(import.meta.env.VITE_GA_ID || "").trim();
  const utmifyPixelId = String(import.meta.env.VITE_UTMIFY_PIXEL_ID || "").trim();

  window.dataLayer = window.dataLayer || [];

  if (gtmId) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    appendScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
  }

  if (gaId) {
    appendScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`);
    const gtag = (...args: unknown[]) => window.dataLayer.push(args as unknown as Record<string, unknown>);
    gtag("js", new Date());
    gtag("config", gaId);
  }

  if (utmifyPixelId) {
    (window as unknown as { pixelId: string }).pixelId = utmifyPixelId;
    appendScript("https://cdn.utmify.com.br/scripts/pixel/pixel.js");
  }
}
