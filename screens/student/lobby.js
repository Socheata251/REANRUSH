(function ($) {
  'use strict';

  $(function () {
    var game = window.ReanRushGame.load();
    var names = ['Ari P.', 'Nary H.', 'Chenda T.', 'Vuthy L.', 'Sreylin O.', 'Keo R.'];
    var playerIndex = 0;
    var $list = $('#lobby-player-list');
    var $count = $('#lobby-player-count');
    var $pin = $('[data-action="lobby-pin"]');
    var $message = $('#lobby-waiting-message');
    var $countdown = $('#lobby-start-countdown');

    if (!$list.length) return;

    if (!game.players || !game.players.length) {
      game.players = [{ name: game.nickname || 'You', team: game.team || 'A' }];
    }
    if (!game.lobbyStartedAt) game.lobbyStartedAt = Date.now();
    game.hostStarted = false;
    window.ReanRushGame.save(game);

    function renderPlayers() {
      $list.empty();
      game.players.forEach(function (player) {
        $('<li>')
          .addClass('flex items-center justify-between rounded-lg border-2 border-[#0b2a5b] bg-[#fff8f6] px-3 py-2')
          .text((player.name || 'Player') + ' · ' + (player.team === 'solo' ? 'Solo' : 'Team ' + player.team))
          .appendTo($list);
      });
      $count.text(game.players.length);
      $pin.text(String(game.pin || '------').slice(0, 6));
    }

    function addFakePlayer() {
      var team = game.team === 'solo' ? 'solo' : (game.players.length % 2 ? 'A' : 'B');
      game.players.push({ name: names[playerIndex % names.length], team: team });
      playerIndex += 1;
      window.ReanRushGame.save(game);
      renderPlayers();
    }

    function updateCountdown() {
      var remaining = Math.max(0, 10 - Math.floor((Date.now() - game.lobbyStartedAt) / 1000));
      $countdown.text(remaining + 's');
      if (remaining === 0 && !game.hostStarted) {
        game.hostStarted = true;
        window.ReanRushGame.save(game);
        $message.text('Host started the battle! Entering the arena...');
        window.setTimeout(function () { window.location.href = 'battle.html'; }, 700);
        return true;
      }
      window.ReanRushGame.save(game);
      return false;
    }

    renderPlayers();
    updateCountdown();
    var countdownTimer = window.setInterval(function () {
      if (updateCountdown()) window.clearInterval(countdownTimer);
    }, 250);
    var playerTimer = window.setInterval(addFakePlayer, 2000);
    window.setTimeout(function () { window.clearInterval(playerTimer); }, 10000);
  });
})(jQuery);
