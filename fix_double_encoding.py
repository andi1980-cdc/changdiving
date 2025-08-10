#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import urllib.parse

def fix_double_encoding(file_path):
    """Fix double URL-encoded redirects in the _redirects file."""
    
    print("🔧 Fixing double URL-encoded redirects...")
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count original lines
    original_lines = len(content.split('\n'))
    
    # Fix double encoding patterns
    # Replace %25 with % (double encoding fix)
    content = re.sub(r'%25', '%', content)
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Count fixed lines
    fixed_lines = len(content.split('\n'))
    
    print(f"✅ Fixed double URL-encoding in {file_path}")
    print(f"📊 Lines processed: {original_lines}")
    
    # Show some examples of what was fixed
    print("\n🔍 Examples of fixes:")
    print("Before: /de/tauchpl%25C3%25A4tze/")
    print("After:  /de/tauchpl%C3%A4tze/")
    print("Before: /%25E0%25B8%25A3%25E0%25B9%2589%25E0%25B8%25B2%25E0%25B8%2599%25E0%25B8%2584%25E0%25B9%2589%25E0%25B8%25B2/")
    print("After:  /%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2/")

if __name__ == "__main__":
    fix_double_encoding("_redirects")

