(function ($) {
  'use strict';

  var VAULT_KEY = 'reanrush_mistake_vault';
  var SESSION_KEY = 'reanrush_revenge_session';
  var RESULTS_KEY = 'reanrush_revenge_summary';
  var TOTAL_SECONDS = 180;
  var records = [];
  var results = [];
  var index = 0;
  var selected = null;
  var secondsLeft = TOTAL_SECONDS;
  var timerId = null;
  var hintUsed = false;

  function readJson(key, fallback) {
    try { return JSON.parse(window.localStorage.getItem(key) || 'null') || fallback; }
    catch (error) { return fallback; }
  }

  function writeJson(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); }
    catch (error) { return false; }
    return true;
  }

  function getVault() {
    var storedVault = window.localStorage.getItem(VAULT_KEY);
    if (storedVault !== null) {
      try {
        var storedRecords = JSON.parse(storedVault);
        return Array.isArray(storedRecords) ? storedRecords : [];
      } catch (error) {
        return [];
      }
    }
    var saved = readJson(VAULT_KEY, []);
    if (Array.isArray(saved) && saved.length) return saved;
    var answers = readJson('answers', readJson('reanrush_answers', []));
    return Array.isArray(answers) ? answers.filter(function (item) { return item.isCorrect === false || item.correct === false; }) : [];
  }

  function normalize(record) {
    var choices = record.choices || record.options || [];
    var answer = record.answer || record.correctAnswer || '';
    if (!answer && /^[A-D]$/i.test(record.correct || '')) answer = choices[record.correct.toUpperCase().charCodeAt(0) - 65];
    if (!choices.length && window.ReanRushData && Array.isArray(window.ReanRushData.battleQuestions)) {
      window.ReanRushData.battleQuestions.some(function (set) {
        return set.some(function (item) {
          if ((item.question || item.prompt) !== (record.question || record.prompt)) return false;
          choices = item.choices || item.options || [];
          answer = answer || item.answer;
          record.explanation = record.explanation || item.explanation;
          return true;
        });
      });
    }
    if (!choices.length) choices = [answer, record.picked || record.selected || 'Your previous choice'];
    return {
      id: record.id || (record.answeredAt || '') + ':' + (record.question || record.prompt || ''),
      question: record.question || record.prompt || 'Review this missed question',
      topic: record.topic || record.subject || record.round || 'Review',
      choices: choices,
      answer: answer,
      explanation: record.explanation || ('The correct answer is ' + answer + '.')
    };
  }

  function formatTime(value) {
    return String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(value % 60).padStart(2, '0');
  }

  function startTimer() {
    var display = document.getElementById('countdown-timer');
    var bar = document.getElementById('timer-bar');
    if (display) display.textContent = formatTime(TOTAL_SECONDS);
    if (bar) bar.style.width = '100%';
    timerId = window.setInterval(function () {
      secondsLeft = Math.max(0, secondsLeft - 1);
      var display = document.getElementById('countdown-timer');
      var bar = document.getElementById('timer-bar');
      if (display) display.textContent = formatTime(secondsLeft);
      if (bar) bar.style.width = (secondsLeft / TOTAL_SECONDS * 100) + '%';
      if (!secondsLeft) finishRun(true);
    }, 1000);
  }

  function removeCleared(id) {
    var vault = getVault().filter(function (record) {
      var recordId = record.id || (record.answeredAt || '') + ':' + (record.question || record.prompt || '');
      return recordId !== id;
    });
    writeJson(VAULT_KEY, vault);
  }

  function renderQuestion() {
    if (index >= records.length) return finishRun(false);
    selected = null;
    var question = records[index];
    var heading = document.getElementById('revenge-question');
    var topic = document.getElementById('revenge-topic');
    var count = document.getElementById('revenge-counter');
    if (heading) heading.textContent = question.question;
    if (topic) topic.textContent = question.topic;
    if (count) count.textContent = (index + 1) + ' / ' + records.length;
    document.querySelectorAll('[data-action="revenge-answer"]').forEach(function (button, choiceIndex) {
      var value = question.choices[choiceIndex];
      button.disabled = false;
      button.hidden = value === undefined;
      button.style.backgroundColor = '';
      button.style.color = '';
      button.removeAttribute('aria-pressed');
      button.setAttribute('data-answer', value === undefined ? '' : String(choiceIndex));
      var label = button.querySelector('.font-label-bold');
      var sublabel = button.querySelector('.font-body-md');
      if (label && value !== undefined) label.textContent = String(value);
      if (sublabel) sublabel.textContent = '';
      var icon = button.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'radio_button_unchecked';
    });
    var submit = document.getElementById('submit-button');
    if (submit) submit.disabled = false;
    var hint = document.querySelector('[data-action="revenge-hint"]');
    if (hint) hint.disabled = hintUsed;
    var feedback = document.getElementById('revenge-feedback');
    if (feedback) feedback.textContent = '';
  }

  function submitAnswer(skipped) {
    if (index >= records.length) return;
    var question = records[index];
    var isCorrect = !skipped && selected !== null && question.choices[Number(selected)] === question.answer;
    results.push({ id: question.id, question: question.question, answer: question.answer, selected: selected === null ? '' : question.choices[Number(selected)], isCorrect: isCorrect });
    if (isCorrect) removeCleared(question.id);

    document.querySelectorAll('[data-action="revenge-answer"]').forEach(function (button) {
      var choiceIndex = Number(button.getAttribute('data-answer'));
      button.disabled = true;
      if (question.choices[choiceIndex] === question.answer) {
        button.style.backgroundColor = '#2FA84F';
        button.style.color = '#fff';
      } else if (selected !== null && choiceIndex === Number(selected)) {
        button.style.backgroundColor = '#D9382B';
        button.style.color = '#fff';
      }
    });
    var feedback = document.getElementById('revenge-feedback');
    if (feedback) feedback.textContent = skipped ? 'Skipped. This question remains in your vault.' : (isCorrect ? 'Correct! Removed from your Mistake Vault. ' : 'Not quite. This question remains in your Mistake Vault. ') + question.explanation;
    var submit = document.getElementById('submit-button');
    if (submit) submit.disabled = true;
    index += 1;
    window.setTimeout(renderQuestion, 650);
  }

  function finishRun(timedOut) {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
    while (timedOut && index < records.length) {
      results.push({ id: records[index].id, question: records[index].question, answer: records[index].answer, selected: '', isCorrect: false, timedOut: true });
      index += 1;
    }
    var total = records.length;
    var cleared = results.filter(function (item) { return item.isCorrect; }).length;
    writeJson(RESULTS_KEY, { total: total, cleared: cleared, missed: total - cleared, timedOut: !!timedOut, results: results, finishedAt: new Date().toISOString() });
    var panel = document.getElementById('revenge-question-panel');
    if (panel) {
      panel.classList.add('hidden');
      panel.style.display = 'none';
    }
    var main = document.querySelector('main');
    if (!main) return;
    var result = document.getElementById('revenge-result');
    if (!result) {
      result = document.createElement('section');
      result.id = 'revenge-result';
      result.className = 'w-full bg-surface-container-lowest border-2 border-primary rounded-2xl shadow-[8px_8px_0px_#00163a] p-space-lg md:p-space-xl flex flex-col gap-space-md';
      main.appendChild(result);
    }
    result.replaceChildren();
    var title = document.createElement('h1');
    title.className = 'font-headline-lg text-headline-lg text-primary';
    title.textContent = timedOut ? 'Time is up' : 'Revenge Round Complete';
    var message = document.createElement('p');
    message.className = 'font-title-card text-title-card text-primary';
    message.textContent = cleared + ' of ' + total + ' missed questions cleared. ' + (total - cleared) + ' still need practice.';
    var link = document.createElement('a');
    link.href = 'mistake-vault.html';
    link.className = 'w-full bg-secondary-container hover:bg-secondary text-surface-container-lowest border-2 border-primary rounded-xl py-space-md px-space-lg shadow-[6px_6px_0px_#00163a] flex items-center justify-center gap-space-sm font-headline-md text-headline-md';
    link.textContent = 'Return to Mistake Vault';
    result.append(title, message, link);
  }

  $(function () {
    var vault = getVault();
    var session = readJson(SESSION_KEY, null);
    var ids = session && Array.isArray(session.ids) ? session.ids : null;
    records = vault.map(normalize).filter(function (record) { return !ids || ids.indexOf(record.id) >= 0; });
    var panel = document.querySelector('main > div');
    if (panel) panel.id = 'revenge-question-panel';
    var heading = document.querySelector('main h1');
    if (heading) heading.id = 'revenge-question';
    var topic = document.querySelector('main .font-label-bold.text-label-bold.text-secondary');
    if (topic) topic.id = 'revenge-topic';
    var count = document.querySelector('header .font-title-card.text-title-card');
    if (count) count.id = 'revenge-counter';
    document.querySelectorAll('.quiz-option').forEach(function (button) { button.setAttribute('data-action', 'revenge-answer'); });
    var submit = document.getElementById('submit-button');
    if (submit) submit.setAttribute('data-action', 'submit-revenge-answer');
    var hint = document.getElementById('hint-button');
    if (hint) hint.setAttribute('data-action', 'revenge-hint');
    var skip = document.getElementById('skip-button');
    if (skip) skip.setAttribute('data-action', 'revenge-skip');
    var quit = Array.from(document.querySelectorAll('button')).find(function (button) { return button.textContent.indexOf('Quit & Save') >= 0; });
    if (quit) quit.setAttribute('data-action', 'revenge-exit');
    if (!records.length) {
      if (panel) {
        panel.classList.add('hidden');
        panel.style.display = 'none';
      }
      var timerDisplay = document.getElementById('countdown-timer');
      var timerBar = document.getElementById('timer-bar');
      if (timerDisplay) timerDisplay.textContent = '00:00';
      if (timerBar) timerBar.style.width = '0%';
      var empty = document.createElement('p');
      empty.id = 'revenge-empty';
      empty.className = 'p-space-md rounded-xl bg-surface-container-low text-primary font-label-bold';
      empty.textContent = 'Your Mistake Vault is empty. Missed questions will appear here for a revenge run.';
      document.querySelector('main').appendChild(empty);
      return;
    }
    var progress = document.querySelector('.font-headline-md.text-badge-arcade.text-primary.uppercase');
    if (progress) progress.id = 'revenge-progress';
    if (panel) {
      var feedback = document.createElement('p');
      feedback.id = 'revenge-feedback';
      feedback.className = 'font-body-md text-body-md text-primary';
      panel.appendChild(feedback);
    }
    $(document).on('click', '[data-action="revenge-answer"]', function () {
      if (this.disabled) return;
      selected = this.getAttribute('data-answer');
      document.querySelectorAll('[data-action="revenge-answer"]').forEach(function (button) { button.setAttribute('aria-pressed', button === this ? 'true' : 'false'); }, this);
      this.classList.add('selected-option');
      this.style.backgroundColor = '#d8e2ff';
      this.style.color = '#00163a';
    });
    $(document).on('click', '[data-action="submit-revenge-answer"]', function () {
      if (selected === null) {
        var feedback = document.getElementById('revenge-feedback');
        if (feedback) feedback.textContent = 'Choose an answer before locking it in.';
        return;
      }
      submitAnswer(false);
    });
    $(document).on('click', '[data-action="revenge-skip"]', function () { submitAnswer(true); });
    $(document).on('click', '[data-action="revenge-hint"]', function () {
      if (hintUsed) return;
      hintUsed = true;
      var question = records[index];
      var removed = 0;
      document.querySelectorAll('[data-action="revenge-answer"]').forEach(function (button) {
        if (removed < 2 && question.choices[Number(button.getAttribute('data-answer'))] !== question.answer) {
          button.hidden = true;
          removed += 1;
        }
      });
      this.disabled = true;
      var label = this.querySelector('span:last-child');
      if (label) label.textContent = 'Hint Used';
    });
    $(document).on('click', '[data-action="revenge-exit"]', function () { window.location.href = 'mistake-vault.html'; });
    renderQuestion();
    startTimer();
  });
})(jQuery);
