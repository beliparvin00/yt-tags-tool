// api/extract.js
export default async function handler(req, res) {
  const videoUrl = req.query.url;
  if (!videoUrl || !videoUrl.includes("youtube.com/watch")) {
    return res.status(400).json({ error: "Provide a valid YouTube video URL" });
  }

  try {
    const response = await fetch(videoUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const html = await response.text();

    // Extract meta keywords
    const metaMatch = html.match(/<meta name="keywords" content="([^"]+)"/);
    let tags = [];
    if (metaMatch && metaMatch[1]) {
      tags = metaMatch[1].split(",").map(t => t.trim());
    }

    // Backup: JSON keywords
    if (tags.length === 0) {
      const jsonMatch = html.match(/"keywords":\[(.*?)\]/);
      if (jsonMatch && jsonMatch[1]) {
        tags = jsonMatch[1].split(",").map(t => t.replace(/"/g, "").trim());
      }
    }

    return res.json({ tags });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
