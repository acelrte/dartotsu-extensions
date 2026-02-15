const BASE = "https://hianime.to";

export default {
  name: "Hianime",

  async search(query) {
    const res = await fetch(`${BASE}/search?keyword=${encodeURIComponent(query)}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    return [...doc.querySelectorAll(".flw-item")].map(el => ({
      title: el.querySelector(".film-name")?.textContent.trim(),
      url: BASE + el.querySelector("a")?.getAttribute("href"),
      poster: el.querySelector("img")?.getAttribute("data-src")
    }));
  },

  async details(url) {
    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    return {
      title: doc.querySelector(".film-name")?.textContent.trim(),
      description: doc.querySelector(".film-description")?.textContent.trim(),
      poster: doc.querySelector(".film-poster img")?.src
    };
  },

  async episodes(url) {
    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    return [...doc.querySelectorAll(".ep-item")].map(ep => ({
      number: ep.textContent.trim(),
      url: BASE + ep.getAttribute("href")
    }));
  },

  async stream(url) {
    // Use embed link to bypass Cloudflare
    const embedUrl = url.replace("/anime/", "/embed/");
    return [{ quality: "auto", url: embedUrl }];
  }
};
