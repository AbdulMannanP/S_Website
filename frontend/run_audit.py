"""
Full Frontend Audit Script
Checks: HTML structure, mobile responsiveness, security, SEO, 
        accessibility, performance markers, broken references, 
        Alpine.js correctness, and dead code.
"""
import re, os, json

ROOT = 'd:/Saeed Furniture/frontend'
FILES = {
    'index.html':               os.path.join(ROOT, 'index.html'),
    'auth.html':                os.path.join(ROOT, 'auth.html'),
    'majlis.html':              os.path.join(ROOT, 'majlis.html'),
    'kitchen.html':             os.path.join(ROOT, 'kitchen.html'),
    'bedroom.html':             os.path.join(ROOT, 'bedroom.html'),
    'cot.html':                 os.path.join(ROOT, 'cot.html'),
    'almirah.html':             os.path.join(ROOT, 'almirah.html'),
    'dashboard/admin.html':     os.path.join(ROOT, 'dashboard/admin.html'),
    'dashboard/client.html':    os.path.join(ROOT, 'dashboard/client.html'),
    'dashboard/production.html':os.path.join(ROOT, 'dashboard/production.html'),
}

IMAGES_DIR = os.path.join(ROOT, 'images')
JS_DIR     = os.path.join(ROOT, 'js')

report = {}

for fname, fpath in FILES.items():
    if not os.path.exists(fpath):
        report[fname] = ['FILE MISSING']
        continue

    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
        raw = f.read()
    lines = raw.splitlines()
    issues = []

    # ── STRUCTURE ────────────────────────────────────────────────────────
    doctype_count = raw.count('<!DOCTYPE html>')
    if doctype_count != 1:
        issues.append(f'[STRUCT] DOCTYPE count = {doctype_count} (expected 1)')
    
    head_count = raw.count('</head>')
    if head_count != 1:
        issues.append(f'[STRUCT] </head> count = {head_count}')

    body_count = raw.count('<body')
    if body_count != 1:
        issues.append(f'[STRUCT] <body> count = {body_count}')

    # ── HTML TAG BALANCE ─────────────────────────────────────────────────
    import html.parser
    class TagChecker(html.parser.HTMLParser):
        def __init__(self):
            super().__init__()
            self.stack = []
            self.errs  = []
            self.void  = {'img','br','hr','input','link','meta','source',
                          'area','base','col','embed','param','track','wbr','path',
                          'circle','line','polygon','rect','polyline','ellipse'}
        def handle_starttag(self, tag, attrs):
            if tag not in self.void: self.stack.append(tag)
        def handle_endtag(self, tag):
            if tag in self.void: return
            if not self.stack: self.errs.append(f'Unmatched </{tag}>')
            elif self.stack[-1] != tag:
                self.errs.append(f'Mismatch: expected </{self.stack[-1]}> got </{tag}>')
            else: self.stack.pop()
    
    tc = TagChecker()
    tc.feed(raw)
    if tc.errs:
        for e in tc.errs[:3]: issues.append(f'[STRUCT] {e}')
    if tc.stack:
        issues.append(f'[STRUCT] Unclosed tags: {tc.stack[-5:]}')

    # ── SEO ──────────────────────────────────────────────────────────────
    if '<title>' not in raw and '<title ' not in raw:
        issues.append('[SEO] Missing <title>')
    if 'name="description"' not in raw:
        issues.append('[SEO] Missing meta description')
    if 'og:title' not in raw and fname == 'index.html':
        issues.append('[SEO] Missing og:title (index.html)')
    h1_count = len(re.findall(r'<h1[\s>]', raw, re.I))
    if h1_count == 0:
        issues.append('[SEO] No <h1> found')
    elif h1_count > 1:
        issues.append(f'[SEO] Multiple <h1> tags: {h1_count}')

    # ── SECURITY ─────────────────────────────────────────────────────────
    if 'window.location.href' not in raw and fname in ('dashboard/admin.html','dashboard/production.html'):
        issues.append('[SEC] No RBAC redirect found')
    if 'SUPABASE_KEY' in raw or 'eyJ' in raw:
        issues.append('[SEC] Possible exposed API key in source')
    if fname == 'auth.html' and 'https://' not in raw:
        issues.append('[SEC] auth.html has no HTTPS endpoints')

    # ── MOBILE / RESPONSIVE ───────────────────────────────────────────────
    # Large py/px without mobile override
    big_padding = re.findall(r'(?<!\w:)py-(?:32|28|24)(?!\s)', raw)
    if big_padding:
        issues.append(f'[MOBILE] Large vertical padding without mobile override: {set(big_padding)}')
    
    # Inputs without 16px base font (iOS zoom)
    for i, line in enumerate(lines):
        if re.search(r'<input|<textarea', line, re.I):
            if 'text-sm' in line and 'text-base' not in line and 'text-[16' not in line:
                issues.append(f'[MOBILE] L{i+1}: Input font < 16px (iOS auto-zoom): {line.strip()[:80]}')
                break

    # Fixed widths that might overflow
    fixed_wide = re.findall(r'(?<!max-)(?<!min-)w-\[([6-9]\d\d|[1-9]\d{3})px\]', raw)
    if fixed_wide:
        issues.append(f'[MOBILE] Fixed px widths that may overflow: {set(fixed_wide[:3])}')

    # ── ACCESSIBILITY ──────────────────────────────────────────────────────
    # Buttons without aria-label or visible text (approx)
    icon_btns = re.findall(r'<button[^>]*>[\s\n]*<svg', raw)
    icon_btns_no_aria = [b for b in icon_btns if 'aria-label' not in b]
    if icon_btns_no_aria:
        issues.append(f'[A11Y] {len(icon_btns_no_aria)} icon-only button(s) without aria-label')
    
    # Images without alt
    imgs_no_alt = re.findall(r'<img(?![^>]*alt=)[^>]*>', raw)
    if imgs_no_alt:
        issues.append(f'[A11Y] {len(imgs_no_alt)} <img> missing alt attribute')

    # ── PERFORMANCE ──────────────────────────────────────────────────────
    # Large inline SVG paths (could be icon sprites)
    large_svgs = re.findall(r'<svg[^>]*>(?:.|\n){500,}?</svg>', raw)
    if len(large_svgs) > 5:
        issues.append(f'[PERF] {len(large_svgs)} large inline SVGs (consider sprites)')
    
    # No lazy loading on below-fold images
    eager_imgs = re.findall(r'<img(?![^>]*loading=)[^>]*>', raw)
    if len(eager_imgs) > 3:
        issues.append(f'[PERF] {len(eager_imgs)} <img> without loading attribute')

    # External scripts without defer/async
    sync_scripts = re.findall(r'<script src=[^>]*(?<!defer)(?<!async)>', raw)
    if sync_scripts:
        issues.append(f'[PERF] {len(sync_scripts)} render-blocking <script> (no defer/async)')

    # ── ALPINE.JS ─────────────────────────────────────────────────────────
    if 'x-cloak' in raw and '[x-cloak]' not in raw and fname == 'index.html':
        # Check if [x-cloak] is in the CSS (could be in dist/output.css)
        pass  # acceptable if in external CSS
    
    # x-show without x-cloak (potential FOUC)
    xshow_count = len(re.findall(r'x-show=', raw))
    xcloak_count = len(re.findall(r'x-cloak', raw))
    if xshow_count > 3 and xcloak_count == 0:
        issues.append(f'[ALPINE] {xshow_count} x-show directives but 0 x-cloak (FOUC risk)')

    # ── DEAD CODE / LEFTOVER ──────────────────────────────────────────────
    if 'TODO' in raw or 'FIXME' in raw or 'HACK' in raw:
        todos = re.findall(r'(?:TODO|FIXME|HACK)[^\n]{0,60}', raw)
        issues.append(f'[DEBT] {len(todos)} TODO/FIXME/HACK comments')
    
    if 'console.log' in raw:
        count_logs = raw.count('console.log')
        issues.append(f'[DEBT] {count_logs} console.log() left in production code')

    # ── BROKEN ASSET REFS ────────────────────────────────────────────────
    local_src = re.findall(r'(?:src|href)=["\'](?!http|//|#|data:|mailto)([^"\']+)["\']', raw)
    missing = []
    for ref in local_src:
        # Skip CSS classes, fragments, JS paths that start with /
        if ref.startswith('/dist/') or ref.startswith('/js/') or ref.startswith('#'): continue
        if ref.endswith('.js') or ref.endswith('.css'): continue
        full = os.path.join(ROOT, ref.lstrip('/'))
        if not os.path.exists(full) and 'imagekit' not in ref.lower():
            missing.append(ref)
    if missing:
        issues.append(f'[ASSET] {len(missing)} potentially missing local asset refs: {missing[:3]}')

    report[fname] = issues if issues else ['OK — no issues found']

# ── Print Report ──────────────────────────────────────────────────────────────
print('=' * 70)
print('  SAEED FURNITURE — FRONTEND AUDIT REPORT')
print('=' * 70)
total_issues = 0
for fname, issues in sorted(report.items()):
    ok = all(i.startswith('OK') for i in issues)
    status = 'PASS' if ok else f'{len(issues)} ISSUE(S)'
    print(f'\n[{status}] {fname}')
    if not ok:
        for issue in issues:
            print(f'   ↳ {issue}')
            total_issues += 1

print('\n' + '=' * 70)
print(f'  TOTAL ISSUES: {total_issues}')
print('=' * 70)
