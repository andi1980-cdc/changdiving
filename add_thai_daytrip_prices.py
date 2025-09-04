#!/usr/bin/env python3
"""
Script to add prices to all Thai day trips
"""

import re

def add_thai_daytrip_prices():
    with open('th/day-trips/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Day trip prices
    daytrip_prices = [
        '1,490 THB',  # Snorkeling
        '2,990 THB',  # Fun Dives
        '3,950 THB',  # Scuba Review
        '4,890 THB',  # Try Dive
        '1,490 THB',  # Insurance
        '490 THB'     # GoPro Rental
    ]
    
    # Find all day trip descriptions and add prices
    course_pattern = r'(<h3>.*?</h3>\s*<p[^>]*>.*?</p>)'
    courses = re.findall(course_pattern, content, re.DOTALL)
    
    if len(courses) == len(daytrip_prices):
        for i, (course, price) in enumerate(zip(courses, daytrip_prices)):
            price_html = f'\n              <p style="text-align: center; margin: 10px 0; font-weight: bold; color: #0077b6;">\n                💸 เริ่มต้นที่ {price}\n              </p>'
            new_course = course + price_html
            content = content.replace(course, new_course)
    
    # Write back to file
    with open('th/day-trips/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Added prices to {len(daytrip_prices)} Thai day trips!")

if __name__ == "__main__":
    add_thai_daytrip_prices()
