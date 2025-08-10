#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import urllib.parse
import os
from pathlib import Path

def fix_thai_links_in_html(file_path):
    """Fix Thai links in HTML files by properly URL-encoding them."""
    
    print(f"🔧 Processing: {file_path}")
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Find all href attributes that contain Thai characters
    # Pattern to match href="..." or href='...' containing Thai characters
    href_pattern = r'href=["\']([^"\']*[\u0E00-\u0E7F]+[^"\']*)["\']'
    
    def replace_thai_href(match):
        full_match = match.group(0)
        href_value = match.group(1)
        
        # Check if the href contains Thai characters
        if re.search(r'[\u0E00-\u0E7F]', href_value):
            # Split the URL into parts
            if href_value.startswith('http'):
                # For absolute URLs, encode the path part
                url_parts = href_value.split('/', 3)
                if len(url_parts) >= 4:
                    domain = '/'.join(url_parts[:3])
                    path = '/' + url_parts[3]
                    # URL encode the path
                    encoded_path = urllib.parse.quote(path, safe='')
                    new_href = domain + encoded_path
                    print(f"  🔄 Thai link found: {href_value}")
                    print(f"  ✅ Encoded to: {new_href}")
                    return full_match.replace(href_value, new_href)
            else:
                # For relative URLs, encode the entire path
                encoded_path = urllib.parse.quote(href_value, safe='')
                print(f"  🔄 Thai link found: {href_value}")
                print(f"  ✅ Encoded to: {encoded_path}")
                return full_match.replace(href_value, encoded_path)
        
        return full_match
    
    # Apply the replacement
    content = re.sub(href_pattern, replace_thai_href, content)
    
    # Also check for src attributes with Thai characters
    src_pattern = r'src=["\']([^"\']*[\u0E00-\u0E7F]+[^"\']*)["\']'
    
    def replace_thai_src(match):
        full_match = match.group(0)
        src_value = match.group(1)
        
        # Check if the src contains Thai characters
        if re.search(r'[\u0E00-\u0E7F]', src_value):
            # URL encode the path
            encoded_path = urllib.parse.quote(src_value, safe='')
            print(f"  🔄 Thai src found: {src_value}")
            print(f"  ✅ Encoded to: {encoded_path}")
            return full_match.replace(src_value, encoded_path)
        
        return full_match
    
    # Apply the replacement for src attributes
    content = re.sub(src_pattern, replace_thai_src, content)
    
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
    
    print("🚀 Starting Thai link fix process...")
    
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    print(f"📁 Found {len(html_files)} HTML files to process")
    
    fixed_count = 0
    for html_file in html_files:
        if fix_thai_links_in_html(html_file):
            fixed_count += 1
    
    print(f"\n🎉 Process completed!")
    print(f"📊 Files processed: {len(html_files)}")
    print(f"🔧 Files fixed: {fixed_count}")

if __name__ == "__main__":
    process_all_html_files()
