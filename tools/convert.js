const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(repoRoot, 'reanrush', '_stitch-source');
const pagesRoot = path.join(repoRoot, 'reanrush', 'pages');
const mapPath = path.join(__dirname, 'screen-map.json');
const reportPath = path.join(__dirname, 'report.txt');

function isInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative !== '' && relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
}

function getAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const expression = new RegExp('(?:^|\\s)' + escapedName + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i');
  const match = expression.exec(tag);
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : '';
}

function decodeEntities(text) {
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, value) => {
    if (value[0] === '#') {
      const codePoint = value[1].toLowerCase() === 'x'
        ? Number.parseInt(value.slice(2), 16)
        : Number.parseInt(value.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity;
    }
    return {
      amp: '&',
      lt: '<',
      gt: '>',
      quot: '"',
      apos: "'",
      nbsp: ' '
    }[value.toLowerCase()];
  });
}

function getExternalImageUrls(html) {
  const urls = new Set();
  const imageTags = html.match(/<(?:img|source|image|video)\b[^>]*>/gi) || [];

  function addUrl(value) {
    const url = value.trim();
    if (/^https?:\/\//i.test(url)) urls.add(url);
  }

  imageTags.forEach((tag) => {
    addUrl(getAttribute(tag, 'src'));
    addUrl(getAttribute(tag, 'href'));
    addUrl(getAttribute(tag, 'xlink:href'));
    addUrl(getAttribute(tag, 'poster'));
    const srcset = getAttribute(tag, 'srcset');
    srcset.split(',').forEach((candidate) => addUrl(candidate.trim().split(/\s+/)[0] || ''));
  });

  const backgroundPattern = /background(?:-image)?\s*:[^;{}]*?url\(\s*(?:"(https?:\/\/[^\"]+)"|'(https?:\/\/[^']+)'|(https?:\/\/[^)\s]+))\s*\)/gi;
  for (const match of html.matchAll(backgroundPattern)) {
    addUrl(match[1] || match[2] || match[3] || '');
  }

  return [...urls];
}

function getPlaceholderAnchors(html) {
  const markup = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[\s\S]*?<\/script\s*>/gi, '').replace(/<style\b[\s\S]*?<\/style\s*>/gi, '');
  const anchors = [];
  const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;

  for (const match of markup.matchAll(anchorPattern)) {
    if (getAttribute(match[1], 'href') !== '#') continue;
    const linkText = decodeEntities(match[2]
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim());
    anchors.push(linkText || '(no link text)');
  }

  return anchors;
}

function main() {
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  if (!Array.isArray(map)) throw new Error('screen-map.json must contain an array.');

  const records = map.map((entry) => {
    if (!entry || typeof entry.source !== 'string' || typeof entry.target !== 'string') {
      throw new Error('Each screen-map entry must have string source and target values.');
    }

    const source = path.resolve(sourceRoot, entry.source, 'code.html');
    const target = path.resolve(pagesRoot, entry.target);
    if (!isInside(sourceRoot, source)) throw new Error('Source escapes _stitch-source: ' + entry.source);
    if (!isInside(pagesRoot, target) || path.extname(target).toLowerCase() !== '.html') {
      throw new Error('Target must be an HTML file under pages/: ' + entry.target);
    }
    if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
      throw new Error('Source code.html not found: ' + path.relative(repoRoot, source));
    }
    return { entry, source, target };
  });

  const seenTargets = new Set();
  records.forEach(({ target, entry }) => {
    if (seenTargets.has(target)) throw new Error('Duplicate target: ' + entry.target);
    seenTargets.add(target);
  });

  const report = ['ReanRush Stitch screen conversion report', ''];
  records.forEach(({ entry, source, target }) => {
    const targetExists = fs.existsSync(target);
    if (targetExists) {
      console.log('Skipped existing target: ' + path.relative(pagesRoot, target).split(path.sep).join('/'));
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target);
      console.log('Copied: ' + entry.source + '/code.html -> pages/' + entry.target);
    }

    const targetHtml = fs.readFileSync(target, 'utf8');
    const fileSize = fs.statSync(target).size;
    const externalImages = getExternalImageUrls(targetHtml);
    const placeholderAnchors = getPlaceholderAnchors(targetHtml);

    report.push('Page: pages/' + entry.target);
    report.push('Source: _stitch-source/' + entry.source + '/code.html');
    report.push('Status: ' + (targetExists ? 'skipped; target already existed' : 'copied unchanged'));
    report.push('File size: ' + fileSize + ' bytes');
    report.push('External image URLs:');
    report.push(...(externalImages.length ? externalImages.map((url) => '  - ' + url) : ['  - (none)']));
    report.push('Anchors with href="#":');
    report.push(...(placeholderAnchors.length ? placeholderAnchors.map((text) => '  - ' + text) : ['  - (none)']));
    report.push('');
  });

  fs.writeFileSync(reportPath, report.join('\n'), 'utf8');
  console.log('Wrote report: ' + path.relative(repoRoot, reportPath).split(path.sep).join('/'));
  console.log('Processed ' + records.length + ' mapped pages.');
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
