"""Build the home-screen icons out of the T. rex sprite.
python tools/make_icons.py  ->  assets/icons/icon-192.png, icon-512.png, apple-180.png, maskable-512.png"""
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'icons')
os.makedirs(OUT, exist_ok=True)
SRC = os.path.join(ROOT, 'assets', 'img', 'trex.png')


def bg(size, radius_frac, pad_frac):
    """warm rounded square with the dinosaur standing on it"""
    s = size * 4                                   # draw big, scale down: clean edges
    im = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = int(s * radius_frac)
    # sunset gradient
    grad = Image.new('RGB', (1, s))
    for y in range(s):
        t = y / s
        grad.putpixel((0, y), (int(255 - 20 * t), int(178 + 30 * t), int(77 + 40 * t)))
    grad = grad.resize((s, s))
    mask = Image.new('L', (s, s), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, s - 1, s - 1], radius=r, fill=255)
    im.paste(grad, (0, 0), mask)
    # sun glow
    glow = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([s * 0.55, -s * 0.12, s * 1.05, s * 0.38], fill=(255, 240, 170, 190))
    glow = glow.filter(ImageFilter.GaussianBlur(s * 0.03))
    im.alpha_composite(Image.composite(glow, Image.new('RGBA', (s, s), (0, 0, 0, 0)), mask))
    # the dinosaur
    dino = Image.open(SRC).convert('RGBA')
    pad = s * pad_frac
    k = min((s - 2 * pad) / dino.width, (s - 2 * pad) / dino.height)
    dino = dino.resize((max(1, int(dino.width * k)), max(1, int(dino.height * k))), Image.LANCZOS)
    im.alpha_composite(dino, (int((s - dino.width) / 2), int(s - pad * 0.75 - dino.height)))
    return im.resize((size, size), Image.LANCZOS)


for name, size, radius, pad in [('icon-192', 192, 0.22, 0.10), ('icon-512', 512, 0.22, 0.10),
                                ('apple-180', 180, 0.0, 0.10), ('maskable-512', 512, 0.0, 0.20)]:
    p = os.path.join(OUT, name + '.png')
    bg(size, radius, pad).save(p, optimize=True)
    print('saved', p, os.path.getsize(p) // 1024, 'KB')
