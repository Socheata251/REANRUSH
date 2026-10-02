(function ($) {
  'use strict';

  $(function () {
    var game = window.ReanRushGame.load();
    var $inputs = $('.pin-digit');
    var $submit = $('[data-action="pin-submit"]');
    var selectedMode = game.team || 'A';

    function pinValue() {
      return $inputs.map(function () { return $(this).val(); }).get().join('').replace(/\D/g, '').slice(0, 6);
    }

    function renderPin(value) {
      value = (value || '').replace(/\D/g, '').slice(0, 6);
      $inputs.each(function (index) { $(this).val(value[index] || ''); });
      $submit.prop('disabled', value.length !== 6);
    }

    function chooseMode($button) {
      if (!$button.length) return;
      selectedMode = $button.attr('data-mode');
      $('.team-option').each(function () {
        var $option = $(this);
        $option.removeClass('bg-[#2FA84F] bg-[#D9382B] bg-tertiary-fixed-dim text-white text-on-primary')
          .addClass('bg-surface-container-lowest text-primary');
        $option.children('span').last().text('Join').attr('class', 'text-[11px] font-bold text-outline uppercase tracking-wider');
      });
      var colors = selectedMode === 'A' ? 'bg-[#2FA84F] text-on-primary' : selectedMode === 'B' ? 'bg-[#D9382B] text-white' : 'bg-tertiary-fixed-dim text-primary';
      $button.removeClass('bg-surface-container-lowest text-primary').addClass(colors);
      $button.children('span').last().text('Selected');
      game.team = selectedMode;
      window.ReanRushGame.save(game);
    }

    renderPin(game.pin);
    $inputs.on('input', function () {
      var index = $inputs.index(this);
      var digits = this.value.replace(/\D/g, '');
      if (digits.length > 1) {
        renderPin(digits);
        $inputs.eq(Math.min(digits.length, 5)).trigger('focus');
      } else {
        this.value = digits.slice(0, 1);
        if (digits && index < $inputs.length - 1) $inputs.eq(index + 1).trigger('focus');
        $submit.prop('disabled', pinValue().length !== 6);
      }
    }).on('keydown', function (event) {
      var index = $inputs.index(this);
      if (event.key === 'Backspace' && !this.value && index > 0) $inputs.eq(index - 1).trigger('focus');
      if (event.key === 'Enter') {
        event.preventDefault();
        $submit.trigger('click');
      }
    });

    $('[data-action="choose-mode"]').on('click', function () { chooseMode($(this)); });
    chooseMode($('.team-option[data-mode="' + (selectedMode === 'B' || selectedMode === 'solo' ? selectedMode : 'A') + '"]').first());

    $submit.on('click', function () {
      var pin = pinValue();
      if (pin.length !== 6) return;
      game.pin = pin;
      game.nickname = $('[data-action="nickname-input"]').val().trim() || game.nickname;
      game.team = selectedMode;
      game.hostStarted = false;
      game.lobbyStartedAt = null;
      window.ReanRushGame.save(game);
      window.location.href = pin === '123456' ? '../student/nickname.html' : 'game-not-found.html';
    });
  });
})(jQuery);