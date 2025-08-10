#!/usr/bin/env node

/**
 * Images Sitemap Generator for Chang Diving Center
 * Scans all image files and generates XML sitemap for images
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'https://changdiving.com',
  outputFile: 'sitemap-images.xml',
  imageExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  excludePatterns: [
    'node_modules',
    '.git',
    'docs',
    'js',
    'fonts',
    'style.css',
    'robots.txt',
    '_redirects.txt'
  ]
};

function shouldExclude(filePath) {
  return config.excludePatterns.some(pattern => 
    filePath.includes(pattern)
  );
}

function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return config.imageExtensions.includes(ext);
}

function scanForImages(dir, images = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (shouldExclude(fullPath)) {
      continue;
    }
    
    if (stat.isDirectory()) {
      scanForImages(fullPath, images);
    } else if (isImageFile(fullPath)) {
      // Convert file path to URL
      const relativePath = path.relative('.', fullPath);
      const urlPath = relativePath.replace(/\\/g, '/');
      const imageUrl = `${config.baseUrl}/${urlPath}`;
      
      // Get file stats for lastmod
      const stats = fs.statSync(fullPath);
      const lastmod = stats.mtime.toISOString().split('T')[0];
      
      images.push({
        url: imageUrl,
        lastmod
      });
    }
  }
  
  return images;
}

function generateImagesSitemap(images) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Sort images by URL
  images.sort((a, b) => a.url.localeCompare(b.url));

  for (const imageData of images) {
    xml += `  <url>
    <loc>${imageData.url}</loc>
    <lastmod>${imageData.lastmod}</lastmod>
    <image:image>
      <image:loc>${imageData.url}</image:loc>
    </image:image>
  </url>
`;
  }

  xml += '</urlset>';
  return xml;
}

function generateImageStats(images) {
  const stats = {
    total: images.length,
    byExtension: {}
  };
  
  for (const image of images) {
    const ext = path.extname(image.url).toLowerCase();
    stats.byExtension[ext] = (stats.byExtension[ext] || 0) + 1;
  }
  
  return stats;
}

// Main execution
console.log('🖼️  Chang Diving Center Images Sitemap Generator');
console.log('===============================================');

try {
  console.log('📁 Scanning directories for image files...');
  const images = scanForImages('.');
  
  console.log('\n📊 Image Statistics:');
  const stats = generateImageStats(images);
  console.log(`   Total images: ${stats.total}`);
  
  for (const [ext, count] of Object.entries(stats.byExtension)) {
    console.log(`   ${ext}: ${count} images`);
  }
  
  console.log('\n📝 Generating images sitemap...');
  const sitemapXml = generateImagesSitemap(images);
  
  fs.writeFileSync(config.outputFile, sitemapXml);
  console.log(`✅ Images sitemap generated: ${config.outputFile}`);
  console.log(`🖼️  Total images: ${images.length}`);
  console.log(`📍 Base URL: ${config.baseUrl}`);
  
  // Show file size
  const stats_file = fs.statSync(config.outputFile);
  const fileSize = (stats_file.size / 1024).toFixed(2);
  console.log(`📊 File size: ${fileSize} KB`);
  
  console.log('\n✨ Features:');
  console.log('   • Includes all image formats (jpg, jpeg, png, webp, gif)');
  console.log('   • Proper XML namespace for images');
  console.log('   • Last modified dates from file system');
  
} catch (error) {
  console.error('❌ Error generating images sitemap:', error);
  process.exit(1);
}
