// Small helpers that make the quiz screens work as a prototype:
//   quiz-creator.html  - add / duplicate / delete / select questions, save quiz, open AI assistant
//   ai-assistant.html  - topic chips, character counter, question count, generate (with progress)
//   review-ai.html     - "Add to Quiz" goes back to the quiz creator
// There is no real AI or database yet. Real generation and saving will come from ASP.NET later.
(function () {
  'use strict';
  var page = (window.location.pathname.split('/').pop() || '').replace('.html', '');
  var MAX_QUESTIONS = 15;

  function toast(msg, type) { if (window.showToast) window.showToast(msg, type); }
  function text(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function find(selector, contains) {
    return Array.prototype.filter.call(document.querySelectorAll(selector), function (el) {
      return text(el).indexOf(contains) !== -1;
    });
  }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
  function go(url, delay) { window.setTimeout(function () { window.location.href = url; }, delay || 0); }

  // ---------------- quiz-creator ----------------
  function quizCreator() {
    var addBtn = find('button', 'Add Question')[0];
    var firstArticle = addBtn && addBtn.closest('aside') && addBtn.closest('aside').querySelector('article');
    var list = firstArticle && firstArticle.parentNode;
    if (!list) return;
    var counter = Array.prototype.filter.call(addBtn.closest('aside').querySelectorAll('span'), function (s) { return /^\d+\s*\/\s*\d+$/.test(text(s)); })[0];
    var ACTIVE = ['ring-2', 'ring-secondary/30'];

    function items() { return Array.prototype.slice.call(list.querySelectorAll(':scope > article')); }
    function current() { return items().filter(function (a) { return a.classList.contains('ring-2'); })[0] || items()[0]; }
    function select(article) {
      items().forEach(function (a) { ACTIVE.forEach(function (c) { a.classList.toggle(c, a === article); }); });
      if (article && article.scrollIntoView) article.scrollIntoView({ block: 'nearest' });
    }
    function refresh() {
      items().forEach(function (a, i) {
        var label = a.querySelector('.font-badge-arcade');
        if (label) label.textContent = label.textContent.replace(/#\d+/, '#' + String(i + 1).padStart(2, '0'));
      });
      if (counter) counter.textContent = items().length + ' / ' + MAX_QUESTIONS;
    }
    function clone(source, blank) {
      var copy = source.cloneNode(true);
      ACTIVE.forEach(function (c) { copy.classList.remove(c); });
      if (blank) {
        var prompt = copy.querySelector('p');
        if (prompt) prompt.textContent = 'New question - tap to write the prompt';
      }
      return copy;
    }

    items().forEach(function (a) { a.style.cursor = 'pointer'; });
    list.addEventListener('click', function (e) {
      var a = e.target.closest('article');
      if (a && a.parentNode === list) select(a);
    });

    addBtn.addEventListener('click', function () {
      if (items().length >= MAX_QUESTIONS) { toast('A deck can have up to ' + MAX_QUESTIONS + ' questions.', 'error'); return; }
      var last = items()[items().length - 1];
      var fresh = clone(last, true);
      list.appendChild(fresh); refresh(); select(fresh);
      toast('Question added.');
    });

    find('button', 'Duplicate').forEach(function (b) {
      b.addEventListener('click', function () {
        if (items().length >= MAX_QUESTIONS) { toast('A deck can have up to ' + MAX_QUESTIONS + ' questions.', 'error'); return; }
        var cur = current(); var copy = clone(cur, false);
        cur.parentNode.insertBefore(copy, cur.nextSibling); refresh(); select(copy);
        toast('Question duplicated.');
      });
    });

    find('button', 'Delete').forEach(function (b) {
      b.addEventListener('click', function () {
        var all = items();
        if (all.length <= 1) { toast('A quiz needs at least 1 question.', 'error'); return; }
        var cur = current(); var i = all.indexOf(cur);
        cur.parentNode.removeChild(cur); refresh();
        var left = items(); select(left[Math.min(i, left.length - 1)]);
        toast('Question deleted.');
      });
    });

    function step(delta) {
      var all = items(); var i = all.indexOf(current()) + delta;
      if (i < 0 || i >= all.length) { toast(delta < 0 ? 'This is the first question.' : 'This is the last question.'); return; }
      select(all[i]);
    }
    find('button', 'Previous Q').forEach(function (b) { b.addEventListener('click', function () { step(-1); }); });
    find('button', 'Next Question').forEach(function (b) { b.addEventListener('click', function () { step(1); }); });

    find('button', 'AI Assistant').forEach(function (b) { b.addEventListener('click', function () { go('ai-assistant.html'); }); });

    find('button', 'Save Quiz').forEach(function (b) {
      b.removeAttribute('data-go');
      b.addEventListener('click', function () {
        save('reanrush_saved_quiz', { questions: items().length, savedAt: new Date().toISOString() });
        toast('Quiz saved (' + items().length + ' questions).');
        go('dashboard.html', 800);
      });
    });

    refresh();
  }

  // ---------------- ai-assistant ----------------
  function aiAssistant() {
    var input = document.getElementById('ai-prompt-input');
    var genBtn = find('button', 'Generate')[0];
    var count = 10;
    if (!genBtn) return;
    var genLabel = genBtn.querySelectorAll('span')[1];

    // topic chips
    ["Newton's 2nd Law", "Lenz's Direction Rule", 'Photoelectric Effect'].forEach(function (name) {
      find('button', name).forEach(function (b) {
        b.addEventListener('click', function () { if (input) { input.value = name; input.dispatchEvent(new Event('input')); input.focus(); } });
      });
    });

    // character counter
    var counter = Array.prototype.filter.call(document.querySelectorAll('span'), function (s) { return /characters/.test(text(s)) && /\d/.test(text(s)); })[0];
    function updateCounter() {
      if (!input || !counter) return;
      counter.textContent = counter.textContent.replace(/[\d,]+\s*\/\s*[\d,]+/, input.value.length.toLocaleString() + ' / 1,000');
    }
    if (input) { input.setAttribute('maxlength', '1000'); input.addEventListener('input', updateCounter); updateCounter(); }

    // question count buttons (5 / 10 / 15)
    var countBtns = Array.prototype.filter.call(document.querySelectorAll('button'), function (b) { return /^(5|10|15)( ✓)?$/.test(text(b)); });
    var selectedClass = '';
    countBtns.forEach(function (b) { if (/✓/.test(text(b))) selectedClass = b.className; });
    var plainClass = (countBtns.filter(function (b) { return !/✓/.test(text(b)); })[0] || {}).className || '';
    countBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        count = parseInt(text(b), 10);
        countBtns.forEach(function (o) {
          var n = parseInt(text(o), 10); var on = n === count;
          o.textContent = on ? n + ' ✓' : String(n);
          if (selectedClass && plainClass) o.className = on ? selectedClass : plainClass;
        });
        if (genLabel) genLabel.textContent = genLabel.textContent.replace(/Generate \d+ Questions/, 'Generate ' + count + ' Questions');
      });
    });

    // progress card: hidden until generating
    var bar = document.querySelector('.bg-gradient-to-r.from-secondary-container');
    var card = bar && bar.closest('.rounded-2xl');
    var msg = card && Array.prototype.filter.call(card.querySelectorAll('span'), function (s) { return /ready!/.test(text(s)); })[0];
    var eta = card && Array.prototype.filter.call(card.querySelectorAll('span'), function (s) { return /Estimated time/.test(text(s)); })[0];
    if (card) card.style.display = 'none';

    var busy = false;
    genBtn.addEventListener('click', function () {
      if (busy) return;
      var topic = input ? input.value.trim() : '';
      if (!topic) { toast('Please type a topic first.', 'error'); if (input) input.focus(); return; }
      busy = true; genBtn.disabled = true; genBtn.style.opacity = '0.7';
      if (card) card.style.display = '';
      var done = 0; var total = count;
      var timer = window.setInterval(function () {
        done += 1;
        if (bar) bar.style.width = Math.round(done / total * 100) + '%';
        if (msg) msg.lastChild.textContent = ' Question ' + done + ' of ' + total + ' ready!';
        if (eta) eta.textContent = 'Estimated time remaining: ~' + Math.max(0, Math.round((total - done) * 0.25)) + 's';
        if (done >= total) {
          window.clearInterval(timer);
          save('reanrush_ai_request', { topic: topic, count: total, at: new Date().toISOString() });
          toast(total + ' questions ready to review.');
          go('review-ai.html', 700);
        }
      }, 250);
    });

    // leave the AI drawer
    find('button[aria-label^="Close AI"]', '').forEach(function (b) { b.addEventListener('click', function () { go('quiz-creator.html'); }); });
    find('div', '+ Add Question Manually').filter(function (d) { return d.children.length === 2 && d.className.indexOf('border-dashed') !== -1; })
      .forEach(function (d) { d.style.cursor = 'pointer'; d.addEventListener('click', function () { go('quiz-creator.html'); }); });
  }

  // ---------------- review-ai ----------------
  function reviewAi() {
    find('button', 'Add to Quiz').forEach(function (b) {
      b.removeAttribute('onclick');
      b.addEventListener('click', function () {
        var n = document.querySelectorAll('.card-select-checkbox:checked').length;
        if (!n) { toast('Select at least 1 question first.', 'error'); return; }
        save('reanrush_review_added', { questions: n, at: new Date().toISOString() });
        toast(n + ' questions added to your quiz.');
        go('quiz-creator.html', 800);
      });
    });
  }

  function init() {
    if (page === 'quiz-creator') quizCreator();
    else if (page === 'ai-assistant') aiAssistant();
    else if (page === 'review-ai') reviewAi();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();