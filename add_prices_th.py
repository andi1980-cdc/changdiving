#!/usr/bin/env python3
"""
Script to add price templates to Thai courses
"""

import re

def add_price_templates_to_thai_courses():
    with open('th/courses/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Price templates (you can change these later)
    price_templates = [
        '3,950 THB',  # Try Dive
        '3,950 THB',  # Refresher
        '14,490 THB', # Open Water Diver
        '22,490 THB', # OWD & AOWD Package
        '13,490 THB', # Advanced OWD
        '4,990 THB',  # First Aid
        '14,990 THB', # Rescue Diver
        '62,424 THB', # Master Scuba Diver
        '46,150 THB', # OWD to Divemaster Package
        '29,990 THB', # Divemaster
        '9,990 THB',  # EFR Instructor
        '34,990 THB', # SDI IDC
        '9,990 THB',  # SDI IE
        '15,990 THB', # SDI Crossover
        '19,490 THB', # Deep, Wreck & Nitrox Pack
        '4,990 THB',  # Nitrox Diver
        '7,990 THB',  # Deep Diver
        '7,990 THB',  # Wreck Diver
        '7,990 THB',  # Navigation Specialty
        '7,990 THB',  # Search & Recovery
        '7,990 THB',  # Night Diver
        '9,990 THB',  # Sidemount
        '9,990 THB',  # Solo Diver
        '11,990 THB', # Intro to Tech
        '24,990 THB', # Advanced Nitrox
        '24,990 THB', # Decompression Procedures
        '18,870 THB', # Advanced Wreck
        '74,990 THB'  # Technical Diver Package
    ]
    
    # Find all course descriptions and add prices
    course_pattern = r'(<h3>.*?</h3>\s*<p[^>]*>.*?</p>)'
    courses = re.findall(course_pattern, content, re.DOTALL)
    
    if len(courses) == len(price_templates):
        for i, (course, price) in enumerate(zip(courses, price_templates)):
            price_html = f'\n              <p style="text-align: center; margin: 10px 0; font-weight: bold; color: #0077b6;">\n                💸 เริ่มต้นที่ {price}\n              </p>'
            new_course = course + price_html
            content = content.replace(course, new_course)
    
    # Write back to file
    with open('th/courses/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Added price templates to {len(price_templates)} Thai courses!")

if __name__ == "__main__":
    add_price_templates_to_thai_courses()
