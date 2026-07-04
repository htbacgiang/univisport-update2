import { GetServerSideProps } from "next";

const baseUrl = "https://dongphucunivi.com";

const categories = [
  { slug: "dong-phuc-gym" },
  { slug: "dong-phuc-yoga-pilates" },
  { slug: "dong-phuc-pickleball" },
  { slug: "dong-phuc-ao-gio" },
  { slug: "dong-phuc-chay-bo" },
  { slug: "dong-phuc-golf-tennis" },
  { slug: "dong-phuc-mma" },
  { slug: "dong-phuc-ao-thun" },
];

function generate() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categories
    .map(
      (c) => `
  <url>
    <loc>${baseUrl}/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>`
    )
    .join("")}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=3600"
  );
  res.write(generate());
  res.end();

  return { props: {} };
};

export default function SitemapCategories() {
  return null;
}
