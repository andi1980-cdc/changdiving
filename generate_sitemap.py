#!/usr/bin/env python3
"""
Generate sitemap.xml with accurate lastmod dates from Git history.
This script reads the last commit date for each HTML file and generates
a sitemap with accurate modification dates.

Excludes: 404/410 error pages, /search/ utility pages (SEO: do not index).
Keeps: search-recovery, about-search-recovery (content pages).

Usage:
    python3 generate_sitemap.py
"""

import os
import subprocess
from datetime import datetime
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Base URL
BASE_URL = "https://changdiving.com"

# Directories to scan for HTML files
INCLUDE_DIRS = ["en", "de", "th"]

# Files/directories to exclude
EXCLUDE_PATTERNS = [
    ".git",
    "node_modules",
    ".cursor",
    "terminals",
    "docs",
    "fonts",
    "img",
    "js",
    "css",
    "/404/",   # Error pages - do not index (SEO)
    "/410/",   # Gone pages - do not index (SEO)
    "/search/",  # Search utility pages - noindex (not /search-recovery/)
]

# Priority and changefreq rules
PRIORITY_RULES = {
    "index.html": {"priority": "1.0", "changefreq": "weekly"},
    "/en/": {"priority": "1.0", "changefreq": "weekly"},
    "/de/": {"priority": "1.0", "changefreq": "weekly"},
    "/th/": {"priority": "1.0", "changefreq": "weekly"},
    "/courses/": {"priority": "0.9", "changefreq": "monthly"},
    "/day-trips/": {"priority": "0.9", "changefreq": "monthly"},
    "/dive-sites/": {"priority": "0.8", "changefreq": "monthly"},
    "/posts/": {"priority": "0.7", "changefreq": "monthly"},
}


def get_git_last_modified(file_path):
    """
    Get the last modification date of a file from Git history.
    Returns ISO date string (YYYY-MM-DD).
    """
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cI", "--", file_path],
            capture_output=True,
            text=True,
            check=True,
        )
        date_str = result.stdout.strip()
        if date_str:
            # Parse ISO date and return YYYY-MM-DD
            dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            return dt.strftime("%Y-%m-%d")
    except (subprocess.CalledProcessError, ValueError) as e:
        print(f"Warning: Could not get Git date for {file_path}: {e}")
    
    # Fallback to file system modification time
    try:
        mtime = os.path.getmtime(file_path)
        return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
    except:
        return datetime.now().strftime("%Y-%m-%d")


def get_priority_and_changefreq(url_path):
    """
    Determine priority and changefreq based on URL path.
    """
    for pattern, rules in PRIORITY_RULES.items():
        if pattern in url_path:
            return rules
    
    # Default values
    return {"priority": "0.6", "changefreq": "monthly"}


def should_exclude(path):
    """
    Check if a path should be excluded.
    """
    path_str = str(path).replace("\\", "/")
    for pattern in EXCLUDE_PATTERNS:
        if pattern in path_str:
            return True
    return False


def find_html_files():
    """
    Find all HTML files in the repository.
    Returns a list of (file_path, url_path) tuples.
    """
    html_files = []
    
    # Add main index.html
    if os.path.exists("index.html"):
        html_files.append(("index.html", "/"))
    
    # Scan language directories
    for lang_dir in INCLUDE_DIRS:
        if not os.path.exists(lang_dir):
            continue
        
        for root, dirs, files in os.walk(lang_dir):
            # Remove excluded directories from search
            dirs[:] = [d for d in dirs if not should_exclude(os.path.join(root, d))]
            
            for file in files:
                if file.endswith(".html"):
                    file_path = os.path.join(root, file)
                    
                    # Skip if excluded
                    if should_exclude(file_path):
                        continue
                    
                    # Convert file path to URL path
                    url_path = "/" + file_path.replace("\\", "/")
                    if file == "index.html":
                        url_path = url_path.replace("/index.html", "/")
                    
                    html_files.append((file_path, url_path))
    
    return html_files


def generate_sitemap():
    """
    Generate sitemap.xml with accurate Git modification dates.
    """
    print("🔍 Finding HTML files...")
    html_files = find_html_files()
    print(f"   Found {len(html_files)} HTML files")
    
    print("\n📅 Getting Git modification dates...")
    
    # Create XML structure
    urlset = ET.Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Add URLs
    for file_path, url_path in sorted(html_files, key=lambda x: x[1]):
        # Get last modified date from Git
        lastmod = get_git_last_modified(file_path)
        
        # Get priority and changefreq
        rules = get_priority_and_changefreq(url_path)
        
        # Create URL element
        url = ET.SubElement(urlset, "url")
        
        loc = ET.SubElement(url, "loc")
        loc.text = BASE_URL + url_path
        
        lastmod_elem = ET.SubElement(url, "lastmod")
        lastmod_elem.text = lastmod
        
        changefreq = ET.SubElement(url, "changefreq")
        changefreq.text = rules["changefreq"]
        
        priority = ET.SubElement(url, "priority")
        priority.text = rules["priority"]
        
        print(f"   ✓ {url_path:<50} {lastmod}")
    
    # Pretty print XML
    xml_string = ET.tostring(urlset, encoding="unicode")
    dom = minidom.parseString(xml_string)
    pretty_xml = dom.toprettyxml(indent="  ")
    
    # Remove extra blank lines
    pretty_xml = "\n".join([line for line in pretty_xml.split("\n") if line.strip()])
    
    # Write to file
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(pretty_xml)
    
    print(f"\n✅ Generated sitemap.xml with {len(html_files)} URLs")
    print(f"   File: {os.path.abspath('sitemap.xml')}")


def main():
    """
    Main function.
    """
    print("=" * 70)
    print("🗺️  SITEMAP GENERATOR WITH GIT DATES")
    print("=" * 70)
    
    # Check if we're in a git repository
    if not os.path.exists(".git"):
        print("❌ Error: Not in a Git repository!")
        return 1
    
    try:
        generate_sitemap()
        print("\n✨ Done!")
        return 0
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())
