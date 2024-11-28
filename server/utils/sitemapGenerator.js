const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");
const path = require("path");

const generateSitemap = async () => {
  try {
    const sitemap = new SitemapStream({ hostname: "http://localhost:3000" });

    const staticRoutes = [
      { url: "/", changefreq: "weekly", priority: 1.0 },
      { url: "/about", changefreq: "weekly", priority: 0.8 },
      { url: "/contact-us", changefreq: "monthly", priority: 0.6 },
      { url: "/login", changefreq: "monthly", priority: 0.5 },
      { url: "/register", changefreq: "monthly", priority: 0.5 },
      { url: "/profile", changefreq: "daily", priority: 0.6 },
      { url: "/service-list", changefreq: "daily", priority: 0.8 },
      { url: "/create-service", changefreq: "weekly", priority: 0.8 },
    ];

    staticRoutes.forEach((route) => sitemap.write(route));
    sitemap.end();

    const xml = await streamToPromise(sitemap).then((data) => data.toString());
    const sitemapPath = path.join(__dirname, "../../client/public/sitemap.xml");

    fs.writeFileSync(sitemapPath, xml, "utf8");
    // console.log("Sitemap successfully generated and saved to sitemap.xml");
  } catch (err) {
    // console.error("Error generating sitemap", err);
  }
};

module.exports = generateSitemap;
