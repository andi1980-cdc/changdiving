#!/usr/bin/env python3
"""Final comprehensive check"""
import re
import os
from pathlib import Path

base_dir = Path('/Users/andismac/Desktop/cdc_git')
total = 0
complete = 0
missing_image = 0
incomplete_meta = 0
no_og = 0

for lang in ['en', 'de', 'th']:
    for html_file in (base_dir / lang).rglob('index.html'):
        total += 1
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        og_match = re.search(r'property="og:image"\s+content="(https://changdiving\.com/img/[^"]+)"', content)
        if not og_match:
            no_og += 1
            continue
        
        has_w = 'og:image:width' in content
        has_h = 'og:image:height' in content
        has_t = 'og:image:type' in content
        has_a = 'og:image:alt' in content
        
        if not all([has_w, has_h, has_t, has_a]):
            incomplete_meta += 1
            continue
        
        img_path = og_match.group(1).replace('https://changdiving.com/', '')
        img_full = base_dir / img_path
        
        if not img_full.exists():
            missing_image += 1
            continue
        
        complete += 1

print(f"""
{'='*70}
✅ FINAL VERIFICATION COMPLETE
{'='*70}

📊 Results:
   Total pages:              {total}
   ✅ Complete & images exist: {complete} ({100*complete//total}%)
   ⚠️  Incomplete metadata:    {incomplete_meta}
   🖼️  Missing images:         {missing_image}
   ⚪ No og:image:            {no_og}

{'='*70}
""")

if incomplete_meta == 0 and missing_image == 0:
    print("🎉 PERFECT! All pages are ready for commit!\n")
    exit(0)
else:
    print(f"⚠️  {incomplete_meta + missing_image} issues remain\n")
    exit(1)

