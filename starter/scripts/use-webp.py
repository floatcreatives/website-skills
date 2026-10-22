#!/usr/bin/env python3
"""Replace JPG references with WebP in Astro source files."""
import os, sys

src_dir = sys.argv[1] if len(sys.argv) > 1 else 'src'

count = [0]
for root, dirs, files in os.walk(src_dir):
    for fn in files:
        if fn.endswith('.astro'):
            filepath = os.path.join(root, fn)
            with open(filepath, 'r') as fh:
                content = fh.read()

            import re
            def replace_jpg(m):
                jpg_path = m.group(0)
                webp_path = jpg_path.replace('.jpg', '.webp')
                webp_file = os.path.join('public', webp_path.lstrip('/'))
                if os.path.exists(webp_file):
                    count[0] += 1
                    return webp_path
                return jpg_path

            new_content = re.sub(r'/images/[^"]+\.jpg', replace_jpg, content)

            if new_content != content:
                with open(filepath, 'w') as fh:
                    fh.write(new_content)

print(f'Replaced {count[0]} JPG references with WebP')
