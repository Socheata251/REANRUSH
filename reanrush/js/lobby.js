window.ReanRushPage = { init: function () {
  // Fake players join the room every 2 seconds to mimic a live lobby.
  var list = $('#lobby-player-list');
  var storageKey = 'reanrush_lobby_players';
  var names = ['Ari P.', 'Nary H.', 'Chenda T.', 'Vuthy L.', 'Sreylin O.', 'Keo R.'];
  var teams = ['A', 'B'];

  function getPlayers() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey));
      return Array.isArray(saved) && saved.length ? saved : window.ReanRushData.lobbyPlayers.slice();
    } catch (error) {
      return window.ReanRushData.lobbyPlayers.slice();
    }
  }

  function renderPlayers() {
    var players = getPlayers();
    var count = players.length;
    list.html(players.map(function (player) {
      return '<li>' + (player.name || 'Guest') + ' <span class="badge">Team ' + (player.team || 'A') + '</span></li>';
    }).join(''));
    $('.badge').first().text(count + ' players');
  }

  function addFakePlayer() {
    var players = getPlayers();
    var next = names[Math.floor(Math.random() * names.length)];
    players.push({ name: next, team: teams[players.length % 2] });
    window.localStorage.setItem(storageKey, JSON.stringify(players));
    renderPlayers();
  }

  renderPlayers();
  window.setInterval(addFakePlayer, 2000);

  $('#start-battle').on('click', function () {
    window.localStorage.setItem('reanrush_battle_started', 'true');
    window.location.href = 'battle.html';
  });
} };
