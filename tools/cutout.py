"""Turn a Canva/AI render into a game sprite: cut away the flat white studio background,
trim, downscale, and work out a simple 2D rig (neck line, hip line, leg pivots) so the game
can animate the head, body and legs separately instead of sliding the whole picture around.

Usage: python tools/cutout.py tools/_canva/trex_raw.png assets/img/trex.png
       python tools/cutout.py --manifest           (only rebuild assets/img-manifest.js)"""
import sys, os, json
from PIL import Image, ImageFilter
from collections import deque

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'assets', 'img')
MAX = 900   # longest side in the game build


def cutout(src, dst):
    src_im = Image.open(src)
    if src_im.mode in ('RGBA', 'LA'):
        a = src_im.convert('RGBA').split()[3]
        clear = sum(1 for v in a.getdata() if v < 40)
        if clear > a.size[0] * a.size[1] * 0.05:      # already cut out
            out = src_im.convert('RGBA'); out = out.crop(out.split()[3].getbbox())
            pad = 12
            canvas = Image.new('RGBA', (out.width + 2 * pad, out.height + 2 * pad), (0, 0, 0, 0)); canvas.paste(out, (pad, pad))
            sc = MAX / max(canvas.size)
            if sc < 1: canvas = canvas.resize((round(canvas.width * sc), round(canvas.height * sc)), Image.LANCZOS)
            canvas.save(dst, optimize=True); print('saved (kept alpha)', dst, canvas.size, os.path.getsize(dst) // 1024, 'KB'); return
    im = src_im.convert('RGB'); W, H = im.size; px = im.load()
    TOL = 34
    def isbg(p): return (255 - p[0]) + (255 - p[1]) + (255 - p[2]) < TOL * 3 and max(p) - min(p) < 22
    mask = bytearray(W * H); q = deque()
    for x in range(W):
        for y in (0, H - 1):
            if isbg(px[x, y]) and not mask[y * W + x]: mask[y * W + x] = 1; q.append((x, y))
    for y in range(H):
        for x in (0, W - 1):
            if isbg(px[x, y]) and not mask[y * W + x]: mask[y * W + x] = 1; q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < W and 0 <= ny < H and not mask[ny * W + nx] and isbg(px[nx, ny]): mask[ny * W + nx] = 1; q.append((nx, ny))
    alpha = Image.frombytes('L', (W, H), bytes(255 - 255 * m for m in mask)).filter(ImageFilter.GaussianBlur(0.8))
    out = im.convert('RGBA'); out.putalpha(alpha)
    out = out.crop(alpha.getbbox())
    pad = 12
    canvas = Image.new('RGBA', (out.width + 2 * pad, out.height + 2 * pad), (0, 0, 0, 0)); canvas.paste(out, (pad, pad))
    s = MAX / max(canvas.size)
    if s < 1: canvas = canvas.resize((round(canvas.width * s), round(canvas.height * s)), Image.LANCZOS)
    canvas.save(dst, optimize=True); print('saved', dst, canvas.size, os.path.getsize(dst) // 1024, 'KB')


def runs(row, W, thr=100):
    """x-ranges of opaque pixels in one row"""
    out = []; start = None
    for x in range(W):
        on = row[x] > thr
        if on and start is None: start = x
        elif not on and start is not None:
            if x - start > W * 0.02: out.append((start, x))
            start = None
    if start is not None and W - start > W * 0.02: out.append((start, W))
    return out


def rig(path):
    """Guess where the neck and the hips are, plus the two leg pivots (all as 0..1 fractions).
    Heuristic: hips = where the silhouette widens from the legs into the body; neck = the
    narrowest row between the head bulge and the shoulders."""
    im = Image.open(path).convert('RGBA'); W, H = im.size
    a = im.split()[3].load()
    rows = [[a[x, y] for x in range(W)] for y in range(H)]
    width = [sum(1 for v in r if v > 100) for r in rows]
    maxw = max(width) or 1

    # hips: from the feet upwards, the first row that is already as wide as the body
    hip = int(H * 0.72)
    for y in range(H - 2, int(H * 0.40), -1):
        if width[y] > 0.70 * maxw: hip = y; break
    hip = min(max(hip, int(H * 0.50)), int(H * 0.82))

    # leg pivots: centres of the two lowest separate runs (fall back to a third/two-thirds split)
    legL, legR = 0.34, 0.66
    for y in range(H - 4, hip, -1):
        r = runs(rows[y], W)
        if len(r) >= 2:
            legL = (r[0][0] + r[0][1]) / 2 / W; legR = (r[-1][0] + r[-1][1]) / 2 / W; break

    # neck: head bulge in the top third, then the narrowest row below it
    top0, top1 = int(H * 0.04), int(H * 0.38)
    peak = max(range(top0, max(top0 + 1, top1)), key=lambda y: width[y])
    neck, nw = int(H * 0.42), maxw + 1
    for y in range(peak, int(hip * 0.92)):
        if width[y] < nw: neck, nw = y, width[y]
        elif width[y] > nw * 1.30 and y - neck > H * 0.02: break
    neck = min(max(neck, int(H * 0.18)), int(hip - H * 0.12))
    return {'neck': round(neck / H, 3), 'hip': round(hip / H, 3), 'legL': round(legL, 3), 'legR': round(legR, 3)}


OVERRIDES = json.load(open(os.path.join(ROOT, 'assets', 'rigs.json'), encoding='utf-8'))


def manifest():
    m = {}
    for f in sorted(os.listdir(IMG)):
        if f.endswith('.png'):
            p = os.path.join(IMG, f)
            w, h = Image.open(p).size
            key = f[:-4]
            r = rig(p)
            if key in OVERRIDES: r = OVERRIDES[key]
            m[key] = {'src': 'assets/img/' + f, 'w': w, 'h': h, 'rig': r}
    with open(os.path.join(ROOT, 'assets', 'img-manifest.js'), 'w', encoding='utf-8') as fh:
        fh.write('/* generated by tools/cutout.py — 3D character renders + their 2D rig */\nwindow.DW = window.DW || {};\nDW.IMAGES = ' + json.dumps(m, indent=1) + ';\n')
    for k, v in m.items(): print('%-16s %sx%s  %s' % (k, v['w'], v['h'], v['rig']))


if __name__ == '__main__':
    if sys.argv[1:2] != ['--manifest']: cutout(sys.argv[1], sys.argv[2])
    manifest()
