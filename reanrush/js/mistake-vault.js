(function ($) {
  'use strict';

  var VAULT_KEY = 'reanrush_mistake_vault';
  var BOOKMARK_KEY = 'reanrush_bookmarks';
  var activeFilter = 'all';
  var records = [];
  var template;
  var list;
  var filters;

  function readJson(key, fallback) {
    try {
      return JSON.parse(window.localStorage.getItem(key) || 'null') || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return false;
    }
    return true;
  }

  function normalize(item, index) {
    var question = item.question || item.prompt || item.title || 'Review this missed question';
    return {
      id: item.id || (item.answeredAt ? item.answeredAt + ':' + question : 'mistake-' + index + ':' + question),
      question: question,
      topic: item.topic || item.subject || item.round || item.category || 'General',
      choices: Array.isArray(item.choices) ? item.choices : (Array.isArray(item.options) ? item.options : []),
      picked: item.picked || item.selected || item.selectedAnswer || '',
      answer: item.answer || item.correctAnswer || item.correctText || '',
      explanation: item.explanation || item.detail || ('Review why "' + (item.answer || item.correctAnswer || 'the correct choice') + '" is correct.'),
      savedAt: item.savedAt || item.answeredAt || '',
      bookmarked: !!item.bookmarked
    };
  }

  function loadRecords() {
    var rawVault = window.localStorage.getItem(VAULT_KEY);
    if (rawVault !== null) {
      var persisted = [];
      try { persisted = JSON.parse(rawVault) || []; } catch (error) { persisted = []; }
      records = Array.isArray(persisted) ? persisted.map(function (item, index) { return normalize(item, index); }) : [];
      writeJson(VAULT_KEY, records);
      return;
    }
    var history = readJson('answers', readJson('reanrush_answers', []));
    var merged = [];
    var ids = {};
    merged.forEach(function (item, index) {
      var record = normalize(item, index);
      ids[record.id] = true;
    });
    if (Array.isArray(history)) {
      history.forEach(function (item, index) {
        if (item.isCorrect === false || item.correct === false) {
          var record = normalize(item, index);
          if (!ids[record.id]) {
            merged.push(record);
            ids[record.id] = true;
          }
        }
      });
    }
    records = merged.map(function (item, index) { return normalize(item, index); });
    writeJson(VAULT_KEY, records);
  }

  function getBookmarks() {
    var saved = readJson(BOOKMARK_KEY, []);
    return Array.isArray(saved) ? saved : [];
  }

  function isBookmarked(record) {
    return getBookmarks().some(function (item) { return item.id === record.id; });
  }

  function topicOf(record) {
    return record.topic || 'General';
  }

  function createFilters() {
    if (filters) filters.remove();
    filters = document.createElement('div');
    filters.id = 'vault-filters';
    filters.className = 'flex flex-wrap items-center gap-space-xs mb-space-md';
    var topics = ['all'].concat(Array.from(new Set(records.map(topicOf))));
    topics.forEach(function (topic) {
      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-action', 'filter-topic');
      button.setAttribute('data-filter', topic);
      button.className = 'filter-pill px-space-sm py-space-xs rounded-lg border-2 border-primary font-label-bold text-label-bold shadow-[2px_2px_0_#00163a]';
      button.textContent = topic === 'all' ? 'All topics' : topic;
      setFilterStyle(button, topic === activeFilter);
      filters.appendChild(button);
    });
    template.parentNode.insertBefore(filters, template);
  }

  function setFilterStyle(button, selected) {
    button.classList.toggle('bg-primary', selected);
    button.classList.toggle('text-surface-container-lowest', selected);
    button.classList.toggle('bg-surface-container-lowest', !selected);
    button.classList.toggle('text-primary', !selected);
  }

  function makeCard(record) {
    var card = template.cloneNode(true);
    card.removeAttribute('id');
    card.classList.remove('hidden');
    card.style.display = '';
    card.setAttribute('data-mistake-id', record.id);
    card.setAttribute('data-subject', topicOf(record));

    var labels = card.querySelectorAll('.inline-flex');
    if (labels.length) labels[0].textContent = topicOf(record);
    var title = card.querySelector('h3');
    if (title) title.textContent = record.question;
    var prompt = card.querySelector('h3 + p');
    if (prompt) prompt.textContent = record.picked ? 'Your answer: ' + record.picked : '';

    var answerButton = card.querySelector('.toggle-answer-btn');
    var answerBox = card.querySelector('.answer-box');
    var answerLines = answerBox ? answerBox.querySelectorAll('.font-label-bold, .font-body-sm') : [];
    if (answerLines[0]) answerLines[0].textContent = 'Correct: ' + record.answer;
    if (answerLines[1]) answerLines[1].textContent = record.explanation;
    if (answerButton) answerButton.setAttribute('data-action', 'toggle-answer');
    if (answerBox) {
      answerBox.classList.add('hidden');
      answerBox.style.display = 'none';
    }

    var actionButtons = card.querySelectorAll('.flex.items-center.gap-space-xs > button');
    if (actionButtons[0]) {
      actionButtons[0].setAttribute('data-action', 'remove-mistake');
      actionButtons[0].textContent = 'Remove';
    }
    if (actionButtons[1]) {
      actionButtons[1].setAttribute('data-action', 'bookmark-mistake');
      actionButtons[1].textContent = isBookmarked(record) ? 'Bookmarked' : 'Bookmark';
    }
    var missedAt = card.querySelector('.pt-space-xs > span');
    if (missedAt) missedAt.textContent = record.savedAt ? 'Missed ' + new Date(record.savedAt).toLocaleDateString() : 'Missed recently';
    return card;
  }

  function render() {
    list.querySelectorAll('.question-card[data-mistake-id]').forEach(function (card) { card.remove(); });
    var visible = records.filter(function (record) { return activeFilter === 'all' || topicOf(record) === activeFilter; });
    visible.forEach(function (record) { list.appendChild(makeCard(record)); });
    var emptyMessage = document.getElementById('vault-empty-message');
    if (!visible.length) {
      if (!emptyMessage) {
        emptyMessage = document.createElement('p');
        emptyMessage.id = 'vault-empty-message';
        emptyMessage.className = 'p-space-md rounded-xl bg-surface-container-low text-primary font-label-bold';
        list.appendChild(emptyMessage);
      }
      emptyMessage.textContent = records.length ? 'No missed questions in this topic.' : 'Your Mistake Vault is empty. Finish a battle with a missed answer to add one.';
      emptyMessage.style.display = '';
    } else if (emptyMessage) {
      emptyMessage.remove();
    }
    var emptyPreview = document.getElementById('vault-empty-preview');
    if (emptyPreview) {
      emptyPreview.classList.toggle('hidden', records.length > 0);
      emptyPreview.style.display = records.length > 0 ? 'none' : '';
    }
    var launcher = document.getElementById('main-revenge-btn');
    if (launcher) launcher.disabled = records.length === 0;
  }

  function persistAndRender() {
    writeJson(VAULT_KEY, records);
    createFilters();
    render();
  }

  $(function () {
    template = document.querySelector('.question-card');
    if (!template) return;
    template.id = 'vault-card-template';
    template.classList.add('hidden');
    template.style.display = 'none';
    list = template.parentNode;
    loadRecords();

    var launcher = Array.from(document.querySelectorAll('button')).find(function (button) {
      return button.textContent.indexOf('Launch Revenge Round') >= 0;
    });
    if (launcher) {
      launcher.id = 'main-revenge-btn';
      launcher.setAttribute('data-action', 'start-revenge');
    }
    var emptyPreview = Array.from(document.querySelectorAll('div')).find(function (element) {
      return element.children.length && element.textContent.indexOf('EMPTY STATE PREVIEW') >= 0;
    });
    if (emptyPreview) {
      emptyPreview.id = 'vault-empty-preview';
      emptyPreview.classList.toggle('hidden', records.length > 0);
      emptyPreview.style.display = records.length > 0 ? 'none' : '';
    }

    $(document).on('click', '[data-action="filter-topic"]', function () {
      activeFilter = this.getAttribute('data-filter') || 'all';
      filters.querySelectorAll('[data-action="filter-topic"]').forEach(function (button) { setFilterStyle(button, button.getAttribute('data-filter') === activeFilter); });
      render();
    });
    $(document).on('click', '[data-action="toggle-answer"]', function () {
      var card = this.closest('.question-card');
      var box = card && card.querySelector('.answer-box');
      if (!box) return;
      var hidden = box.classList.toggle('hidden');
      box.style.display = hidden ? 'none' : '';
      var label = this.querySelector('.btn-label');
      if (label) label.textContent = hidden ? '👁️ Click to Reveal Correct Answer / ចុចបង្ហាញចម្លើយត្រូវ' : '👁️ Hide Correct Answer / បិទចម្លើយ';
    });
    $(document).on('click', '[data-action="remove-mistake"]', function () {
      var id = this.closest('[data-mistake-id]').getAttribute('data-mistake-id');
      records = records.filter(function (item) { return item.id !== id; });
      persistAndRender();
    });
    $(document).on('click', '[data-action="bookmark-mistake"]', function () {
      var card = this.closest('[data-mistake-id]');
      var record = records.find(function (item) { return item.id === card.getAttribute('data-mistake-id'); });
      if (!record) return;
      var bookmarks = getBookmarks();
      var index = bookmarks.findIndex(function (item) { return item.id === record.id; });
      if (index >= 0) bookmarks.splice(index, 1);
      else bookmarks.push(record);
      writeJson(BOOKMARK_KEY, bookmarks);
      this.textContent = index >= 0 ? 'Bookmark' : 'Bookmarked';
    });
    $(document).on('click', '[data-action="start-revenge"]', function () {
      if (!records.length) return;
      writeJson('reanrush_revenge_session', { ids: records.map(function (item) { return item.id; }), startedAt: Date.now() });
      window.location.href = 'revenge-round.html';
    });

    createFilters();
    render();
  });
})(jQuery);
