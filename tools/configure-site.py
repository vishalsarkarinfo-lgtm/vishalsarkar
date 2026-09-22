#!/usr/bin/env python3
"""Optional canonical/social/sitemap setup; does not deploy or change asset paths."""
from pathlib import Path
from urllib.parse import urlparse, urljoin
import sys, re, json, html
ROOT = Path(__file__).resolve().parents[1]
if len(sys.argv) != 2:
    raise SystemExit('Usage: python3 tools/configure-site.py https://USERNAME.github.io/REPOSITORY/')
base = sys.argv[1].strip().rstrip('/') + '/'
u = urlparse(base)
if u.scheme != 'https' or not u.netloc or u.query or u.fragment:
    raise SystemExit('Use the complete HTTPS site URL, including its repository subfolder when applicable.')
previous = (ROOT / 'site-url.txt').read_text().strip() if (ROOT / 'site-url.txt').exists() else None
urls = []
for file in sorted(ROOT.rglob('*.html')):
    if file.name == '404.html':
        continue
    rel = file.relative_to(ROOT).as_posix()
    directory = rel[:-len('index.html')] if rel.endswith('index.html') else rel
    canonical = urljoin(base, directory)
    page_url = urljoin(base, rel)
    source = file.read_text(encoding='utf-8')
    source = re.sub(r'<link\b[^>]*\brel="canonical"[^>]*>', '', source, flags=re.I)
    source = re.sub(r'<meta\b[^>]*\bproperty="og:url"[^>]*>', '', source, flags=re.I)
    source = source.replace('</head>', '<link rel="canonical" href="' + html.escape(canonical, quote=True) + '"><meta property="og:url" content="' + html.escape(canonical, quote=True) + '"></head>', 1)
    def absolute(value):
        if not isinstance(value, str):
            return value
        if previous and value.startswith(previous):
            return base + value[len(previous):]
        if value.startswith(('../', './', 'index.html', '#', 'assets/')):
            return urljoin(page_url, value)
        return value
    def image_meta(match):
        tag = match.group(0)
        return re.sub(r'content="([^"]*)"', lambda m: 'content="' + html.escape(absolute(html.unescape(m.group(1))), quote=True) + '"', tag)
    source = re.sub(r'<meta\b[^>]*(?:property="og:image"|name="twitter:image")[^>]*>', image_meta, source)
    def walk(value):
        if isinstance(value, dict):
            return {k: walk(v) for k, v in value.items()}
        if isinstance(value, list):
            return [walk(v) for v in value]
        return absolute(value)
    def schema(match):
        try:
            payload = walk(json.loads(match.group(1)))
            return '<script type="application/ld+json">' + json.dumps(payload, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + '</script>'
        except json.JSONDecodeError:
            return match.group(0)
    source = re.sub(r'<script type="application/ld\+json">(.*?)</script>', schema, source, flags=re.S)
    file.write_text(source, encoding='utf-8')
    urls.append(canonical)
xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join('  <url><loc>' + html.escape(url) + '</loc></url>\n' for url in urls) + '</urlset>\n'
(ROOT / 'sitemap.xml').write_text(xml, encoding='utf-8')
(ROOT / 'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: ' + urljoin(base, 'sitemap.xml') + '\n', encoding='utf-8')
(ROOT / 'site-url.txt').write_text(base + '\n', encoding='utf-8')
print(f'Configured {len(urls)} pages for {base}. Upload the updated files when ready.')
