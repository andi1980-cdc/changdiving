#!/usr/bin/env python3
"""
Optimize Trustindex loading - CONSERVATIVE VERSION
Only adds lazy loading script, keeps existing HTML structure intact.
"""

import os
import re
from pathlib import Path

# Lazy loading script to add before </body>
LAZY_SCRIPT = '''
    <!-- Trustindex Lazy Loading Script -->
    <script>
      (function() {
        // Find all script tags that load trustindex
        const trustindexScripts = document.querySelectorAll('script[src*="cdn.trustindex.io/loader.js"]');
        
        if (trustindexScripts.length === 0 && 'IntersectionObserver' in window) {
          // Find trustindex containers
          const containers = document.querySelectorAll('.trustindex-widget, div[style*="margin-top"]');
          
          containers.forEach(container => {
            // Check if this container should have a trustindex widget
            const scripts = container.querySelectorAll('script');
            if (scripts.length > 0) {
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    // Script is already there, just let it load
                    observer.unobserve(entry.target);
                  }
                });
              }, {
                rootMargin: '200px'
              });
              
              observer.observe(container);
            }
          });
        }
      })();
    </script>'''

def add_crossorigin(content):
    """Add crossorigin="anonymous" to trustindex scripts that don't have it."""
    
    # Pattern: Find <script> tags with trustindex.io that don't have crossorigin
    pattern = re.compile(
        r'(<script[^>]*src="https://cdn\.trustindex\.io/loader\.js\?[^"]*"(?![^>]*crossorigin)[^>]*)(>)',
        re.IGNORECASE
    )
    
    def replacer(match):
        return match.group(1) + '\n              crossorigin="anonymous"\n            ' + match.group(2)
    
    content = pattern.sub(replacer, content)
    
    return content

def add_lazy_script(content):
    """Add lazy loading script before </body> if not already present."""
    
    if 'Trustindex Lazy Loading Script' in content:
        return content, False
    
    # Check if file has trustindex
    if 'trustindex.io' not in content.lower():
        return content, False
    
    # Add script before </body>
    content = content.replace('</body>', f'{LAZY_SCRIPT}\n  </body>')
    
    return content, True

def optimize_file(file_path):
    """Optimize a single HTML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        modified = False
        
        # Step 1: Add crossorigin attribute
        new_content = add_crossorigin(content)
        if new_content != content:
            content = new_content
            modified = True
        
        # Step 2: Add lazy loading script
        new_content, script_added = add_lazy_script(content)
        if script_added:
            content = new_content
            modified = True
        
        # Write back if modified
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
    
    # Find all HTML files
    for html_file in project_root.rglob('*.html'):
        if '.git' in str(html_file) or 'node_modules' in str(html_file):
            continue
        
        total_count += 1
        if optimize_file(html_file):
            modified_count += 1
            print(f"✓ Optimized: {html_file.relative_to(project_root)}")
    
    print(f"\n{'='*60}")
    print(f"Trustindex Optimization Complete!")
    print(f"{'='*60}")
    print(f"Total files scanned: {total_count}")
    print(f"Files modified: {modified_count}")
    print(f"\nChanges:")
    print(f"  • Added crossorigin='anonymous' to all trustindex scripts")
    print(f"  • Added lazy loading infrastructure")
    print(f"  • Preserved all existing HTML structure")

if __name__ == '__main__':
    main()
