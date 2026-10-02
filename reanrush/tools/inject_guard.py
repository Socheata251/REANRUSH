from pathlib import Path

roots = [Path('pages/student'), Path('pages/teacher'), Path('pages/admin')]
scripts = [
    '<script defer src="../../js/store.js"></script>',
    '<script defer src="../../js/data.js"></script>',
    '<script defer src="../../js/guard.js"></script>',
    '<script defer src="../../js/modal.js"></script>',
    '<script defer src="../../js/toast.js"></script>',
]

for root in roots:
    for html in root.glob('*.html'):
        text = html.read_text(encoding='utf-8')
        if 'js/guard.js' in text:
            continue
        if '</body>' in text:
            text = text.replace('</body>', '\n' + '\n'.join(scripts) + '\n</body>', 1)
            html.write_text(text, encoding='utf-8')
        else:
            print(f'No </body> in {html}')
