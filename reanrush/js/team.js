(function ($) {
  'use strict';

  $(function () {
    var game = window.ReanRushGame.load();
    var $teamA = $('#btn-team-a');
    var $teamB = $('#btn-team-b');
    var $iconA = $('#icon-team-a');
    var $iconB = $('#icon-team-b');
    var $labelA = $('#label-team-a');
    var $labelB = $('#label-team-b');

    if (!$teamA.length || !$teamB.length) return;

    game.teamCounts = game.teamCounts || { A: 14, B: 14 };

    function setTeam(team) {
      game.team = team;
      window.ReanRushGame.save(game);
      var other = team === 'A' ? 'B' : 'A';

      if (team === 'A') {
        $teamA.removeClass('bg-surface-container-lowest text-primary-container hover:bg-surface-container').addClass('bg-[#2FA84F] text-white');
        $iconA.text('check_circle').attr('class', 'material-symbols-outlined text-[20px] text-white');
        $labelA.text('JOINED TEAM A / ចូលរួមក្រុម A');

        $teamB.removeClass('bg-[#2FA84F] bg-[#D9382B] text-white').addClass('bg-surface-container-lowest text-primary-container hover:bg-surface-container');
        $iconB.text('add_circle').attr('class', 'material-symbols-outlined text-[20px] text-[#D9382B]');
        $labelB.text('SWITCH TO TEAM B / ផ្ទេរទៅក្រុម B');
      } else {
        $teamB.removeClass('bg-surface-container-lowest text-primary-container hover:bg-surface-container').addClass('bg-[#D9382B] text-white');
        $iconB.text('check_circle').attr('class', 'material-symbols-outlined text-[20px] text-white');
        $labelB.text('JOINED TEAM B / ចូលរួមក្រុម B');

        $teamA.removeClass('bg-[#2FA84F] bg-[#D9382B] text-white').addClass('bg-surface-container-lowest text-primary-container hover:bg-surface-container');
        $iconA.text('add_circle').attr('class', 'material-symbols-outlined text-[20px] text-[#2FA84F]');
        $labelA.text('SWITCH TO TEAM A / ផ្ទេរទៅក្រុម A');
      }

      if (game.teamCounts && game.teamCounts[other] !== undefined) {
        $('[data-action="team-count-a"]').text(game.teamCounts.A + ' / 16 PLAYERS');
        $('[data-action="team-count-b"]').text(game.teamCounts.B + ' / 16 PLAYERS');
      }
    }

    function renderCounts() {
      $('[data-action="team-count-a"]').text(game.teamCounts.A + ' / 16 PLAYERS');
      $('[data-action="team-count-b"]').text(game.teamCounts.B + ' / 16 PLAYERS');
    }

    renderCounts();
    setTeam(game.team === 'B' ? 'B' : 'A');

    window.setInterval(function () {
      var team = Math.random() < 0.5 ? 'A' : 'B';
      var change = Math.random() < 0.5 ? -1 : 1;
      game.teamCounts[team] = Math.max(2, Math.min(16, game.teamCounts[team] + change));
      window.ReanRushGame.save(game);
      renderCounts();
    }, 2500);

    $teamA.on('click', function () { setTeam('A'); });
    $teamB.on('click', function () { setTeam('B'); });
    $('[data-action="play-solo"]').on('click', function () {
      game.team = 'solo';
      window.ReanRushGame.save(game);
      window.location.href = 'lobby.html';
    });
    $('#balance-toggle').on('change', function () {
      game.autoBalance = $(this).is(':checked');
      window.ReanRushGame.save(game);
    });
    $('[data-action="team-continue"]').on('click', function () {
      window.ReanRushGame.save(game);
      window.location.href = 'lobby.html';
    });
  });
})(jQuery);
