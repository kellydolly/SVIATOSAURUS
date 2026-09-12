"""Download an exported Canva PNG and cut it out: python tools/fetch.py <id> "<url>" """
import sys, os, urllib.request, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
name, url = sys.argv[1], sys.argv[2]
raw = os.path.join(ROOT, 'tools', '_canva', name + '_raw.png')
os.makedirs(os.path.dirname(raw), exist_ok=True)
urllib.request.urlretrieve(url, raw)
print('raw', os.path.getsize(raw) // 1024, 'KB')
subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'cutout.py'), raw, os.path.join(ROOT, 'assets', 'img', name + '.png')], check=True)
