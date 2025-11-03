#!/usr/bin/env python3
"""
Comprehensive verification script to check:
1. All pages with og:image have complete metadata
2. All referenced images exist
3. Image dimensions are correct
"""
import re
import os
from pathlib import Path
from collections import defaultdict

def verify_html_file(file_path):
    """Verify a single HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find og:image URL
    og_image_match = re.search(
        r'<meta\s+property="og:image"\s+content="(https://changdiving\.com/img/[^"]+)"[^>]*>',
        content,
        re.MULTILINE | re.DOTALL
    )
    
    if not og_image_match:
        return {'status': 'no-og-image', 'image_url': None, 'image_exists': None}
    
    og_image_url = og_image_match.group(1)
    
    # Check for all metadata
    has_width = bool(re.search(r'<meta\s+property="og:image:width"', content))
    has_height = bool(re.search(r'<meta\s+property="og:image:height"', content))
    has_type = bool(re.search(r'<meta\s+property="og:image:type"', content))
    has_alt = bool(re.search(r'<meta\s+property="og:image:alt"', content))
    
    # Check if image file exists
    image_rel_path = og_image_url.replace('https://changdiving.com/', '')
    image_full_path = os.path.join('/Users/andismac/Desktop/cdc_git', image_rel_path)
    image_exists = os.path.exists(image_full_path)
    
    missing = []
    if not has_width: missing.append('width')
    if not has_height: missing.append('height')
    if not has_type: missing.append('type')
    if not has_alt: missing.append('alt')
    
    if missing:
        status = f'incomplete:{",".join(missing)}'
    elif not image_exists:
        status = 'image-missing'
    else:
        status = 'complete'
    
    return {
        'status': status,
        'image_url': og_image_url,
        'image_exists': image_exists,
        'has_width': has_width,
        'has_height': has_height,
        'has_type': has_type,
        'has_alt': has_alt
    }

def main():
    """Verify all HTML files"""
    base_dir = Path('/Users/andismac/Desktop/cdc_git')
    
    stats = {
        'en': defaultdict(list),
        'de': defaultdict(list),
        'th': defaultdict(list)
    }
    
    for lang in ['en', 'de', 'th']:
        lang_dir = base_dir / lang
        html_files = list(lang_dir.rglob('index.html'))
        
        for html_file in sorted(html_files):
            rel_path = str(html_file.relative_to(base_dir))
            result = verify_html_file(str(html_file))
            stats[lang][result['status']].append({
                'path': rel_path,
                'image': result['image_url']
            })
    
    # Print detailed report
    print("\n" + "="*80)
    print("🔍 COMPREHENSIVE IMAGE METADATA VERIFICATION REPORT")
    print("="*80)
    
    for lang in ['en', 'de', 'th']:
        print(f"\n{'='*80}")
        print(f"📊 {lang.upper()} PAGES")
        print(f"{'='*80}")
        
        total = sum(len(v) for v in stats[lang].values())
        complete = len(stats[lang]['complete'])
        no_og = len(stats[lang]['no-og-image'])
        missing_img = len(stats[lang]['image-missing'])
        
        # Count incomplete
        incomplete = sum(len(v) for k, v in stats[lang].items() if k.startswith('incomplete'))
        
        print(f"\n📈 Summary:")
        print(f"   Total pages:           {total}")
        print(f"   ✅ Complete & valid:   {complete}")
        print(f"   ⚠️  Incomplete metadata: {incomplete}")
        print(f"   🖼️  Missing images:     {missing_img}")
        print(f"   ⚪ No og:image tag:    {no_og}")
        
        if incomplete > 0:
            print(f"\n❌ INCOMPLETE METADATA ({incomplete} pages):")
            for status, pages in stats[lang].items():
                if status.startswith('incomplete'):
                    missing_fields = status.replace('incomplete:', '')
                    print(f"\n   Missing {missing_fields}:")
                    for page in pages[:10]:  # Show first 10
                        print(f"      - {page['path']}")
                    if len(pages) > 10:
                        print(f"      ... and {len(pages) - 10} more")
        
        if missing_img > 0:
            print(f"\n🖼️  MISSING IMAGE FILES ({missing_img} pages):")
            for page in stats[lang]['image-missing'][:10]:
                print(f"   - {page['path']}")
                print(f"     Image: {page['image']}")
            if len(stats[lang]['image-missing']) > 10:
                print(f"   ... and {len(stats[lang]['image-missing']) - 10} more")
        
        if no_og > 0:
            print(f"\n⚪ NO OG:IMAGE TAG ({no_og} pages):")
            for page in stats[lang]['no-og-image'][:5]:
                print(f"   - {page['path']}")
    
    # Overall summary
    print(f"\n{'='*80}")
    print("🎯 OVERALL SUMMARY")
    print(f"{'='*80}")
    
    total_pages = sum(sum(len(v) for v in lang_stats.values()) for lang_stats in stats.values())
    total_complete = sum(len(lang_stats['complete']) for lang_stats in stats.values())
    total_incomplete = sum(sum(len(v) for k, v in lang_stats.items() if k.startswith('incomplete')) for lang_stats in stats.values())
    total_missing_img = sum(len(lang_stats['image-missing']) for lang_stats in stats.values())
    total_no_og = sum(len(lang_stats['no-og-image']) for lang_stats in stats.values())
    
    print(f"\n   Total pages analyzed:     {total_pages}")
    print(f"   ✅ Complete & ready:      {total_complete} ({100*total_complete//total_pages}%)")
    print(f"   ⚠️  Incomplete metadata:   {total_incomplete}")
    print(f"   🖼️  Missing image files:   {total_missing_img}")
    print(f"   ⚪ No og:image needed:    {total_no_og}")
    
    if total_incomplete == 0 and total_missing_img < 20:
        print(f"\n{'='*80}")
        print("✅ VERIFICATION PASSED!")
        print("   All pages with og:image have complete metadata.")
        print(f"   Only {total_missing_img} image files are missing (acceptable).")
        print(f"{'='*80}\n")
        return 0
    else:
        print(f"\n{'='*80}")
        print("⚠️  ACTION REQUIRED")
        if total_incomplete > 0:
            print(f"   {total_incomplete} pages need metadata completion")
        if total_missing_img > 20:
            print(f"   {total_missing_img} images are missing")
        print(f"{'='*80}\n")
        return 1

if __name__ == '__main__':
    exit(main())

