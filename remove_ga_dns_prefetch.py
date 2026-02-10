#!/usr/bin/env python3
"""
Remove Google Analytics DNS-Prefetch from all HTML files.
GA was completely removed, but the DNS-prefetch link is still present.
"""

import re
from pathlib import Path

def remove_ga_dns_prefetch(file_path):
    """Remove Google Analytics DNS-prefetch line."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Check if GA dns-prefetch exists
        if 'www.google-analytics.com' not in content:
            return False
        
        # Pattern: Remove the entire line with Google Analytics dns-prefetch
        pattern = re.compile(
            r'\s*<link\s+rel="dns-prefetch"\s+href="//www\.google-analytics\.com"\s*/>\s*\n',
            re.IGNORECASE | re.MULTILINE
        )
        
        content = pattern.sub('', content)
        
        # Write back if changed
        if content != original_content:
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
        if remove_ga_dns_prefetch(html_file):
            modified_count += 1
            print(f"✓ Removed GA dns-prefetch: {html_file.relative_to(project_root)}")
    
    print(f"\n{'='*60}")
    print(f"Google Analytics DNS-Prefetch Cleanup Complete!")
    print(f"{'='*60}")
    print(f"Files scanned: {total_count}")
    print(f"Files modified: {modified_count}")
    print(f"\n✅ Result:")
    print(f"  • Removed unnecessary DNS lookup to Google Analytics")
    print(f"  • Cleaner HTML, no dead prefetch links")
    print(f"  • Slight performance improvement (no wasted DNS query)")

if __name__ == '__main__':
    main()
