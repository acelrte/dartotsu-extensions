const BASE = "https://hianime.to"

async function request(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Referer": BASE
    }
  })
  return await res.text()
}

function parse(html) {
  return new DOMParser().parseFromString(html, "text/html")
}

export default {

  name: "Hianime",

  async search(query) {
    const html = await request(`${BASE}/search?keyword=${encodeURIComponent(query)}`)
    const doc = parse(html)

    return [...doc.querySelectorAll(".flw-item")].map(el => ({
      title: el.querySelector(".film-name")?.textContent.trim(),
      url: BASE + el.querySelector("a")?.getAttribute("href"),
      poster: el.querySelector("img")?.getAttribute("data-src")
    }))
  },

  async details(url) {
    const html = await request(url)
    const doc = parse(html)

    return {
      title: doc.querySelector(".film-name")?.textContent.trim(),
      description: doc.querySelector(".film-description")?.textContent.trim(),
      poster: doc.querySelector(".film-poster img")?.src
    }
  },

  async episodes(url) {
    const html = await request(url)
    const doc = parse(html)

    return [...doc.querySelectorAll(".ep-item")].map(ep => ({
      number: ep.textContent.trim(),
      url: BASE + ep.getAttribute("href")
    }))
  },

  async stream(url) {
    const html = await request(url)
    const doc = parse(html)

    const iframe = doc.querySelector("iframe")?.src

    return [{
      quality: "auto",
      url: iframe
    }]
  }

}
