#!/usr/bin/env node

/**
 * Images Sitemap Generator for Chang Diving Center
 * Scans HTML files and extracts images, grouping them by page
 * Follows Google's Image Sitemap guidelines
 */

const fs = require("fs");
const path = require("path");

// Configuration
const config = {
  baseUrl: "https://changdiving.com",
  outputFile: "sitemap-images.xml",
  htmlExtensions: [".html"],
  excludePatterns: [
    "node_modules",
    ".git",
    "docs",
    "js",
    "fonts",
    "css",
    "_redirects.txt",
  ],
};

function shouldExclude(filePath) {
  return config.excludePatterns.some((pattern) => filePath.includes(pattern));
}

function isHtmlFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return config.htmlExtensions.includes(ext);
}

/**
 * Check if HTML file should be excluded from sitemap
 * Same logic as generate-sitemap.js
 */
function shouldExcludeHtmlFile(filePath, htmlContent) {
  // Check for noindex meta tag
  const noindexRegex =
    /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/i;
  if (noindexRegex.test(htmlContent)) {
    return true;
  }

  // Check for JavaScript redirects (but exclude mailto: links)
  const redirectRegex =
    /window\.location\.(replace|href)\s*=\s*["'](?!mailto:)(https?:|\.|\/)/i;
  if (redirectRegex.test(htmlContent)) {
    return true;
  }

  // Check for 404/410 pages (by path or title)
  if (filePath.includes("/404/") || filePath.includes("/410/")) {
    return true;
  }

  // Check for explicit 404 page title
  const title404Regex = /<title[^>]*>.*404.*<\/title>/i;
  if (title404Regex.test(htmlContent)) {
    return true;
  }

  // Exclude search pages
  if (filePath.includes("/search/")) {
    return true;
  }

  return false;
}

function extractImagesFromHtml(htmlContent, pageUrl) {
  const images = [];
  
  // Match all img tags
  const imgRegex = /<img[^>]+>/gi;
  const imgTags = htmlContent.match(imgRegex) || [];
  
  for (const imgTag of imgTags) {
    // Extract src attribute
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) continue;
    
    let imageSrc = srcMatch[1];
    
    // Skip external images, data URIs, and placeholders
    if (imageSrc.startsWith('http') || 
        imageSrc.startsWith('data:') || 
        imageSrc.startsWith('//')) {
      continue;
    }
    
    // Convert relative paths to absolute URLs
    if (imageSrc.startsWith('/')) {
      imageSrc = `${config.baseUrl}${imageSrc}`;
    } else {
      // Handle relative paths
      const pageDir = path.dirname(pageUrl.replace(config.baseUrl, ''));
      const absolutePath = path.join(pageDir, imageSrc).replace(/\\/g, '/');
      imageSrc = `${config.baseUrl}${absolutePath}`;
    }
    
    // Extract alt text for title
    const altMatch = imgTag.match(/alt=["']([^"']+)["']/i);
    const altText = altMatch ? altMatch[1] : '';
    
    // Extract title attribute if present
    const titleMatch = imgTag.match(/title=["']([^"']+)["']/i);
    const titleText = titleMatch ? titleMatch[1] : '';
    
    images.push({
      loc: imageSrc,
      title: titleText || altText || generateImageTitle(imageSrc),
      caption: altText || generateImageCaption(imageSrc),
    });
  }
  
  return images;
}

function scanForHtmlPages(dir, pages = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    if (shouldExclude(fullPath)) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanForHtmlPages(fullPath, pages);
    } else if (isHtmlFile(fullPath)) {
      // Convert file path to URL
      const relativePath = path.relative(".", fullPath);
      const urlPath = relativePath.replace(/\\/g, "/");
      let pageUrl = `${config.baseUrl}/${urlPath}`;
      
      // Clean up URL
      pageUrl = pageUrl.replace('/index.html', '/');
      
      // Read HTML content
      try {
        const htmlContent = fs.readFileSync(fullPath, 'utf-8');
        
        // Check if page should be excluded (noindex, redirects, 404, search)
        if (shouldExcludeHtmlFile(fullPath, htmlContent)) {
          continue;
        }
        
        const images = extractImagesFromHtml(htmlContent, pageUrl);
        
        // Only add pages that have images
        if (images.length > 0) {
          pages.push({
            url: pageUrl,
            images: images,
            lastmod: stat.mtime.toISOString().split("T")[0],
          });
        }
      } catch (error) {
        console.warn(`⚠️  Could not read ${fullPath}: ${error.message}`);
      }
    }
  }

  return pages;
}

function generateImagesSitemap(pages) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Sort pages by URL
  pages.sort((a, b) => a.url.localeCompare(b.url));

  for (const page of pages) {
    xml += `  <url>
    <loc>${escapeXml(page.url)}</loc>
    <lastmod>${page.lastmod}</lastmod>
`;
    
    // Add all images for this page
    for (const image of page.images) {
      xml += `    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
`;
      if (image.caption) {
        xml += `      <image:caption>${escapeXml(image.caption)}</image:caption>
`;
      }
      xml += `    </image:image>
`;
    }
    
    xml += `  </url>
`;
  }

  xml += "</urlset>";
  return xml;
}

function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateImageTitle(imageUrl) {
  // Extract meaningful title from URL
  const urlParts = imageUrl.split("/");
  const fileName = urlParts[urlParts.length - 1];
  const folder = urlParts[urlParts.length - 2];

  // Remove file extension and convert to readable format
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
  const readableName = nameWithoutExt
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Add context based on folder
  if (folder === "courses") {
    return `${readableName} - Scuba Diving Course`;
  } else if (folder === "dive-sites") {
    return `${readableName} - Dive Site`;
  } else if (folder === "posts") {
    return `${readableName} - Diving Blog`;
  } else if (folder === "home") {
    return `${readableName} - Chang Diving`;
  }

  return readableName;
}

function generateImageCaption(imageUrl) {
  // Generate descriptive caption based on image location
  const urlParts = imageUrl.split("/");
  const folder = urlParts[urlParts.length - 2];

  if (folder === "courses") {
    return "Scuba diving courses and training in Koh Chang";
  } else if (folder === "dive-sites") {
    return "Dive sites and marine life in Koh Chang";
  } else if (folder === "posts") {
    return "Diving guides and tips from Koh Chang";
  }

  return "Chang Diving Center - Koh Chang, Thailand";
}

function generateStats(pages) {
  let totalImages = 0;
  const imageFormats = {};
  
  for (const page of pages) {
    totalImages += page.images.length;
    
    for (const image of page.images) {
      const ext = path.extname(image.loc).toLowerCase();
      imageFormats[ext] = (imageFormats[ext] || 0) + 1;
    }
  }
  
  return {
    totalPages: pages.length,
    totalImages: totalImages,
    avgImagesPerPage: (totalImages / pages.length).toFixed(2),
    imageFormats: imageFormats,
  };
}

// Main execution
console.log("🖼️  Chang Diving Center Images Sitemap Generator");
console.log("===============================================");

try {
  console.log("📁 Scanning HTML files for images...");
  const pages = scanForHtmlPages(".");

  console.log("\n📊 Statistics:");
  const stats = generateStats(pages);
  console.log(`   Pages with images: ${stats.totalPages}`);
  console.log(`   Total images: ${stats.totalImages}`);
  console.log(`   Average images per page: ${stats.avgImagesPerPage}`);
  
  console.log("\n📷 Image formats:");
  for (const [ext, count] of Object.entries(stats.imageFormats)) {
    console.log(`   ${ext}: ${count} images`);
  }

  console.log("\n📝 Generating images sitemap...");
  const sitemapXml = generateImagesSitemap(pages);

  fs.writeFileSync(config.outputFile, sitemapXml);
  console.log(`✅ Images sitemap generated: ${config.outputFile}`);

  // Show file size
  const fileStats = fs.statSync(config.outputFile);
  const fileSize = (fileStats.size / 1024).toFixed(2);
  console.log(`📊 File size: ${fileSize} KB`);

  console.log("\n✨ Features:");
  console.log("   • Images grouped by HTML page (Google best practice)");
  console.log("   • Includes image titles and captions from alt text");
  console.log("   • Proper XML escaping for special characters");
  console.log("   • Follows Google Image Sitemap guidelines");
  
  console.log("\n📌 Next steps:");
  console.log("   1. Test sitemap: https://www.xml-sitemaps.com/validate-xml-sitemap.html");
  console.log("   2. Submit to Google Search Console");
  console.log("   3. Check robots.txt includes sitemap-images.xml");
  
} catch (error) {
  console.error("❌ Error generating images sitemap:", error);
  process.exit(1);
}
