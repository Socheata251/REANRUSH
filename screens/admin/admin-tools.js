// Makes the admin dashboard, reported and settings screens work as a prototype.
// There is no database yet: counts and rows change on the page only.
(function () {
  'use strict';
  var page = (window.location.pathname.split('/').pop() || '').replace('.html', '');

  function toast(msg, type) { if (window.showToast) window.showToast(msg, type); }
  function text(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function buttons() { return Array.prototype.slice.call(document.querySelectorAll('button')); }
  function find(contains, root) {
    return Array.prototype.filter.call((root || document).querySelectorAll('button'), function (b) { return text(b).indexOf(contains) !== -1; });
  }
  function go(url, delay) { window.setTimeout(function () { window.location.href = url; }, delay || 0); }

  // Filter chips: clicking one makes it look active (swaps classes with the active one).
  function radio(group) {
    if (group.length < 2) return;
    var counts = {};
    group.forEach(function (b) { counts[b.className] = (counts[b.className] || 0) + 1; });
    var active = group.filter(function (b) { return counts[b.className] === 1; })[0];
    var plain = group.filter(function (b) { return b !== active; })[0];
    if (!active || !plain) return;
    var on = active.className, off = plain.className;
    group.forEach(function (b) {
      b.addEventListener('click', function () {
        group.forEach(function (o) { o.className = o === b ? on : off; });
      });
    });
  }
  function chipsLike(re) { return buttons().filter(function (b) { return re.test(text(b)); }); }

  // Change a "(n)" count inside a chip, e.g. "Pending Review (4)".
  function bump(prefix, delta) {
    find(prefix).forEach(function (b) {
      var m = text(b).match(/\((\d+)\)/);
      if (!m) return;
      var n = Math.max(0, parseInt(m[1], 10) + delta);
      var node = Array.prototype.filter.call(b.childNodes, function (c) { return c.nodeType === 3 && /\(\d+\)/.test(c.nodeValue); })[0];
      if (node) node.nodeValue = node.nodeValue.replace(/\(\d+\)/, '(' + n + ')');
    });
  }

  function dashboard() {
    find('Detailed Cohort').forEach(function (b) { b.addEventListener('click', function () { go('users.html'); }); });
    find('Live Arena Monitor').forEach(function (b) { b.addEventListener('click', function () { go('live-games.html'); }); });
    find('View Cloud Cluster Metrics').forEach(function (b) { b.addEventListener('click', function () { go('ai-usage.html'); }); });
    find('EXPORT SYSTEM AUDIT').forEach(function (b) { b.addEventListener('click', function () { toast('Opening the audit trail...'); go('activity-log.html', 600); }); });
    find('SCALE CLUSTER NOW').forEach(function (b) { b.addEventListener('click', function () { toast('Scale request sent (demo only).'); }); });

    var actions = { 'Inspect': null, 'Dismiss': 'Report dismissed.', 'Fix / Remove': 'Question fixed or removed.', 'Reset Name': 'Player name reset.',
      'Unpublish': 'Quiz unpublished.', 'AI Polish': 'AI polish requested.', 'Notify Author': 'Author notified.' };
    buttons().forEach(function (b) {
      var row = b.closest('tr'); if (!row) return;
      var label = text(b).replace(/^[a-z_]+ (?=[A-Z])/, '');
      if (!(label in actions)) return;
      b.addEventListener('click', function () {
        if (label === 'Inspect') { go('reported.html'); return; }
        row.parentNode.removeChild(row);
        bump('All (', -1); bump('Pending Review (', -1);
        if (label !== 'Dismiss') bump('Action Taken (', 1);
        toast(actions[label]);
      });
    });
    radio(chipsLike(/^(All|Pending Review|Action Taken) \(\d+\)$/));
  }

  function reported() {
    var done = { 'Keep Quiz': 'Report dismissed. The quiz stays online.', 'Warn Teacher': 'Warning sent to the teacher / author.', 'Remove Quiz': 'Quiz removed and hidden.' };
    Object.keys(done).forEach(function (key) {
      find(key).forEach(function (b) {
        b.addEventListener('click', function () { bump('Pending Review (', -1); bump('Resolved (', 1); toast(done[key]); });
      });
    });
    radio(chipsLike(/^(All|Pending Review|Academic Error|Vulgar\/Offensive|Resolved) \(\d+\)$/));
    find('Sync Reports').forEach(function (b) { b.addEventListener('click', function () { toast('Reports are up to date.'); }); });
    find('more forbidden entries').forEach(function (b) { b.addEventListener('click', function () { toast('The full word list needs the database (not in this demo).'); }); });
    // remove a forbidden word (also works for words added with the + button)
    document.addEventListener('click', function (e) {
      var x = e.target.closest && e.target.closest('button[title="Remove filter"]');
      if (!x) return;
      var chip = x.closest('span'); if (chip && chip.parentNode) chip.parentNode.removeChild(chip);
      toast('Word removed from the filter.');
    });
  }

  function settings() {
    radio(chipsLike(/^\d+ MB( Rec\.)?$/));
    radio(chipsLike(/^\d+s$/));
  }

  function init() {
    if (page === 'dashboard') dashboard();
    else if (page === 'reported') reported();
    else if (page === 'settings') settings();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();