#!/usr/bin/env python3
# -*- coding: utf-8 -*-

def sort_redirects(input_file, output_file):
    """Sort redirects by moving all wildcard redirects (*) to the bottom."""
    
    # Read all lines
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Separate wildcard and non-wildcard redirects
    wildcard_lines = []
    normal_lines = []
    
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#'):  # Skip empty lines and comments
            if '*' in line:
                wildcard_lines.append(line)
            else:
                normal_lines.append(line)
    
    # Write sorted file
    with open(output_file, 'w', encoding='utf-8') as f:
        # Write normal redirects first
        for line in normal_lines:
            f.write(line + '\n')
        
        # Add separator
        if normal_lines and wildcard_lines:
            f.write('\n# Wildcard redirects (moved to bottom)\n')
        
        # Write wildcard redirects at the bottom
        for line in wildcard_lines:
            f.write(line + '\n')
    
    print(f"Sorted {len(normal_lines)} normal redirects and {len(wildcard_lines)} wildcard redirects")
    print(f"Output written to {output_file}")

if __name__ == "__main__":
    sort_redirects("_redirects", "_redirects.sorted")
