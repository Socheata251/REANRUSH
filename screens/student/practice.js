(function ($) {
  'use strict';

  var BOOKMARK_KEY = 'reanrush_bookmarks';
  var PRACTICE_STATE_KEY = 'reanrush_practice_state';
  var questions = [];
  var index = 0;
  var answered = false;
  var selected = null;
  var explanationPanel;
  var explanationCopy;
  var complete = false;

  function readJson(key, fallback) {
    try { return JSON.parse(window.localStorage.getItem(key) || 'null') || fallback; }
    catch (error) { return fallback; }
  }

  function writeJson(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); }
    catch (error) { return false; }
    return true;
  }

  function getQuestions() {
    var sets = window.ReanRushData && window.ReanRushData.battleQuestions;
    if (Array.isArray(sets)) {
      return sets.reduce(function (all, set, round) {
        return all.concat(set.map(function (item, position) {
          var choices = item.choices || item.options || [];
          return {
            id: 'practice-' + round + '-' + position,
            topic: item.topic || ['Forces & Motion', 'Energy & Heat', 'Waves & Light'][round] || 'Physics',
            question: item.question || item.prompt,
            choices: choices,
            answer: item.answer,
            explanation: item.explanation || ('' + item.answer + ' is correct. Review the principle that connects the question to this answer.')
          };
        }));
      }, []);
    }
    var fallback = window.ReanRushData && window.ReanRushData.defaultQuiz;
    return fallback && Array.isArray(fallback.questions) ? fallback.questions.map(function (item, position) {
      return { id: 'practice-default-' + position, topic: fallback.subject || 'Review', question: item.prompt, choices: item.options, answer: item.answer, explanation: item.explanation || (item.answer + ' is the correct answer.') };
    }) : [];
  }

  function updateBookmarkButton() {
    var button = document.getElementById('bookmarkBtn');
    var icon = document.getElementById('bmIcon');
    var label = document.getElementById('bmText');
    var bookmarks = readJson(BOOKMARK_KEY, []);
    var isSaved = bookmarks.some(function (record) { return record.id === questions[index].id; });
    if (icon) icon.textContent = isSaved ? 'bookmark' : 'bookmark_border';
    if (icon) icon.style.fontVariationSettings = isSaved ? "'FILL' 1" : "'FILL' 0";
    if (label) label.textContent = isSaved ? 'Saved' : 'Save';
    if (button) button.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
  }

  function setOptionState(button, state) {
    var icon = button.querySelector('.material-symbols-outlined');
    button.classList.remove('bg-[#e8f8ec]', 'border-4', 'selected-option');
    button.classList.add('bg-surface-container-lowest', 'border-2');
    button.style.backgroundColor = '';
    button.style.color = '';
    if (icon) icon.textContent = 'radio_button_unchecked';
    if (state === 'correct') {
      button.style.backgroundColor = '#2FA84F';
      button.style.color = '#fff';
      if (icon) icon.textContent = 'check_circle';
    } else if (state === 'wrong') {
      button.style.backgroundColor = '#D9382B';
      button.style.color = '#fff';
      if (icon) icon.textContent = 'cancel';
    } else if (state === 'selected') {
      button.classList.add('bg-primary-fixed', 'border-4', 'selected-option');
      button.classList.remove('bg-surface-container-lowest', 'border-2');
      if (icon) icon.textContent = 'radio_button_checked';
    }
  }

  function render() {
    if (!questions.length) return;
    complete = false;
    var question = questions[index];
    answered = false;
    selected = null;
    var title = document.getElementById('practice-question');
    if (title) title.textContent = question.question;
    var topic = document.querySelector('main .text-secondary.uppercase');
    if (topic) topic.textContent = question.topic;
    var options = document.querySelectorAll('[data-action="practice-answer"]');
    options.forEach(function (button, optionIndex) {
      var value = question.choices[optionIndex];
      button.hidden = value === undefined;
      button.setAttribute('data-choice-index', optionIndex);
      var label = button.querySelector('.font-label-bold');
      var secondary = button.querySelector('.font-body-sm, .font-body-md');
      if (label && value !== undefined) label.textContent = value;
      if (secondary) secondary.textContent = '';
      setOptionState(button, 'idle');
    });
    var correctBadge = document.getElementById('practice-correct-badge') || Array.from(document.querySelectorAll('span')).find(function (span) { return span.textContent.trim() === 'CORRECT'; });
    if (correctBadge) {
      correctBadge.id = 'practice-correct-badge';
      correctBadge.hidden = true;
      var correctIndex = question.choices.indexOf(question.answer);
      var correctOption = options[correctIndex];
      var correctLabelGroup = correctOption && (correctOption.querySelector('[class~="flex"][class~="items-center"][class~="gap-1.5"]') || correctOption.querySelector('.flex.flex-col'));
      if (correctLabelGroup) correctLabelGroup.appendChild(correctBadge);
    }
    var counter = document.querySelector('main .font-label-bold.text-label-bold.text-on-surface');
    if (counter) counter.textContent = 'Question ' + (index + 1) + ' of ' + questions.length;
    var number = document.querySelector('main .w-6.h-6.rounded-lg');
    if (number) number.textContent = 'Q' + (index + 1);
    var percent = Math.round((index / questions.length) * 100);
    var progressText = document.querySelector('main .font-label-bold.text-label-bold.text-secondary');
    if (progressText) progressText.textContent = percent + '% Complete';
    var progressTrack = document.querySelector('main .h-full.bg-secondary.rounded-full');
    if (progressTrack) progressTrack.style.width = percent + '%';
    if (explanationCopy) explanationCopy.textContent = question.explanation;
    if (explanationPanel) {
      explanationPanel.classList.add('hidden');
      explanationPanel.style.display = 'none';
    }
    var correctBadge = document.getElementById('practice-correct-badge');
    if (correctBadge) correctBadge.hidden = true;
    var nextLabel = document.querySelector('#nextBtn .font-headline-md');
    if (nextLabel) nextLabel.textContent = index === questions.length - 1 ? 'Finish Practice' : 'Next Question (' + (index + 2) + '/' + questions.length + ') →';
    updateBookmarkButton();
    writeJson(PRACTICE_STATE_KEY, { index: index });
  }

  function submitSelection() {
    if (answered || selected === null) return;
    answered = true;
    var question = questions[index];
    document.querySelectorAll('[data-action="practice-answer"]').forEach(function (button) {
      var choice = question.choices[Number(button.getAttribute('data-choice-index'))];
      if (choice === question.answer) setOptionState(button, 'correct');
      else if (Number(button.getAttribute('data-choice-index')) === selected) setOptionState(button, 'wrong');
    });
    if (explanationCopy) explanationCopy.textContent = question.explanation;
    if (explanationPanel) {
      explanationPanel.classList.remove('hidden');
      explanationPanel.style.display = '';
    }
    var correctBadge = document.getElementById('practice-correct-badge');
    if (correctBadge) correctBadge.hidden = false;
    var next = document.getElementById('nextBtn');
    if (next) next.disabled = false;
  }

  function toggleBookmark() {
    var question = questions[index];
    var bookmarks = readJson(BOOKMARK_KEY, []);
    var position = bookmarks.findIndex(function (record) { return record.id === question.id; });
    if (position >= 0) bookmarks.splice(position, 1);
    else bookmarks.push({ id: question.id, question: question.question, topic: question.topic, choices: question.choices, answer: question.answer, explanation: question.explanation, bookmarkedAt: new Date().toISOString() });
    writeJson(BOOKMARK_KEY, bookmarks);
    updateBookmarkButton();
  }

  $(function () {
    questions = getQuestions();
    var saved = readJson(PRACTICE_STATE_KEY, { index: 0 });
    index = Math.max(0, Math.min(Number(saved.index) || 0, Math.max(questions.length - 1, 0)));
    var explanationHeading = Array.from(document.querySelectorAll('span')).find(function (span) { return span.textContent.indexOf('Concept Explanation') >= 0; });
    explanationPanel = explanationHeading;
    while (explanationPanel && !(explanationPanel.classList.contains('w-full') && explanationPanel.classList.contains('p-4'))) explanationPanel = explanationPanel.parentElement;
    if (explanationPanel) {
      explanationPanel.id = 'practice-explanation';
      var copy = explanationPanel.querySelector('.space-y-2 p');
      explanationCopy = copy;
      var formula = explanationPanel.querySelector('.w-full.bg-surface-container.p-3');
      if (formula) formula.hidden = true;
      var explanationSteps = explanationPanel.querySelector('.space-y-2');
      if (explanationSteps && explanationSteps.children.length > 1) {
        Array.from(explanationSteps.children).slice(1).forEach(function (step) { step.hidden = true; });
      }
      explanationPanel.classList.add('hidden');
      explanationPanel.style.display = 'none';
    }
    document.querySelectorAll('[data-action="practice-answer"]').forEach(function (button) {
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
    });
    var next = document.getElementById('nextBtn');
    if (next) next.disabled = true;
    $(document).on('click', '[data-action="practice-answer"]', function () {
      if (answered) return;
      selected = Number(this.getAttribute('data-choice-index'));
      document.querySelectorAll('[data-action="practice-answer"]').forEach(function (button) {
        setOptionState(button, Number(button.getAttribute('data-choice-index')) === selected ? 'selected' : 'idle');
      });
      submitSelection();
    });
    $(document).on('keydown', '[data-action="practice-answer"]', function (event) {
      if ((event.key === 'Enter' || event.key === ' ') && !answered) {
        event.preventDefault();
        this.click();
      }
    });
    $(document).on('click', '[data-action="bookmark-question"]', toggleBookmark);
    $(document).on('click', '[data-action="next-practice-question"]', function () {
      if (!answered) return;
      if (complete) {
        index = 0;
        render();
        return;
      }
      if (index >= questions.length - 1) {
        complete = true;
        var title = document.getElementById('practice-question');
        if (title) title.textContent = 'Practice complete. No score recorded.';
        document.querySelectorAll('[data-action="practice-answer"]').forEach(function (button) { button.hidden = true; });
        if (explanationPanel) {
          explanationPanel.classList.add('hidden');
          explanationPanel.style.display = 'none';
        }
        var label = document.querySelector('#nextBtn .font-headline-md');
        if (label) label.textContent = 'Start Again →';
        return;
      }
      index += 1;
      render();
    });
    $(document).on('click', '[data-action="practice-back"]', function () { window.history.back(); });
    render();
  });
})(jQuery);
