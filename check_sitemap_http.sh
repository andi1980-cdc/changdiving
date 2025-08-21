#!/bin/bash

# Sitemap HTTP Status Checker
# Checks all URLs in sitemap.xml and outputs results to CSV

echo "URL,Status,Response_Time,Error" > sitemap_status.csv

# Check if sitemap.xml exists
if [ ! -f "sitemap.xml" ]; then
    echo "Error: sitemap.xml not found!"
    exit 1
fi

# Count total URLs
total_urls=$(grep -c "<loc>" sitemap.xml)
echo "Starting check of $total_urls URLs..." >&2

counter=0

# Extract URLs from sitemap.xml and check each one
grep -o '<loc>[^<]*</loc>' sitemap.xml | sed 's/<loc>\(.*\)<\/loc>/\1/' | while read url; do
    counter=$((counter + 1))
    echo "Checking [$counter/$total_urls]: $url" >&2
    
    # Use curl to check HTTP status with timeout
    response=$(curl -s -w "%{http_code},%{time_total}" --max-time 5 "$url" 2>/dev/null)
    
    # Extract status code and response time
    status_code=$(echo "$response" | tail -n1 | cut -d',' -f1)
    response_time=$(echo "$response" | tail -n1 | cut -d',' -f2)
    
    # Check if curl failed
    if [ $? -ne 0 ] || [ -z "$status_code" ]; then
        error_msg="Connection failed"
        status_code="ERROR"
        response_time="0"
    else
        error_msg=""
    fi
    
    # Output to CSV
    echo "$url,$status_code,$response_time,$error_msg" >> sitemap_status.csv
    
    # Shorter delay to be faster
    sleep 0.05
done

echo "Check complete! Results saved to sitemap_status.csv" >&2
echo "Summary:" >&2
echo "Total URLs checked: $(grep -c "^https://" sitemap_status.csv)" >&2
echo "Successful (200): $(grep -c ",200," sitemap_status.csv)" >&2
echo "Errors (4xx/5xx): $(grep -E ",(4[0-9]{2}|5[0-9]{2})," sitemap_status.csv | wc -l)" >&2
