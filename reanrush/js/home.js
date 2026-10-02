(function ($) {
  'use strict';

  var PROFILE_KEY = 'reanrush_profile';
  var DAILY_KEY = 'reanrush_daily_rush';

  function readJson(key, fallback) {
    try { return JSON.parse(window.localStorage.getItem(key) || 'null') || fallback; }
    catch (error) { return fallback; }
  }

  function writeJson(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); }
    catch (error) { return false; }
    return true;
  }

  function getProfile() {
    var profile = readJson(PROFILE_KEY, {});
    var game = window.ReanRushGame ? window.ReanRushGame.load() : {};
    profile.nickname = profile.nickname || game.nickname || 'Sokha_Speed';
    profile.level = Number(profile.level) || 14;
    profile.xp = Number(profile.xp) || 2840;
    profile.xpToNext = Number(profile.xpToNext) || 3500;
    profile.streak = Number(profile.streak) || 7;
    profile.petLevel = Number(profile.petLevel) || 3;
    profile.petHappy = Number(profile.petHappy) || 85;
    writeJson(PROFILE_KEY, profile);
    return profile;
  }

  function textNodeContaining(selector, phrase) {
    return Array.from(document.querySelectorAll(selector)).find(function (element) {
      return element.textContent.indexOf(phrase) >= 0;
    });
  }

  $(function () {
    var profile = getProfile();
    var nickname = textNodeContaining('main span', 'Sokha_Speed');
    if (nickname) nickname.textContent = profile.nickname;

    var levelLabel = textNodeContaining('main span', 'LVL 14 Battle Scout');
    if (levelLabel) levelLabel.textContent = 'LVL ' + profile.level + ' Battle Scout';

    var xpLabel = textNodeContaining('main span', '2,840 / 3,500 XP');
    if (xpLabel) xpLabel.textContent = profile.xp.toLocaleString() + ' / ' + profile.xpToNext.toLocaleString() + ' XP';
    var xpProgress = document.querySelector('main .h-full.bg-secondary-container.rounded-full.relative');
    if (xpProgress) xpProgress.style.width = Math.min(100, profile.xp / profile.xpToNext * 100) + '%';

    var streakLabel = textNodeContaining('main span', '7 Days!');
    if (streakLabel) streakLabel.textContent = profile.streak + ' Days!';
    var happyLabel = textNodeContaining('main span', '85% Happy');
    if (happyLabel) happyLabel.textContent = profile.petHappy + '% Happy';
    var petLevel = textNodeContaining('main span', 'LVL 3');
    if (petLevel) petLevel.textContent = 'LVL ' + profile.petLevel;

    var startButton = Array.from(document.querySelectorAll('button')).find(function (button) {
      return button.textContent.indexOf('Start Rush') >= 0;
    });
    if (startButton) {
      startButton.id = 'daily-rush-start';
      startButton.setAttribute('data-action', 'daily-rush-start');
    }
    var joinButton = document.querySelector('button[aria-label="Join via PIN"]');
    if (joinButton) joinButton.setAttribute('data-action', 'home-join-class');

    $(document).on('click', '[data-action="daily-rush-start"]', function () {
      var session = readJson(DAILY_KEY, { date: new Date().toDateString(), started: false, answers: 0 });
      session.started = true;
      session.startedAt = new Date().toISOString();
      session.date = new Date().toDateString();
      writeJson(DAILY_KEY, session);
      window.location.href = 'battle.html';
    });
    $(document).on('click', '[data-action="home-join-class"]', function () {
      window.location.href = 'classes.html';
    });
  });
})(jQuery);
