window.ReanRushPage = { init: function () {
  function showPlayers() {
    $('#leaderboard-list').html(window.ReanRushData.leaderboard.map(function (player) { return '<li>' + player.name + ' <span class="badge">Team ' + player.team + '</span><span class="score-value">' + player.points.toLocaleString() + ' pts</span></li>'; }).join(''));
  }
  showPlayers();
  $('[data-score-tab="teams"]').on('click', function () { $('#leaderboard-list').html('<li>Green Comets <span class="score-value">8,420 pts</span></li><li>Red Rockets <span class="score-value">7,980 pts</span></li>'); });
  $('[data-score-tab="players"]').on('click', showPlayers);
} };
