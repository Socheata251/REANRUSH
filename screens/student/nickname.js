(function ($) {
  'use strict';

  $(function () {
    var game = window.ReanRushGame.load();
    var badWords = ['fuck', 'shit', 'bitch', 'asshole'];
    var luckyNames = ['Sokha_Speed', 'BakTouk_Pro', 'Angkor_Knight', 'CADT_Coder', 'Bayon_Blaster', 'Lotus_Ace'];
    var $input = $('#nicknameInput');
    var $submit = $('#submitBattleBtn');
    var $cards = $('.avatar-card');

    if (!$input.length || !$submit.length) return;

    function selectAvatar($card) {
      if (!$card.length) return;
      $cards.removeClass('bg-secondary-fixed/50 shadow-[4px_4px_0px_#00163a]')
        .addClass('bg-surface-container shadow-[2px_2px_0px_#00163a]')
        .find('.selected-indicator').addClass('hidden');
      $card.removeClass('bg-surface-container shadow-[2px_2px_0px_#00163a]')
        .addClass('bg-secondary-fixed/50 shadow-[4px_4px_0px_#00163a]')
        .find('.selected-indicator').removeClass('hidden');

      var $image = $card.find('img').first();
      game.avatar = {
        name: $card.attr('data-avatar-name'),
        trait: $card.attr('data-avatar-trait'),
        alt: $card.attr('data-avatar-alt'),
        src: $image.attr('src')
      };
      $('#previewAvatarName').text(game.avatar.name);
      $('#previewAvatarTrait').text(game.avatar.trait);
      $('#previewAvatarImg').attr({ src: game.avatar.src, 'data-alt': game.avatar.alt });
      window.ReanRushGame.save(game);
    }

    $input.val((game.nickname || 'Sokha_Speed').slice(0, 14)).attr('maxlength', 14);
    if (game.avatar) {
      selectAvatar($cards.filter(function () { return $(this).attr('data-avatar-name') === game.avatar.name; }).first());
    } else {
      selectAvatar($cards.first());
    }

    $('#clearNickBtn').on('click', function () { $input.val('').trigger('focus'); });
    $('#randomizeBtn').on('click', function () {
      var choices = luckyNames.filter(function (name) { return name !== $input.val(); });
      var next = choices[Math.floor(Math.random() * choices.length)] || 'Sokha_Speed';
      $input.val(next);
    });
    $cards.on('click', function () { selectAvatar($(this)); });
    $submit.on('click', function () {
      var nickname = $input.val().trim();
      var lowered = nickname.toLowerCase();
      if (nickname.length < 3 || nickname.length > 14) {
        window.alert('Nickname must be 3 to 14 characters.');
        $input.trigger('focus');
        return;
      }
      if (badWords.some(function (word) { return lowered.indexOf(word) !== -1; })) {
        window.alert('Choose a classroom-friendly nickname.');
        $input.trigger('focus');
        return;
      }

      game.nickname = nickname;
      window.ReanRushGame.save(game);
      window.location.href = game.team === 'solo' ? 'lobby.html' : 'team.html';
    });
    $input.on('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        $submit.trigger('click');
      }
    });
  });
})(jQuery);
