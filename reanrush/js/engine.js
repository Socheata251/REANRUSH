(function ($) {
  'use strict';

  var TEAM = 'Bak Touk Tigers';
  var OPPONENT = 'CADT Cyber Rhinos';
  var ROUND_NAMES = ['Bayon', 'Ta Prohm', 'Angkor Boss'];
  var PAGE_BY_ROUND = ['battle.html', 'battle-2.html', 'boss-battle.html'];
  var ANSWER_SECONDS = 20;
  var STATE_KEY = 'reanrush_battle_state';
  var SKILLS_KEY = 'reanrush_battle_skills';
  var TEAMS_KEY = 'reanrush_team_scores';
  var ANSWERS_KEY = 'answers';
  var state = null;
  var timer = null;
  var paused = false;
  var questionStarted = 0;

  function read(key, fallback) {
    try {
      var value = window.localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(read(key, null)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (error) {
      return false;
    }
    return true;
  }

  function questionSets() {
    var source = window.ReanRushData && window.ReanRushData.battleQuestions;
    if (!Array.isArray(source) || source.length < 3) return [];
    return source.slice(0, 3).map(function (set) {
      return (Array.isArray(set) ? set : []).map(function (item) {
        return {
          question: item.question || item.prompt || '',
          choices: item.choices || item.options || [],
          answer: item.answer,
          explanation: item.explanation || ('The correct answer is ' + item.answer + '.'),
          points: Number(item.points) || 100
        };
      });
    });
  }

  function allQuestions() {
    return questionSets().reduce(function (all, set, round) {
      return all.concat(set.map(function (question, index) {
        return { round: round, index: index, item: question };
      }));
    }, []);
  }

  function loadState() {
    var saved = readJson(STATE_KEY, null);
    var questions = allQuestions();
    var demoScores = window.ReanRushData && window.ReanRushData.teamScores || {};
    if (!saved || !Array.isArray(saved.answers) || saved.questionIndex > questions.length) {
      saved = {
        questionIndex: 0,
        score: Number(demoScores['Team A'] || demoScores[TEAM]) || 0,
        opponentScore: Number(demoScores['Team B'] || demoScores[OPPONENT]) || 0,
        answers: [],
        bossHealth: 42.05
      };
    }
    state = saved;
    if (!Array.isArray(state.answers)) state.answers = [];
    state.score = Number(state.score) || 0;
    state.bossHealth = Number.isFinite(Number(state.bossHealth)) ? Number(state.bossHealth) : 100;
    saveState();
    return questions;
  }

  function saveState() {
    write(STATE_KEY, state);
    write(ANSWERS_KEY, state.answers);
    write('reanrush_answers', state.answers);
    var scores = readJson(TEAMS_KEY, {});
    if (!scores[TEAM]) scores[TEAM] = 0;
    if (!scores[OPPONENT]) scores[OPPONENT] = 0;
    scores[TEAM] = state.score;
    scores[OPPONENT] = state.opponentScore;
    write(TEAMS_KEY, scores);
    write('reanrush_team_score', state.score);
  }

  function current() {
    var questions = allQuestions();
    return questions[state.questionIndex] || null;
  }

  function roundTitle(round) {
    return ROUND_NAMES[round] || ROUND_NAMES[0];
  }

  function pageUrl(round) {
    return PAGE_BY_ROUND[round] || 'leaderboard.html';
  }

  function ensureBattleTwoPanel() {
    var $panel = $('#engine-question-panel');
    if ($panel.length) return $panel;
    $panel = $('<section id="engine-question-panel" class="bg-surface-container-lowest border-[3px] border-primary rounded-2xl shadow-[6px_6px_0px_#00163a] p-space-md my-space-md"></section>');
    $panel.append('<p id="engine-round" class="font-badge-arcade text-secondary uppercase"></p>');
    $panel.append('<p data-role="battle-timer" class="font-headline-md text-secondary text-xl" aria-live="polite">20s</p>');
    $panel.append('<h2 id="engine-question" class="font-headline-md text-primary text-xl my-space-sm"></h2>');
    $panel.append('<div id="engine-options" class="grid grid-cols-1 md:grid-cols-2 gap-space-sm"></div>');
    $panel.append('<p id="engine-explanation" class="mt-space-sm font-body-sm text-primary" aria-live="polite"></p>');
    var footer = document.querySelector('footer');
    var header = document.querySelector('header.fixed');
    if (header && header.parentNode) header.parentNode.insertBefore($panel[0], header.nextSibling);
    else if (footer && footer.parentNode) footer.parentNode.insertBefore($panel[0], footer);
    else document.body.appendChild($panel[0]);
    return $panel;
  }

  function optionButton(choice, index) {
    return $('<button type="button" data-action="answer-option" class="bg-surface-container-lowest border-[3px] border-primary rounded-xl p-space-sm text-left font-label-bold text-primary shadow-[3px_3px_0px_#00163a]"></button>')
      .attr('data-answer', String.fromCharCode(65 + index))
      .text(String.fromCharCode(65 + index) + '. ' + choice);
  }

  function renderQuestion() {
    var active = current();
    if (!active) {
      window.location.href = 'leaderboard.html';
      return;
    }
    var round = active.round;
    var q = active.item;
    var page = $('body').attr('data-page');
    var $buttons = $('[data-action="answer-option"]');

    if (page === 'battle-2') {
      ensureBattleTwoPanel();
      $('#engine-round').text('ROUND ' + (round + 1) + ' / 3 • ' + roundTitle(round));
      $('#engine-question').text(q.question);
      $('#engine-options').empty();
      q.choices.forEach(function (choice, index) {
        $('#engine-options').append(optionButton(choice, index));
      });
      $buttons = $('#engine-options [data-action="answer-option"]');
    } else {
      var $question = $('main h1').first();
      if (!$question.length) $question = $('main h2').first();
      if ($question.length) $question.text(q.question);
      var $roundLabel = $('[data-role="round-label"]');
      if ($roundLabel.length) $roundLabel.text('ROUND ' + (round + 1) + ' / 3 • ' + roundTitle(round));
      if (!$buttons.length) {
        ensureBattleTwoPanel();
        return renderQuestion();
      }
      $buttons.each(function (index) {
        var $button = $(this);
        if (q.choices[index] === undefined) return;
        $button.attr('data-answer', String.fromCharCode(65 + index));
        $button.removeAttr('data-correct');
        if (q.choices[index] === q.answer) $button.attr('data-correct', 'true');
        var $label = $button.find('p').first();
        if ($label.length) $label.text(q.choices[index]);
        else {
          var $choiceLabel = $button.find('.font-title-card').last();
          if ($choiceLabel.length) $choiceLabel.text(q.choices[index]);
        }
      });
      if (page === 'boss-battle') {
        $('#boss-hp-fill').css('width', state.bossHealth + '%');
      }
    }

    $('#engine-explanation').empty();
    $buttons.prop('disabled', false).removeAttr('aria-pressed').show();
    startTimer();
  }

  function updateTimer(seconds) {
    var text = String(seconds).padStart(2, '0') + 's';
    $('#countdownText, #arena-timer, #battleTimer').text(seconds <= 0 ? 'TIME!' : text);
    $('[data-role="battle-timer"]').text(seconds <= 0 ? 'TIME!' : text);
    if ($('#timerRing').length) {
      $('#timerRing').css('stroke-dashoffset', 276 * (1 - seconds / ANSWER_SECONDS));
      $('#timerRing').attr('stroke', seconds <= 5 ? '#BA1A1A' : '#D9382B');
    }
  }

  function startTimer() {
    window.clearInterval(timer);
    paused = false;
    questionStarted = Date.now();
    var remaining = ANSWER_SECONDS;
    updateTimer(remaining);
    timer = window.setInterval(function () {
      if (paused) return;
      remaining -= 1;
      updateTimer(remaining);
      if (remaining <= 0) finishAnswer(null, true);
    }, 1000);
  }

  function showToast(title, detail) {
    var $toast = $('#answerToast');
    if (!$toast.length) return;
    $toast.removeClass('translate-y-24 opacity-0').addClass('translate-y-0 opacity-100');
    $toast.find('p').eq(0).text(title);
    $toast.find('p').eq(1).text(detail);
    window.setTimeout(function () {
      $toast.addClass('translate-y-24 opacity-0').removeClass('translate-y-0 opacity-100');
    }, 1800);
  }

  function updateBoss(earned) {
    if (!$('body').is('[data-page="boss-battle"]')) return;
    state.bossHealth = Math.max(0, state.bossHealth - earned / 100);
    $('#boss-hp-fill').css('width', state.bossHealth + '%');
    $('#boss-damage-pop').text(earned ? '💥 -' + (earned * 100).toLocaleString() + ' HP!' : 'No damage this time')
      .removeClass('opacity-0 -translate-y-2').addClass('opacity-100 translate-y-0');
  }

  function finishAnswer(selectedKey, timedOut) {
    if (!state || state.locked) return;
    state.locked = true;
    window.clearInterval(timer);
    var active = current();
    if (!active) return;
    var q = active.item;
    var correctIndex = q.choices.indexOf(q.answer);
    var correctKey = String.fromCharCode(65 + correctIndex);
    var isCorrect = !timedOut && selectedKey === correctKey;
    var remaining = Math.max(0, ANSWER_SECONDS - Math.floor((Date.now() - questionStarted) / 1000));
    var skills = readJson(SKILLS_KEY, {});
    var multiplier = skills.double ? 2 : 1;
    var points = isCorrect ? Math.round(q.points * (0.5 + remaining / ANSWER_SECONDS) * multiplier) : 0;
    var answer = {
      round: roundTitle(active.round),
      question: q.question,
      topic: roundTitle(active.round),
      choices: q.choices.slice(),
      selected: selectedKey,
      correct: correctKey,
      answer: q.answer,
      isCorrect: isCorrect,
      timedOut: !!timedOut,
      points: points,
      explanation: q.explanation,
      answeredAt: new Date().toISOString()
    };
    state.answers.push(answer);
    if (isCorrect) state.score += points;
    if (!isCorrect) {
      var mistakes = readJson('reanrush_mistake_vault', []);
      answer.id = answer.answeredAt + ':' + answer.question;
      mistakes.push(answer);
      write('reanrush_mistake_vault', mistakes);
    }
    if (skills.double && isCorrect) {
      delete skills.double;
      write(SKILLS_KEY, skills);
    }
    if (active.round === 2) updateBoss(points);
    var $options = $('[data-action="answer-option"]');
    $options.each(function () {
      var $option = $(this);
      var key = $option.attr('data-answer');
      $option.prop('disabled', true);
      if (key === correctKey) {
        $option.css({ backgroundColor: '#2FA84F', color: '#fff' });
        $option.attr('aria-label', 'Correct answer');
      } else if (key === selectedKey) {
        $option.css({ backgroundColor: '#D9382B', color: '#fff' });
        $option.attr('aria-label', 'Incorrect answer');
      }
    });
    $('#engine-explanation').text(q.explanation);
    showToast(isCorrect ? 'CORRECT!' : 'GOOD TRY!', isCorrect ? '+' + points + ' PTS' : 'No points lost. ' + (timedOut ? 'Time is up.' : ''));
    state.lastAnswer = answer;
    state.questionIndex += 1;
    state.locked = false;
    saveState();
    window.setTimeout(function () {
      window.location.href = 'answer-result.html';
    }, 900);
  }

  function renderAnswerResult() {
    var answer = state.answers[state.answers.length - 1];
    var $main = $('main').first();
    if (!$main.length) $main = $('body');
    var $summary = $('#engine-answer-result');
    if (!$summary.length) {
      $summary = $('<section id="engine-answer-result" class="max-w-4xl mx-auto my-space-xl p-space-lg bg-surface-container-lowest border-[3px] border-primary rounded-2xl shadow-[6px_6px_0px_#00163a]"></section>');
      $main.prepend($summary);
    }
    if (!answer) {
      $summary.text('No answer has been recorded yet.');
      return;
    }
    var nextRound = Math.floor(state.questionIndex / 3);
    var done = state.questionIndex >= allQuestions().length;
    var nextUrl = done ? 'leaderboard.html' : pageUrl(nextRound);
    $summary.empty();
    $('<p class="font-badge-arcade text-secondary uppercase"></p>').text(answer.round).appendTo($summary);
    $('<h1 class="font-headline-md text-primary text-2xl my-space-sm"></h1>').text(answer.isCorrect ? 'Correct answer!' : 'Good try, no points lost.').appendTo($summary);
    $('<p class="font-title-card text-primary"></p>').text(answer.question).appendTo($summary);
    $('<p class="font-label-bold text-primary mt-space-sm"></p>').text('Your answer: ' + (answer.selected || 'No answer') + ' • Correct answer: ' + answer.correct).appendTo($summary);
    $('<p class="font-body-md text-primary mt-space-sm"></p>').text(answer.explanation).appendTo($summary);
    $('<p class="font-headline-md text-secondary mt-space-sm"></p>').text('+' + answer.points + ' pts').appendTo($summary);
    var $next = $('[data-action="next-question"]').first();
    if ($next.length) {
      $next.attr('href', nextUrl);
    } else {
      $next = $('<a class="inline-flex items-center gap-space-xs px-space-md py-space-sm mt-space-md rounded-lg bg-secondary-container text-on-secondary-container font-label-bold text-label-bold border-[3px] border-primary shadow-[4px_4px_0px_#00163a]" data-action="next-question"></a>')
        .attr('href', nextUrl).text(done ? 'View leaderboard' : 'Next question');
      $summary.append($next);
    }
  }

  function renderLeaderboard() {
    var scores = readJson(TEAMS_KEY, {});
    if (!scores[TEAM] && !scores[OPPONENT]) {
      scores = window.ReanRushData && window.ReanRushData.teamScores || { [TEAM]: state.score, [OPPONENT]: state.opponentScore };
    }
    scores[TEAM] = Number(scores[TEAM] || state.score);
    scores[OPPONENT] = Number(scores[OPPONENT] || state.opponentScore);
    write(TEAMS_KEY, scores);
    var ranking = Object.keys(scores).map(function (team) {
      return { team: team, score: Number(scores[team]) || 0 };
    }).sort(function (a, b) { return b.score - a.score; });
    var $main = $('main').first();
    if (!$main.length) $main = $('body');
    var $board = $('#engine-leaderboard');
    if (!$board.length) {
      $board = $('<section id="engine-leaderboard" class="max-w-4xl mx-auto my-space-xl"></section>');
      $main.prepend($board);
    }
    $board.empty();
    $('<h1 class="font-headline-md text-primary text-2xl mb-space-md"></h1>').text('Battle Results').appendTo($board);
    var $list = $('<ol class="space-y-3"></ol>').appendTo($board);
    ranking.forEach(function (entry, index) {
      var $row = $('<li class="flex items-center justify-between rounded-xl border-[3px] border-primary bg-surface-container-lowest p-space-md font-label-bold text-primary shadow-[3px_3px_0px_#00163a]"></li>');
      $('<span></span>').text((index === 0 ? '👑 ' : '') + entry.team).appendTo($row);
      var $score = $('<span class="font-headline-md text-xl"></span>').text('0 pts').appendTo($row);
      $list.append($row);
      var start = 0;
      var step = Math.max(1, Math.ceil(entry.score / 24));
      var interval = window.setInterval(function () {
        start = Math.min(entry.score, start + step);
        $score.text(start.toLocaleString() + ' pts');
        if (start >= entry.score) window.clearInterval(interval);
      }, 35);
    });
    $('<p class="font-headline-md text-primary text-xl mt-space-md"></p>').text(ranking[0] && ranking[0].team === TEAM ? '🏆 Winner: ' + TEAM : 'Good try, rush again!').appendTo($board);
  }

  function bindActions() {
    $(document).on('click', '[data-action="answer-option"]', function (event) {
      event.preventDefault();
      finishAnswer($(this).attr('data-answer'), false);
    });
    $(document).on('click', '[data-action="toggle-pause"]', function () {
      paused = !paused;
      $('#pauseIcon').text(paused ? 'play_arrow' : 'pause');
      $(this).find('.material-symbols-outlined').text(paused ? 'play_arrow' : 'pause');
    });
    $(document).on('click', '[data-action="toggle-audio"]', function () {
      var $icon = $('#soundIcon');
      if ($icon.length) $icon.text($icon.text() === 'volume_up' ? 'volume_off' : 'volume_up');
    });
    $(document).on('click', '[data-action="toggle-fullscreen"]', function () {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      else if (document.exitFullscreen) document.exitFullscreen();
    });
    $(document).on('click', '[data-action="skill"]', function () {
      var $button = $(this);
      var skills = readJson(SKILLS_KEY, { used: {} });
      var skill = $button.attr('data-skill');
      if (!skill) return;
      skills.used = skills.used || {};
      if (skills.used[skill]) return;
      skills.used[skill] = true;
      write(SKILLS_KEY, skills);
      if (skill === 'peek') {
        var active = current();
        var correctKey = active ? String.fromCharCode(65 + active.item.choices.indexOf(active.item.answer)) : null;
        $('[data-action="answer-option"]').each(function () {
          if ($(this).attr('data-answer') !== correctKey && Math.random() < 0.5) $(this).hide();
        });
      } else if (skill === 'double') {
        skills.double = true;
        skills.doubleUsed = true;
        write(SKILLS_KEY, skills);
        showToast('DOUBLE BOOST READY', 'Your next correct answer is worth 2x.');
      } else if (skill === 'steal') {
        state.score += 50;
        state.opponentScore = Math.max(0, state.opponentScore - 50);
        saveState();
        showToast('POINTS STEAL!', '+50 points from ' + OPPONENT);
      } else if (skill === 'shield') {
        skills.shield = true;
        write(SKILLS_KEY, skills);
        showToast('SHIELD ACTIVE', 'Your next miss will be protected.');
      }
      $button.prop('disabled', true).attr('aria-label', skill + ' used');
    });
    $(document).on('click', '[data-action="huddle"]', function () {
      var $button = $(this);
      var until = Date.now() + 10000;
      $button.prop('disabled', true);
      function tick() {
        var left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
        $button.attr('data-huddle-left', left).text(left ? 'Huddle ' + left + 's' : 'Huddle ended');
        if (left) window.setTimeout(tick, 250);
        else $button.prop('disabled', false);
      }
      tick();
    });
    $(document).on('click', '[data-action="emoji-reaction"]', function () {
      var $button = $(this);
      var $counter = $button.find('span').last();
      var count = Number($button.attr('data-reactions')) || parseInt(($counter.text() || '').replace(/[^0-9]/g, ''), 10) || 0;
      $button.attr('data-reactions', count + 1);
      if ($counter.length) $counter.text('+' + (count + 1));
    });
    $(document).on('click', '[data-action="save-answer"]', function () {
      var answer = state.answers[state.answers.length - 1];
      if (!answer) return;
      var vault = readJson('reanrush_mistake_vault', []);
      vault.push(answer);
      write('reanrush_mistake_vault', vault);
      $('#save-btn-text').text('Saved to Revision Vault');
    });
  }

  $(function () {
    bindActions();
    var questions = loadState();
    var page = $('body').attr('data-page');
    if (page === 'battle' || page === 'battle-2' || page === 'boss-battle') {
      var active = current();
      if (active && page !== ['battle', 'battle-2', 'boss-battle'][active.round]) {
        window.location.replace(pageUrl(active.round));
      } else if (active) {
        var usedSkills = readJson(SKILLS_KEY, { used: {} }).used || {};
        $('[data-action="skill"]').each(function () {
          var $skill = $(this);
          if (usedSkills[$skill.attr('data-skill')]) $skill.prop('disabled', true);
        });
        renderQuestion();
      }
      else if (!active) window.location.href = 'leaderboard.html';
    } else if (page === 'answer-result') {
      renderAnswerResult();
    } else if (page === 'leaderboard') {
      renderLeaderboard();
    }
  });
})(jQuery);
