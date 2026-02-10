#!/usr/bin/env python3
"""
Optimize Trustindex loading across all HTML files:
1. Add lazy loading with Intersection Observer
2. Add crossorigin="anonymous" attribute
3. Standardize wrapper structure
4. Keep both widget IDs (10987fa47f9a902e6d96b4a1e44 and b3e5b7448c6a735187060fc5afd)
"""

import os
import re
from pathlib import Path

# Widget IDs
WIDGET_1 = "10987fa47f9a902e6d96b4a1e44"
WIDGET_2 = "b3e5b7448c6a735187060fc5afd"

# New lazy-loading implementation template
LAZY_WIDGET_TEMPLATE = '''<!-- TrustIndex Widget (Lazy Loaded) -->
        <div class="trustindex-widget-lazy" data-widget-id="{widget_id}" style="margin-top: 2rem">
          <noscript>
            <script
              src="https://cdn.trustindex.io/loader.js?{widget_id}"
              crossorigin="anonymous"
            ></script>
          </noscript>
        </div>'''

# Lazy loading script to add before </body>
LAZY_SCRIPT = '''
    <!-- Trustindex Lazy Loading Script -->
    <script>
      (function() {
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const widget = entry.target;
                const widgetId = widget.getAttribute('data-widget-id');
                
                // Create and inject script
                const script = document.createElement('script');
                script.src = `https://cdn.trustindex.io/loader.js?${widgetId}`;
                script.crossOrigin = 'anonymous';
                script.defer = true;
                script.async = true;
                
                widget.appendChild(script);
                observer.unobserve(widget);
              }
            });
          }, {
            rootMargin: '200px' // Load 200px before widget becomes visible
          });

          // Observe all trustindex widgets
          document.querySelectorAll('.trustindex-widget-lazy').forEach(widget => {
            observer.observe(widget);
          });
        } else {
          // Fallback for browsers without IntersectionObserver
          document.querySelectorAll('.trustindex-widget-lazy').forEach(widget => {
            const widgetId = widget.getAttribute('data-widget-id');
            const script = document.createElement('script');
            script.src = `https://cdn.trustindex.io/loader.js?${widgetId}`;
            script.crossOrigin = 'anonymous';
            script.defer = true;
            script.async = true;
            widget.appendChild(script);
          });
        }
      })();
    </script>'''

def optimize_trustindex(file_path):
    """Optimize Trustindex loading in a single HTML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        modified = False
        
        # Pattern 1: Find Widget 1 (with trustindex-widget div wrapper)
        pattern1 = re.compile(
            r'<div\s+class="trustindex-widget"[^>]*>[\s\S]*?'
            r'<script[^>]*src="https://cdn\.trustindex\.io/loader\.js\?' + re.escape(WIDGET_1) + r'"[^>]*>[\s\S]*?</script>[\s\S]*?</div>',
            re.MULTILINE
        )
        
        # Pattern 2: Find Widget 1 (without wrapper)
        pattern2 = re.compile(
            r'<div[^>]*>[\s\S]*?<script[^>]*src="https://cdn\.trustindex\.io/loader\.js\?' + re.escape(WIDGET_1) + r'"[^>]*>[\s\S]*?</script>[\s\S]*?</div>',
            re.MULTILINE
        )
        
        # Pattern 3: Find Widget 2 (standalone script)
        pattern3 = re.compile(
            r'<script[^>]*src="https://cdn\.trustindex\.io/loader\.js\?' + re.escape(WIDGET_2) + r'"[^>]*>[\s\S]*?</script>',
            re.MULTILINE
        )
        
        # Replace Widget 1
        if re.search(pattern1, content):
            content = re.sub(pattern1, LAZY_WIDGET_TEMPLATE.format(widget_id=WIDGET_1), content)
            modified = True
        elif re.search(pattern2, content):
            content = re.sub(pattern2, LAZY_WIDGET_TEMPLATE.format(widget_id=WIDGET_1), content)
            modified = True
        
        # Replace Widget 2
        if re.search(pattern3, content):
            content = re.sub(pattern3, LAZY_WIDGET_TEMPLATE.format(widget_id=WIDGET_2), content)
            modified = True
        
        # Add lazy loading script before </body> if not already present
        if modified and 'Trustindex Lazy Loading Script' not in content:
            content = content.replace('</body>', f'{LAZY_SCRIPT}\n  </body>')
        
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
    """Process all HTML files in the project."""
    project_root = Path('/Users/andismac/Desktop/cdc_git')
    
    modified_count = 0
    total_count = 0
    
    # Find all HTML files
    for html_file in project_root.rglob('*.html'):
        # Skip files in certain directories if needed
        if '.git' in str(html_file) or 'node_modules' in str(html_file):
            continue
        
        total_count += 1
        if optimize_trustindex(html_file):
            modified_count += 1
            print(f"✓ Optimized: {html_file.relative_to(project_root)}")
    
    print(f"\n{'='*60}")
    print(f"Trustindex Optimization Complete!")
    print(f"{'='*60}")
    print(f"Total files scanned: {total_count}")
    print(f"Files modified: {modified_count}")
    print(f"\nChanges:")
    print(f"  • Added lazy loading with Intersection Observer")
    print(f"  • Added crossorigin='anonymous' attribute")
    print(f"  • Standardized wrapper structure")
    print(f"  • Both widget IDs preserved: {WIDGET_1} and {WIDGET_2}")

if __name__ == '__main__':
    main()
