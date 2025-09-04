#!/usr/bin/env python3
"""
Script to add prices to all day trips in en/, de/, th/ versions
"""

import re

def add_prices_to_daytrips():
    # English version
    with open('en/day-trips/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Day trip prices
    daytrip_prices = [
        '1,490 THB',  # Snorkeling
        '2,990 THB',  # Fun Dives
        '3,950 THB',  # Scuba Review
        '4,890 THB',  # Try Dive
        'From 1,490 THB',  # Insurance (varies by package)
        '490 THB'     # GoPro Rental
    ]
    
    # Find all day trip descriptions and add prices
    course_pattern = r'(<h3>.*?</h3>\s*<p[^>]*>.*?</p>)'
    courses = re.findall(course_pattern, content, re.DOTALL)
    
    if len(courses) == len(daytrip_prices):
        for i, (course, price) in enumerate(zip(courses, daytrip_prices)):
            price_html = f'\n              <p style="text-align: center; margin: 10px 0; font-weight: bold; color: #0077b6;">\n                💸 Starting from {price}\n              </p>'
            new_course = course + price_html
            content = content.replace(course, new_course)
    
    # Write back to file
    with open('en/day-trips/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Added prices to English day trips!")
    
    # German version
    with open('de/day-trips/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if len(courses) == len(daytrip_prices):
        for i, (course, price) in enumerate(zip(courses, daytrip_prices)):
            price_html = f'\n              <p style="text-align: center; margin: 10px 0; font-weight: bold; color: #0077b6;">\n                💸 Ab {price}\n              </p>'
            new_course = course + price_html
            content = content.replace(course, new_course)
    
    # Write back to file
    with open('de/day-trips/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Added prices to German day trips!")
    
    # Thai version
    with open('th/day-trips/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if len(courses) == len(daytrip_prices):
        for i, (course, price) in enumerate(zip(courses, daytrip_prices)):
            price_html = f'\n              <p style="text-align: center; margin: 10px 0; font-weight: bold; color: #0077b6;">\n                💸 เริ่มต้นที่ {price}\n              </p>'
            new_course = course + price_html
            content = content.replace(course, new_course)
    
    # Write back to file
    with open('th/day-trips/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Added prices to Thai day trips!")
    print("All day trips now have prices!")

if __name__ == "__main__":
    add_prices_to_daytrips()
