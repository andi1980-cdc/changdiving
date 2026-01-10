#!/usr/bin/env node

/**
 * Automatic Sitemap Generator for Chang Diving Center
 * Scans all HTML files and generates XML sitemap with proper URLs
 * Excludes noindex pages and redirect pages
 */

const fs = require("fs");
const path = require("path");

// Configuration
const config = {
  baseUrl: "https://changdiving.com",
  languages: ["en", "de", "th"],
  outputFile: "sitemap.xml",
  excludePatterns: [
    "node_modules",
    ".git",
    "docs",
    "img",
    "js",
    "fonts",
    "style.css",
    "robots.txt",
    "_redirects.txt",
  ],
};

// Priority mapping for different page types
const priorityMap = {
  "index.html": 1.0, // Homepage
  about: 0.8, // About pages
  courses: 0.9, // Course pages
  "day-trips": 0.8, // Day trip pages
  equipment: 0.7, // Equipment pages
  "dive-sites": 0.7, // Dive sites
  posts: 0.6, // Blog posts
  faqs: 0.5, // FAQ pages
  contact: 0.7, // Contact
  prices: 0.8, // Pricing
  default: 0.5, // Everything else
};

// Change frequency for different page types
const changefreqMap = {
  "index.html": "weekly",
  about: "monthly",
  courses: "monthly",
  "day-trips": "monthly",
  equipment: "monthly",
  "dive-sites": "monthly",
  posts: "weekly",
  faqs: "monthly",
  contact: "monthly",
  prices: "weekly",
  default: "monthly",
};

function shouldExclude(filePath) {
  return config.excludePatterns.some((pattern) => filePath.includes(pattern));
}

function getPriority(urlPath) {
  // Homepage-Check zuerst - höchste Priorität
  if (urlPath === "" || urlPath === "/" || urlPath.endsWith("/index.html")) {
    return 1.0;
  }

  // Language homepage check
  if (urlPath.match(/^\/(en|de|th)\/$/)) {
    return 1.0;
  }

  // Dann andere Checks...
  for (const [key, priority] of Object.entries(priorityMap)) {
    if (key === "default") continue;
    if (urlPath.includes(key)) {
      return priority;
    }
  }
  return priorityMap.default;
}

function getChangeFreq(urlPath) {
  // Homepage-Check zuerst - häufiger Updates
  if (urlPath === "" || urlPath === "/" || urlPath.endsWith("/index.html")) {
    return "weekly";
  }

  // Language homepage check
  if (urlPath.match(/^\/(en|de|th)\/$/)) {
    return "weekly";
  }

  // Dann andere Checks...
  for (const [key, freq] of Object.entries(changefreqMap)) {
    if (key === "default") continue;
    if (urlPath.includes(key)) {
      return freq;
    }
  }
  return changefreqMap.default;
}

/**
 * Check if HTML file should be excluded from sitemap
 * @param {string} filePath - Path to the HTML file
 * @returns {boolean} - True if should be excluded
 */
function shouldExcludeHtmlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Check for noindex meta tag
    const noindexRegex =
      /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/i;
    if (noindexRegex.test(content)) {
      console.log(`  ⚠️  Excluding (noindex): ${filePath}`);
      return true;
    }

    // Check for JavaScript redirects (but exclude mailto: links)
    const redirectRegex =
      /window\.location\.(replace|href)\s*=\s*["'](?!mailto:)(https?:|\.|\/)/i;
    if (redirectRegex.test(content)) {
      console.log(`  🔄 Excluding (redirect): ${filePath}`);
      return true;
    }
    // Also check for location.replace with http/https (but not mailto)
    const locationReplaceRegex =
      /location\.replace\s*\(\s*["'](?!mailto:)(https?:|\.|\/)/i;
    if (locationReplaceRegex.test(content)) {
      console.log(`  🔄 Excluding (redirect): ${filePath}`);
      return true;
    }

    // Check for 404 pages (by path or title)
    // Only exclude if it's actually in a 404 directory or has explicit 404 title
    if (filePath.includes("/404/") || filePath.includes("/410/")) {
      console.log(`  🚫 Excluding (404/410 page): ${filePath}`);
      return true;
    }
    
    // Check for explicit 404 page title (not just "not found" text in content)
    const title404Regex = /<title[^>]*>.*404.*<\/title>/i;
    if (title404Regex.test(content)) {
      console.log(`  🚫 Excluding (404 in title): ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.log(`  ❌ Error reading ${filePath}: ${error.message}`);
    return true; // Exclude if we can't read it
  }
}

function scanDirectory(dir, urls = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (shouldExclude(filePath)) {
      continue;
    }

    if (stat.isDirectory()) {
      scanDirectory(filePath, urls);
    } else if (file === "index.html") {
      // Check if this HTML file should be excluded
      if (shouldExcludeHtmlFile(filePath)) {
        continue;
      }

      // Convert file path to URL
      let urlPath = filePath.replace(/\\/g, "/");

      // Remove index.html from path
      urlPath = urlPath.replace("/index.html", "");

      // Add leading slash if not present
      if (!urlPath.startsWith("/")) {
        urlPath = "/" + urlPath;
      }

      // Handle root index.html and language homepages
      if (urlPath === "/") {
        urlPath = "";
      } else {
        // Add trailing slash for consistency with actual website URLs
        if (!urlPath.endsWith("/")) {
          urlPath += "/";
        }
      }

      // Special handling for language homepages
      const langHomepageMatch = urlPath.match(/^\/(en|de|th)\/$/);
      if (langHomepageMatch) {
        // This is a language homepage - should have highest priority
        urlPath = "/" + langHomepageMatch[1] + "/";
      }

      const fullUrl = config.baseUrl + urlPath;
      const priority = getPriority(urlPath);
      const changefreq = getChangeFreq(urlPath);

      // Always use file modification time for accurate lastmod dates
      const lastmod = stat.mtime.toISOString().split("T")[0];

      urls.push({
        url: fullUrl,
        lastmod,
        changefreq,
        priority,
      });

      // Debug output for homepages
      if (urlPath.match(/^\/(en|de|th)\/$/)) {
        console.log(`  🏠 Homepage: ${fullUrl} - Lastmod: ${lastmod}`);
      }
    }
  }

  return urls;
}

function generateSitemap(urls) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Sort URLs by priority (highest first), then alphabetically
  urls.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return a.url.localeCompare(b.url);
  });

  for (const urlData of urls) {
    xml += `  <url>
    <loc>${urlData.url}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>${urlData.changefreq}</changefreq>
    <priority>${urlData.priority}</priority>
  </url>
`;
  }

  xml += "</urlset>";
  return xml;
}

function generateLanguageStats(urls) {
  const stats = {};

  for (const lang of config.languages) {
    stats[lang] = urls.filter((u) => u.url.includes(`/${lang}/`)).length;
  }

  // Count homepage and language-neutral pages
  stats["homepage"] = urls.filter((u) => u.url === config.baseUrl).length;
  stats["total"] = urls.length;

  return stats;
}

// Main execution
console.log("🗺️  Chang Diving Center Sitemap Generator (Enhanced)");
console.log("==================================================");

try {
  console.log("📁 Scanning directories for HTML files...");
  console.log("🔍 Checking for noindex and redirect pages...");
  const urls = scanDirectory(".");

  console.log("\n📊 Statistics:");
  const stats = generateLanguageStats(urls);

  for (const [lang, count] of Object.entries(stats)) {
    console.log(`   ${lang.toUpperCase()}: ${count} pages`);
  }

  console.log("\n🏆 Top priority pages:");
  const topPages = urls
    .filter((u) => u.priority >= 0.8)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10);

  topPages.forEach((page) => {
    console.log(`   ${page.priority} - ${page.url}`);
  });

  console.log("\n📝 Generating XML sitemap...");
  const sitemapXml = generateSitemap(urls);

  fs.writeFileSync(config.outputFile, sitemapXml);
  console.log(`✅ Sitemap generated: ${config.outputFile}`);
  console.log(`🌐 Total URLs: ${urls.length}`);
  console.log(`📍 Base URL: ${config.baseUrl}`);

  // Show file size
  const stats_file = fs.statSync(config.outputFile);
  const fileSize = (stats_file.size / 1024).toFixed(2);
  console.log(`📊 File size: ${fileSize} KB`);

  console.log("\n✨ Enhanced features:");
  console.log("   • Excluded noindex pages");
  console.log("   • Excluded redirect pages");
  console.log("   • Excluded 404 pages");
} catch (error) {
  console.error("❌ Error generating sitemap:", error);
  process.exit(1);
}
