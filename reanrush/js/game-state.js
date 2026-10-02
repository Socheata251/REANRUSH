(function ($) {
  'use strict';

  var storageKey = 'reanrush_game';
  var defaults = {
    pin: '',
    nickname: '',
    avatar: null,
    team: 'A',
    teamCounts: { A: 14, B: 14 },
    players: [],
    lobbyStartedAt: null,
    hostStarted: false
  };

  function load() {
    try {
      var stored = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
      if (stored && typeof stored === 'object') return $.extend(true, {}, defaults, stored);
    } catch (error) {
      window.localStorage.removeItem(storageKey);
    }
    return $.extend(true, {}, defaults);
  }

  function save(game) {
    window.localStorage.setItem(storageKey, JSON.stringify(game));
    return game;
  }

  window.ReanRushGame = { load: load, save: save };
})(jQuery);