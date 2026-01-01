#!/usr/bin/env node

/**
 * Automatic Sitemap Index Generator for Chang Diving Center
 * Generates the sitemap-index.xml with current dates
 */

const fs = require("fs");
const path = require("path");

// Configuration
const config = {
  baseUrl: "https://changdiving.com",
  indexFile: "sitemap-index.xml",
  sitemaps: [
    {
      filename: "sitemap.xml",
      url: "https://changdiving.com/sitemap.xml",
    },
    {
      filename: "sitemap-images.xml",
      url: "https://changdiving.com/sitemap-images.xml",
    },
  ],
};

function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

function getSitemapLastMod(filename) {
  try {
    if (fs.existsSync(filename)) {
      const stats = fs.statSync(filename);
      return stats.mtime.toISOString().split("T")[0];
    }
  } catch (error) {
    console.warn(
      `⚠️  Could not get modification date for ${filename}, using current date`,
    );
  }
  return getCurrentDate();
}

function generateSitemapIndex() {
  const currentDate = getCurrentDate();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const sitemap of config.sitemaps) {
    const lastmod = getSitemapLastMod(sitemap.filename);
    xml += `  <sitemap>
    <loc>${sitemap.url}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
`;
  }

  xml += "</sitemapindex>";
  return xml;
}

// Main execution
console.log("🗂️  Chang Diving Center - Sitemap Index Generator");
console.log("==================================================");

try {
  console.log("📋 Generating sitemap index...");

  // Check if referenced sitemaps exist
  for (const sitemap of config.sitemaps) {
    if (fs.existsSync(sitemap.filename)) {
      const stats = fs.statSync(sitemap.filename);
      const lastmod = stats.mtime.toISOString().split("T")[0];
      console.log(`   ✅ ${sitemap.filename} - Last modified: ${lastmod}`);
    } else {
      console.log(
        `   ⚠️  ${sitemap.filename} - File not found, will use current date`,
      );
    }
  }

  const indexXml = generateSitemapIndex();

  fs.writeFileSync(config.indexFile, indexXml);
  console.log(`✅ Sitemap index generated: ${config.indexFile}`);

  // Show file info
  const stats = fs.statSync(config.indexFile);
  const fileSize = (stats.size / 1024).toFixed(2);
  console.log(`📊 File size: ${fileSize} KB`);
  console.log(`🌐 Base URL: ${config.baseUrl}`);
  console.log(`📄 Sitemaps included: ${config.sitemaps.length}`);
} catch (error) {
  console.error("❌ Error generating sitemap index:", error);
  process.exit(1);
}
