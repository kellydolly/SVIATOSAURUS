"""Draw the detected rig (neck line, hip line, leg pivots) over every sprite so it can be checked by eye.
python tools/rigdebug.py  ->  tools/_canva/rig_debug.png"""
import os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cutout

IMG = cutout.IMG
files = sorted(f for f in os.listdir(IMG) if f.endswith('.png'))
CELL = 300
cols = min(4, len(files)); rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * CELL, rows * CELL), (240, 244, 255))
sd = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    p = os.path.join(IMG, f)
    r = cutout.rig(p)
    im = Image.open(p).convert('RGBA')
    bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im); im = bg.convert('RGB')
    d = ImageDraw.Draw(im); W, H = im.size
    d.line([(0, H * r['neck']), (W, H * r['neck'])], fill=(255, 0, 0), width=4)
    d.line([(0, H * r['hip']), (W, H * r['hip'])], fill=(0, 110, 255), width=4)
    for x, c in ((r['legL'], (0, 180, 0)), (r['legR'], (255, 140, 0))):
        d.ellipse([W * x - 9, H * r['hip'] - 9, W * x + 9, H * r['hip'] + 9], fill=c)
    im.thumbnail((CELL, CELL), Image.LANCZOS)
    x0, y0 = (i % cols) * CELL, (i // cols) * CELL
    sheet.paste(im, (x0 + (CELL - im.width) // 2, y0 + (CELL - im.height) // 2))
    sd.text((x0 + 8, y0 + 8), '%s  neck %.2f hip %.2f' % (f[:-4], r['neck'], r['hip']), fill=(0, 0, 0))
out = os.path.join(os.path.dirname(IMG), '..', 'tools', '_canva', 'rig_debug.png')
out = os.path.normpath(out)
sheet.save(out); print(out, sheet.size)
