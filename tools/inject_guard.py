from pathlib import Path

# Run from the reanrush/ folder:  python tools/inject_guard.py
roots = [Path('pages/student'), Path('pages/teacher'), Path('pages/admin')]
tag = '<script src="../../js/guard.js"></script>'

for root in roots:
    for html in sorted(root.glob('*.html')):
        text = html.read_text(encoding='utf-8')
        if 'js/guard.js' in text:
            continue
        if '</body>' in text:
            text = text.replace('</body>', '\n' + tag + '\n</body>', 1)
            html.write_text(text, encoding='utf-8')
            print('guarded', html)
        else:
            print('No </body> in', html)
