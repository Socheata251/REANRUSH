window.ReanRushPage = { init: function () {
  // Read score data from localStorage, animate counts, and show a winner crown.
  var stored = null;
  try { stored = JSON.parse(window.localStorage.getItem('reanrush_team_scores')); } catch (error) {}

  var teamScores = stored || {
    'Team A': Number(window.localStorage.getItem('reanrush_team_score') || 8420),
    'Team B': 7980
  };

  function renderTeams() {
    var teams = Object.keys(teamScores).map(function (team) { return { team: team, score: Number(teamScores[team] || 0) }; }).sort(function (a, b) { return b.score - a.score; });
    var winner = teams[0];
    var loser = teams[1];
    $('#leaderboard-list').empty();

    teams.forEach(function (entry) {
      var item = $('<li></li>');
      var crown = entry.team === winner.team ? ' 👑 ' : '';
      var label = crown + entry.team + ' <span class="badge">' + (entry.team === winner.team ? 'Winner' : 'Runner-up') + '</span>';
      var scoreEl = $('<span class="score-value">0 pts</span>');
      item.html(label + ' ' + scoreEl[0].outerHTML);
      $('#leaderboard-list').append(item);

      var targetValue = entry.score;
      var start = 0;
      var tick = window.setInterval(function () {
        start += Math.max(20, Math.round(targetValue / 18));
        if (start >= targetValue) {
          start = targetValue;
          window.clearInterval(tick);
        }
        scoreEl.text(start.toLocaleString() + ' pts');
      }, 40);
    });

    var message = loser ? 'Good try, rush again!' : 'Champion! Keep the streak alive.';
    $('#leaderboard-message').text(message);
  }

  $('#leaderboard-message').length || $('<p id="leaderboard-message" class="muted"></p>').insertAfter('#leaderboard-list');
  renderTeams();

  $('[data-score-tab="teams"]').on('click', renderTeams);
  $('[data-score-tab="players"]').on('click', function () {
    var players = window.ReanRushData.leaderboard.map(function (player) {
      return '<li>' + player.name + ' <span class="badge">Team ' + player.team + '</span><span class="score-value">' + player.points.toLocaleString() + ' pts</span></li>';
    }).join('');
    $('#leaderboard-list').html(players);
    $('#leaderboard-message').text('Good try, rush again!');
  });
} };
