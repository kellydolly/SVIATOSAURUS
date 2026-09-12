"""Build a contact sheet of Canva candidate thumbnails: python tools/pick.py <url1> <url2> ...
Open http://localhost:8765/_pick.html to review them in one screenshot."""
import sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
urls = sys.argv[1:]
cells = ''.join('<div class="c"><img src="%s"><b>%d</b></div>' % (u, i + 1) for i, u in enumerate(urls))
open(os.path.join(ROOT, '_pick.html'), 'w', encoding='utf-8').write(
 '<!doctype html><meta charset=utf-8><style>body{margin:0;background:#eef;display:grid;grid-template-columns:1fr 1fr;gap:4px}'
 '.c{position:relative;background:#fff}.c img{width:100%;display:block}'
 'b{position:absolute;left:6px;top:6px;background:#000;color:#fff;font:20px sans-serif;padding:2px 10px;border-radius:8px}</style>' + cells)
print('ok', len(urls))
