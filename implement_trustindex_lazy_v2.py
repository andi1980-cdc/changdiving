#!/usr/bin/env python3
"""
Implement TRUE lazy loading for Trustindex widgets.
Strategy:
1. Change script src="..." to data-src="..." (prevents immediate loading)
2. Add Intersection Observer that restores src when visible
"""

import re
from pathlib import Path

# Lazy loading script
LAZY_SCRIPT = '''
    <!-- Trustindex Lazy Loading -->
    <script>
      (function() {
        'use strict';
        
        if (!('IntersectionObserver' in window)) {
          // Fallback: Load immediately on old browsers
          document.querySelectorAll('script[data-src*="trustindex.io"]').forEach(function(script) {
            script.src = script.getAttribute('data-src');
            script.removeAttribute('data-src');
          });
          return;
        }
        
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const container = entry.target;
              const script = container.querySelector('script[data-src*="trustindex.io"]');
              
              if (script) {
                // Restore src attribute to trigger loading
                script.src = script.getAttribute('data-src');
                script.removeAttribute('data-src');
              }
              
              observer.unobserve(container);
            }
          });
        }, {
          rootMargin: '200px' // Load 200px before becoming visible
        });
        
        // Observe all trustindex containers
        document.querySelectorAll('.trustindex-widget').forEach(function(widget) {
          observer.observe(widget);
        });
      })();
    </script>'''

def convert_trustindex_to_lazy(file_path):
    """Convert Trustindex scripts to lazy loading."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Check if file has trustindex
        if 'trustindex.io/loader.js' not in content:
            return False
        
        # Check if already converted
        if 'Trustindex Lazy Loading' in content:
            return False
        
        # Step 1: Convert src to data-src in trustindex scripts
        pattern = re.compile(
            r'(<script[^>]*)\s+src="(https://cdn\.trustindex\.io/loader\.js\?[^"]*)"([^>]*>)',
            re.IGNORECASE | re.MULTILINE
        )
        
        def convert_script(match):
            before = match.group(1)
            url = match.group(2)
            after = match.group(3)
            return f'{before} data-src="{url}"{after}'
        
        content = pattern.sub(convert_script, content)
        
        # Step 2: Add lazy loading script before </body>
        if '</body>' in content:
            content = content.replace('</body>', f'{LAZY_SCRIPT}\n  </body>')
        
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
        if convert_trustindex_to_lazy(html_file):
            modified_count += 1
            print(f"✓ Converted to lazy: {html_file.relative_to(project_root)}")
    
    print(f"\n{'='*60}")
    print(f"Trustindex Lazy Loading Complete!")
    print(f"{'='*60}")
    print(f"Files scanned: {total_count}")
    print(f"Files modified: {modified_count}")
    print(f"\n✨ How it works:")
    print(f"  1. Scripts have data-src instead of src (no immediate load)")
    print(f"  2. Intersection Observer watches widget containers")
    print(f"  3. When container enters viewport (+200px margin):")
    print(f"     → data-src is converted back to src")
    print(f"     → Browser loads the script")
    print(f"  4. Widget appears smoothly when user scrolls to it")
    print(f"\n📊 Expected impact:")
    print(f"  • ~200-300ms faster FCP (First Contentful Paint)")
    print(f"  • Reduced 3rd-party blocking time")
    print(f"  • Better PageSpeed Insights score")

if __name__ == '__main__':
    main()
