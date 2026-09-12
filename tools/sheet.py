"""Download Canva candidate thumbnails and build one contact sheet: python tools/sheet.py out.png <url>..."""
import sys, os, urllib.request
from PIL import Image, ImageDraw
UA = {'User-Agent': 'Mozilla/5.0', 'Accept': 'image/avif,image/webp,image/png,image/*,*/*'}
out, urls = sys.argv[1], sys.argv[2:]
ims = []
for i, u in enumerate(urls):
    p = 'tools/_canva/_cand%d.png' % i
    req = urllib.request.Request(u, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r, open(p, 'wb') as f:
        f.write(r.read())
    im0 = Image.open(p).convert('RGBA')
    bgw = Image.new('RGBA', im0.size, (255, 255, 255, 255)); bgw.alpha_composite(im0)
    ims.append(bgw.convert('RGB'))
    print(i + 1, p, ims[-1].size)
cols = min(4, len(ims)); rows = (len(ims) + cols - 1) // cols
w = min(360, ims[0].width); sheet = Image.new('RGB', (cols * w, rows * w), 'white')
d = ImageDraw.Draw(sheet)
for i, im in enumerate(ims):
    im = im.resize((w, w), Image.LANCZOS)
    x, y = (i % cols) * w, (i // cols) * w
    sheet.paste(im, (x, y)); d.rectangle([x, y, x + 26, y + 26], fill='black'); d.text((x + 9, y + 7), str(i + 1), fill='white')
sheet.save(out); print('sheet', out, sheet.size)
