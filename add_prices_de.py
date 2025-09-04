#!/usr/bin/env python3
"""
Script to add prices to all German courses in de/courses/index.html
"""

import re

def add_prices_to_german_courses():
    with open('de/courses/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Course prices mapping
    prices = {
        'Schnuppertauchen': '4,890 THB',
        'Auffrischungskurs': '3,950 THB',
        'Open Water Diver': '14,490 THB',
        'OWD & AOWD Paket': '22,490 THB',
        'Advanced OWD': '13,490 THB',
        'Erste Hilfe': '4,990 THB',
        'Rescue Diver': '14,990 THB',
        'Master Scuba Diver': '62,424 THB',
        'OWD to Divemaster Paket': '46,150 THB',
        'Divemaster': '29,990 THB',
        'EFRI Kurs': '9,990 THB',
        'SDI (IDC) Kurs': '34,990 THB',
        'SDI IE': '9,990 THB',
        'SDI Crossover': '15,990 THB',
        'Deep, Wreck & Nitrox Paket': '19,490 THB',
        'Nitrox Diver': '4,990 THB',
        'Deep Diver': '7,990 THB',
        'Wreck Diver': '9,990 THB',
        'Navigation Spezialität': '7,990 THB',
        'Search & Recovery': '7,990 THB',
        'Night Diver': '7,990 THB',
        'Sidemount Kurs': '9,990 THB',
        'Solo Diver': '8,990 THB',
        'TDI Intro to Tech': '11,990 THB',
        'TDI Advanced Nitrox': '24,990 THB',
        'Dekompressionsverfahren': '24,990 THB',
        'Advanced Wreck Diver': '18,870 THB',
        'Technical Diver Paket': '74,990 THB'
    }
    
    # Add prices to each course
    for course_name, price in prices.items():
        # Find the course description and add price after it
        pattern = rf'(<h3>.*?{re.escape(course_name)}.*?</h3>\s*<p[^>]*>.*?</p>)'
        replacement = rf'\1\n              <p style="text-align: center; margin: 10px 0; font-weight: bold; color: #0077b6;">\n                💸 Ab {price}\n              </p>'
        
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Write back to file
    with open('de/courses/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Prices added to German courses!")

if __name__ == "__main__":
    add_prices_to_german_courses()
