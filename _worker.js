export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    // Obtener el recurso estático (index.html, css, imágenes, etc.)
    const response = await env.ASSETS.fetch(request);

    // Solo modificamos el HTML si la petición viene del dominio tucamarero
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html") && (host.includes("tucamarero") || url.searchParams.get("brand") === "tucamarero")) {
      return new HTMLRewriter()
        .on("title", {
          element(el) {
            el.setInnerContent("tuCamarero - El mejor camarero virtual para tu bar o restaurante");
          }
        })
        .on("meta[id='seo-title']", {
          element(el) {
            el.setAttribute("content", "tuCamarero - El mejor camarero virtual para tu bar o restaurante");
          }
        })
        .on("meta[name='description']", {
          element(el) {
            el.setAttribute("content", "Automatiza pedidos por QR, comandas en cocina y cobros ágiles sin descargar apps. La solución inteligente para bares y restaurantes.");
          }
        })
        .on("meta[property='og:title']", {
          element(el) {
            el.setAttribute("content", "tuCamarero - El mejor camarero virtual para tu bar o restaurante");
          }
        })
        .on("meta[property='og:description']", {
          element(el) {
            el.setAttribute("content", "Automatiza pedidos por QR, comandas en cocina y cobros ágiles sin descargar apps. La solución inteligente para bares y restaurantes.");
          }
        })
        .on("meta[property='og:image']", {
          element(el) {
            el.setAttribute("content", "https://www.tucamarero.com/assets/logo-tucamarero.png");
          }
        })
        .on("meta[property='og:site_name']", {
          element(el) {
            el.setAttribute("content", "tuCamarero");
          }
        })
        .on("meta[property='og:url']", {
          element(el) {
            el.setAttribute("content", "https://www.tucamarero.com/");
          }
        })
        .on("meta[name='twitter:title']", {
          element(el) {
            el.setAttribute("content", "tuCamarero - El mejor camarero virtual para tu bar");
          }
        })
        .on("meta[name='twitter:description']", {
          element(el) {
            el.setAttribute("content", "Automatiza pedidos por QR, comandas en cocina y cobros ágiles sin descargar apps.");
          }
        })
        .on("meta[name='twitter:image']", {
          element(el) {
            el.setAttribute("content", "https://www.tucamarero.com/assets/logo-tucamarero.png");
          }
        })
        .on("link[rel='canonical']", {
          element(el) {
            el.setAttribute("href", "https://www.tucamarero.com/");
          }
        })
        .transform(response);
    }

    return response;
  }
};
