(function ($) {
  'use strict';

  $(function () {
    var pin = '';
    var $slots = $('.pin-slot');
    var $submit = $('#btn-enter');

    function render() {
      $slots.each(function (index) {
        var $slot = $(this);
        $slot.text(pin[index] || '');
        $slot.toggleClass('bg-surface-container-lowest text-secondary', index < pin.length);
        $slot.toggleClass('bg-surface-container-low text-primary', index >= pin.length);
        $slot.toggleClass('border-secondary', index === pin.length);
      });
      $submit.prop('disabled', pin.length !== 6);
    }

    function enterDigit(digit) {
      if (/^\d$/.test(digit) && pin.length < 6) {
        pin += digit;
        render();
      }
    }

    function submitPin() {
      if (pin.length !== 6) return;
      var game = window.ReanRushGame.load();
      game.pin = pin;
      game.hostStarted = false;
      window.ReanRushGame.save(game);
      window.location.href = pin === '123456' ? 'nickname.html' : '../public/game-not-found.html';
    }

    $('[data-action="pin-digit"]').on('click', function () {
      enterDigit($(this).text().trim());
    });
    $('[data-action="pin-backspace"]').on('click', function () {
      pin = pin.slice(0, -1);
      render();
    });
    $('[data-action="pin-clear"]').on('click', function () {
      pin = '';
      render();
    });
    $submit.on('click', submitPin);
    $(document).on('keydown', function (event) {
      if (/^\d$/.test(event.key)) enterDigit(event.key);
      else if (event.key === 'Backspace') pin = pin.slice(0, -1);
      else if (event.key === 'Enter') submitPin();
      else return;
      event.preventDefault();
      render();
    });

    render();
  });
})(jQuery);
