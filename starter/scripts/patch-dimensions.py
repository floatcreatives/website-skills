#!/usr/bin/env python3
"""Patch HTML files to add width/height attributes to <img> tags for CLS prevention."""
import os, struct, re, sys

dist = sys.argv[1] if len(sys.argv) > 1 else 'dist'

# Build dimension map from actual files
dims = {}
img_dir = os.path.join(dist, 'images')
if os.path.isdir(img_dir):
    for f in os.listdir(img_dir):
        path = os.path.join(img_dir, f)
        try:
            if f.lower().endswith('.jpg'):
                with open(path, 'rb') as fh:
                    fh.seek(2)
                    while True:
                        if fh.read(1) == b'\xff':
                            marker = fh.read(1)
                            if marker in (b'\xc0', b'\xc2'):
                                fh.read(3)
                                h, w = struct.unpack('>HH', fh.read(4))
                                dims['/images/' + f] = (w, h)
                                break
            elif f.lower().endswith('.png'):
                with open(path, 'rb') as fh:
                    fh.read(16)
                    w, h = struct.unpack('>II', fh.read(8))
                    dims['/images/' + f] = (w, h)
        except:
            pass

total = 0
for root, dirs, files in os.walk(dist):
    for fn in files:
        if fn.endswith('.html'):
            filepath = os.path.join(root, fn)
            with open(filepath, 'r') as fh:
                html = fh.read()

            file_count = [0]
            def add_dims(m):
                tag = m.group(0)
                src_m = re.search(r'src="([^"]+)"', tag)
                if not src_m: return tag
                src = src_m.group(1).split('?')[0]
                if src in dims and 'width=' not in tag:
                    w, h = dims[src]
                    file_count[0] += 1
                    return tag[:-1] + f' width="{w}" height="{h}">'
                return tag

            html = re.sub(r'<img[^>]+>', add_dims, html)
            if file_count[0]:
                total += file_count[0]
                with open(filepath, 'w') as fh:
                    fh.write(html)

print(f'Added width/height to {total} img tags')
