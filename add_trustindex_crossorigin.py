#!/usr/bin/env python3
"""
Simple Trustindex optimization:
- Add crossorigin="anonymous" to all trustindex script tags
- This is a minimal, safe change that won't break HTML structure
"""

import re
from pathlib import Path

def add_crossorigin_to_trustindex(file_path):
    """Add crossorigin attribute to trustindex scripts."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern 1: <script ... src="...trustindex..." ... > (without crossorigin)
        # We need to handle both async/defer and without
        pattern = re.compile(
            r'(<script\s+[^>]*src="https://cdn\.trustindex\.io/loader\.js\?[^"]*"(?![^>]*crossorigin)[^>]*)(>)',
            re.IGNORECASE | re.MULTILINE
        )
        
        def add_attr(match):
            script_tag = match.group(1)
            closing = match.group(2)
            
            # Add crossorigin before the closing >
            return script_tag + '\n              crossorigin="anonymous"\n            ' + closing
        
        content = pattern.sub(add_attr, content)
        
        # Write back if modified
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
    
    # Find all HTML files
    for html_file in project_root.rglob('*.html'):
        if '.git' in str(html_file) or 'node_modules' in str(html_file):
            continue
        
        total_count += 1
        if add_crossorigin_to_trustindex(html_file):
            modified_count += 1
            print(f"✓ Added crossorigin: {html_file.relative_to(project_root)}")
    
    print(f"\n{'='*60}")
    print(f"Trustindex crossorigin Optimization Complete!")
    print(f"{'='*60}")
    print(f"Total files scanned: {total_count}")
    print(f"Files modified: {modified_count}")
    print(f"\nChange:")
    print(f"  • Added crossorigin='anonymous' to all trustindex scripts")
    print(f"  • This improves CORS handling and security")

if __name__ == '__main__':
    main()
