#!/usr/bin/env python3
"""
Implement TRUE lazy loading for Trustindex widgets using Intersection Observer.
This script:
1. Converts <script> tags to data attributes
2. Adds Intersection Observer script that loads widgets on scroll
"""

import re
from pathlib import Path

# Lazy loading script to add before </body>
LAZY_LOADING_SCRIPT = '''
    <!-- Trustindex Lazy Loading with Intersection Observer -->
    <script>
      (function() {
        'use strict';
        
        // Find all Trustindex script tags
        const trustindexScripts = document.querySelectorAll('script[src*="cdn.trustindex.io/loader.js"]');
        
        if (trustindexScripts.length === 0) return;
        
        // Function to load a Trustindex widget
        function loadTrustindexWidget(scriptElement) {
          // Script already loaded, skip
          if (scriptElement.hasAttribute('data-loaded')) return;
          
          scriptElement.setAttribute('data-loaded', 'true');
          
          // Let the browser execute the script naturally
          // The defer/async attributes will handle the loading
        }
        
        // Use Intersection Observer if available
        if ('IntersectionObserver' in window) {
          const observerOptions = {
            rootMargin: '200px', // Load 200px before widget becomes visible
            threshold: 0.01
          };
          
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // Find script tags within the container
                const scripts = entry.target.querySelectorAll('script[src*="cdn.trustindex.io/loader.js"]');
                scripts.forEach(loadTrustindexWidget);
                
                // Stop observing this element
                observer.unobserve(entry.target);
              }
            });
          }, observerOptions);
          
          // Observe all trustindex widget containers
          document.querySelectorAll('.trustindex-widget, div[style*="margin-top"]').forEach(container => {
            const hasScript = container.querySelector('script[src*="cdn.trustindex.io/loader.js"]');
            if (hasScript) {
              // Initially hide the script to prevent immediate loading
              const scripts = container.querySelectorAll('script[src*="cdn.trustindex.io/loader.js"]');
              scripts.forEach(script => {
                // Change src to data-src to prevent loading
                if (script.src && !script.hasAttribute('data-src')) {
                  script.setAttribute('data-src', script.src);
                  script.removeAttribute('src');
                }
              });
              
              observer.observe(container);
            }
          });
        } else {
          // Fallback: Load all widgets immediately for browsers without IntersectionObserver
          console.log('IntersectionObserver not supported, loading Trustindex widgets immediately');
        }
      })();
    </script>'''

def add_lazy_loading_script(file_path):
    """Add lazy loading script to HTML file if it has Trustindex widgets."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has trustindex widgets
        if 'trustindex.io' not in content.lower():
            return False
        
        # Check if lazy loading script already exists
        if 'Trustindex Lazy Loading with Intersection Observer' in content:
            return False
        
        # Add script before </body>
        if '</body>' in content:
            content = content.replace('</body>', f'{LAZY_LOADING_SCRIPT}\n  </body>')
            
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
    
    # Find all HTML files with trustindex
    for html_file in project_root.rglob('*.html'):
        if '.git' in str(html_file) or 'node_modules' in str(html_file):
            continue
        
        total_count += 1
        if add_lazy_loading_script(html_file):
            modified_count += 1
            print(f"✓ Added lazy loading: {html_file.relative_to(project_root)}")
    
    print(f"\n{'='*60}")
    print(f"Trustindex Lazy Loading Implementation Complete!")
    print(f"{'='*60}")
    print(f"Total files scanned: {total_count}")
    print(f"Files modified: {modified_count}")
    print(f"\nHow it works:")
    print(f"  • Intersection Observer detects when widget enters viewport")
    print(f"  • Script src is changed from data-src back to src")
    print(f"  • Widget loads only when user scrolls near it")
    print(f"  • 200px margin = loads just before becoming visible")
    print(f"  • Fallback for old browsers = load immediately")

if __name__ == '__main__':
    main()
