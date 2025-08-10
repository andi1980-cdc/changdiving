#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import os

def fix_thai_urls_in_html(file_path):
    """Replace old Thai URLs with correct English URLs."""
    
    print(f"🔧 Processing: {file_path}")
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Define URL mappings from old Thai URLs to new English URLs
    url_mappings = {
        # Old Thai URLs that should be replaced with English URLs
        r'href="/th/product/เรียนนักดำน้ำด้านเทคนิ-2/"': 'href="/th/product/intro-to-tech/"',
        r'href="/th/product/เรียนนักดำน้ำด้านเทคนิ/"': 'href="/th/product/intro-to-tech/"',
        
        # Any other Thai URLs that might exist - replace with appropriate English equivalents
        r'href="/th/product/[\u0E00-\u0E7F]+/"': 'href="/th/product/intro-to-tech/"',  # Generic fallback
    }
    
    # Apply replacements
    for old_pattern, new_url in url_mappings.items():
        if re.search(old_pattern, content):
            content = re.sub(old_pattern, new_url, content)
            print(f"  🔄 Replaced Thai URL with: {new_url}")
    
    # Also check for any remaining Thai characters in URLs and replace them
    # This is a more aggressive approach to catch any remaining Thai URLs
    thai_url_pattern = r'href=["\']([^"\']*[\u0E00-\u0E7F]+[^"\']*)["\']'
    
    def replace_thai_url(match):
        full_match = match.group(0)
        href_value = match.group(1)
        
        # If it's a Thai URL, replace with a default English URL
        if re.search(r'[\u0E00-\u0E7F]', href_value):
            # Extract the base path and replace with English equivalent
            if '/th/product/' in href_value:
                # Replace with a safe default
                new_href = href_value.replace(href_value.split('/th/product/')[1], 'intro-to-tech/')
                print(f"  🔄 Thai URL found: {href_value}")
                print(f"  ✅ Replaced with: {new_href}")
                return full_match.replace(href_value, new_href)
        
        return full_match
    
    # Apply the replacement
    content = re.sub(thai_url_pattern, replace_thai_url, content)
    
    # Write back to file if changes were made
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ File updated: {file_path}")
        return True
    else:
        print(f"  ℹ️  No changes needed: {file_path}")
        return False

def process_all_html_files(directory="."):
    """Process all HTML files in the directory and subdirectories."""
    
    print("🚀 Starting Thai URL fix process...")
    
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    print(f"📁 Found {len(html_files)} HTML files to process")
    
    fixed_count = 0
    for html_file in html_files:
        if fix_thai_urls_in_html(html_file):
            fixed_count += 1
    
    print(f"\n🎉 Process completed!")
    print(f"📊 Files processed: {len(html_files)}")
    print(f"🔧 Files fixed: {fixed_count}")

if __name__ == "__main__":
    process_all_html_files()
