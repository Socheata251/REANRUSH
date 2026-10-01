window.ReanRushPage = { init: function () {
  // Demo battle flow: 3 rounds, timer, score logic, and a peek skill.
  var rounds = window.ReanRushData.battleQuestions || [];
  var totalRounds = rounds.length;
  var roundIndex = 0;
  var questionIndex = 0;
  var score = Number(window.localStorage.getItem('reanrush_team_score') || 1240);
  var timerSeconds = 30;
  var timerId = null;
  var questionStartedAt = 0;
  var peekUsed = false;

  function getCurrentQuestion() {
    return rounds[roundIndex][questionIndex];
  }

  function setTimer(value) {
    $('#battle-timer').text('00:' + String(Math.max(value, 0)).padStart(2, '0'));
  }

  function startTimer() {
    if (timerId) window.clearInterval(timerId);
    timerSeconds = 30;
    questionStartedAt = Date.now();
    setTimer(timerSeconds);
    timerId = window.setInterval(function () {
      timerSeconds -= 1;
      setTimer(timerSeconds);
      if (timerSeconds <= 0) {
        window.clearInterval(timerId);
        finishQuestion(false, 'Time is up!');
      }
    }, 1000);
  }

  function renderQuestion() {
    var question = getCurrentQuestion();
    if (!question) {
      window.localStorage.setItem('reanrush_team_score', String(score));
      window.location.href = 'leaderboard.html';
      return;
    }

    $('#battle-round').text('ROUND ' + (roundIndex + 1) + ' / ' + totalRounds);
    $('#battle-question').text(question.question);
    $('#battle-points').text(String(score) + ' pts');
    $('#answer-grid').empty();
    peekUsed = false;
    question.choices.forEach(function (choice) {
      var button = $('<button class="answer-option" type="button">' + choice + '</button>');
      button.on('click', function () {
        if (button.is(':disabled')) return;
        finishQuestion(choice === question.answer, choice);
      });
      $('#answer-grid').append(button);
    });
    $('#peek-skill').prop('disabled', false).text('Peek skill');
    startTimer();
  }

  function finishQuestion(isCorrect, chosen) {
    if (timerId) window.clearInterval(timerId);
    var question = getCurrentQuestion();
    var buttons = $('.answer-option');
    buttons.prop('disabled', true);

    buttons.each(function () {
      var value = $(this).text();
      if (value === question.answer) $(this).addClass('answer-correct');
      else if (value === chosen && !isCorrect) $(this).addClass('answer-wrong');
    });

    if (isCorrect) {
      var timeSpentMs = Date.now() - questionStartedAt;
      var bonus = Math.max(20, 200 - Math.round(timeSpentMs / 100));
      var earned = Math.round(question.points + bonus);
      score += earned;
      window.showToast('Nice! +' + earned + ' points');
      window.localStorage.setItem('reanrush_team_score', String(score));
    } else {
      // Wrong answers cost no points in the demo.
      window.localStorage.setItem('reanrush_team_score', String(score));
      var wrong = Array.isArray(window.ReanRushData.mistakeVault) ? window.ReanRushData.mistakeVault : [];
      wrong.push({ question: question.question, picked: chosen, answer: question.answer, savedAt: new Date().toISOString() });
      window.localStorage.setItem('reanrush_mistake_vault', JSON.stringify(wrong.slice(-20)));
      window.showToast('Good try — no points lost.', 'error');
    }

    window.setTimeout(function () {
      questionIndex += 1;
      if (questionIndex >= rounds[roundIndex].length) {
        questionIndex = 0;
        roundIndex += 1;
      }
      if (roundIndex >= totalRounds) {
        window.localStorage.setItem('reanrush_team_score', String(score));
        window.location.href = 'leaderboard.html';
        return;
      }
      renderQuestion();
    }, 1200);
  }

  $('#peek-skill').on('click', function () {
    if (peekUsed) return;
    var question = getCurrentQuestion();
    var buttons = $('.answer-option');
    var wrongButtons = buttons.filter(function () { return $(this).text() !== question.answer; }).slice(0, 2);
    wrongButtons.hide();
    peekUsed = true;
    $(this).prop('disabled', true).text('Peek used');
  });

  function startHuddle() {
    var huddle = $('<div id="team-huddle" class="panel" style="margin-bottom:16px; padding:18px; background:#f6f0ff; border:2px solid #00163a; border-radius:12px;">Team huddle: <strong>10</strong></div>');
    $('main').prepend(huddle);
    var seconds = 10;
    var huddleTimer = window.setInterval(function () {
      seconds -= 1;
      huddle.find('strong').text(seconds);
      if (seconds <= 0) {
        window.clearInterval(huddleTimer);
        huddle.remove();
        renderQuestion();
      }
    }, 1000);
  }

  startHuddle();
} };
