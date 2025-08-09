#!/usr/bin/env python3
# -*- coding: utf-8 -*-

def fix_redirects():
    """Move all wildcard redirects (*) to the bottom of the file."""
    
    # Read the current file
    with open('_redirects', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Separate lines
    wildcard_lines = []
    normal_lines = []
    
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#'):
            if '*' in line:
                wildcard_lines.append(line)
            else:
                normal_lines.append(line)
    
    # Create new content
    new_content = []
    
    # Add normal redirects first
    for line in normal_lines:
        new_content.append(line + '\n')
    
    # Add separator
    if wildcard_lines:
        new_content.append('\n# Wildcard redirects (moved to bottom)\n')
        
        # Add wildcard redirects at the bottom
        for line in wildcard_lines:
            new_content.append(line + '\n')
    
    # Write back to file
    with open('_redirects', 'w', encoding='utf-8') as f:
        f.writelines(new_content)
    
    print(f"Fixed: {len(normal_lines)} normal redirects, {len(wildcard_lines)} wildcard redirects moved to bottom")

if __name__ == "__main__":
    fix_redirects()
