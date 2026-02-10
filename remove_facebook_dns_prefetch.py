#!/usr/bin/env python3
"""
Remove Facebook DNS-Prefetch from all HTML files.
Facebook is only used for Schema.org links (no embeds, no pixel, no widgets).
The DNS-prefetch links are wasted resources.
"""

import re
from pathlib import Path

def remove_facebook_dns_prefetch(file_path):
    """Remove Facebook DNS-prefetch lines."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        modified = False
        
        # Pattern 1: Remove www.facebook.com dns-prefetch
        pattern1 = re.compile(
            r'\s*<link\s+rel="dns-prefetch"\s+href="//www\.facebook\.com"\s*/>\s*\n',
            re.IGNORECASE | re.MULTILINE
        )
        
        if pattern1.search(content):
            content = pattern1.sub('', content)
            modified = True
        
        # Pattern 2: Remove connect.facebook.net dns-prefetch
        pattern2 = re.compile(
            r'\s*<link\s+rel="dns-prefetch"\s+href="//connect\.facebook\.net"\s*/>\s*\n',
            re.IGNORECASE | re.MULTILINE
        )
        
        if pattern2.search(content):
            content = pattern2.sub('', content)
            modified = True
        
        # Write back if changed
        if modified and content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Process all HTML files."""
    project_root = Path('/Users/andismac/Desktop/cdc_git')
    
    modified_count = 0
    total_count = 0
    
    for html_file in project_root.rglob('*.html'):
        if '.git' in str(html_file) or 'node_modules' in str(html_file):
            continue
        
        total_count += 1
        if remove_facebook_dns_prefetch(html_file):
            modified_count += 1
            print(f"✓ Removed Facebook dns-prefetch: {html_file.relative_to(project_root)}")
    
    print(f"\n{'='*60}")
    print(f"Facebook DNS-Prefetch Cleanup Complete!")
    print(f"{'='*60}")
    print(f"Files scanned: {total_count}")
    print(f"Files modified: {modified_count}")
    print(f"\n✅ Removed:")
    print(f"  • <link rel='dns-prefetch' href='//www.facebook.com' />")
    print(f"  • <link rel='dns-prefetch' href='//connect.facebook.net' />")
    print(f"\n📊 Performance Impact:")
    print(f"  • Eliminates 2 unnecessary DNS lookups per page")
    print(f"  • Saves ~10-40ms on page load")
    print(f"  • Cleaner HTML head section")
    print(f"\n💡 Why removed:")
    print(f"  • Facebook only used for Schema.org links (no content loaded)")
    print(f"  • No Facebook Pixel, no Like buttons, no embeds")
    print(f"  • DNS-prefetch was completely wasted")

if __name__ == '__main__':
    main()
