(function ($) {
  'use strict';

  window.ReanRushPage = { init: function () {
    var game = window.ReanRushGame.load();
    var $input = $('#pin-input-master');
    var $container = $('#pin-boxes-container');
    var $message = $('#pin-error-message');
    var $submit = $('#btn-verify-pin');

    function render() {
      var pin = $input.val().replace(/\D/g, '').slice(0, 6);
      $input.val(pin);
      $('#pin-char-counter').text(pin.length + ' / 6 DIGITS');
      $('.pin-box').each(function (index) {
        var $box = $(this).empty().removeClass('bg-secondary-fixed/20 bg-surface-container-low text-outline-variant');
        if (index < pin.length) $box.text(pin[index]).addClass('bg-secondary-fixed/20 text-primary');
        else if (index === pin.length) $box.html('<span class="w-6 h-1 rounded-full bg-outline animate-pulse"></span>').addClass('bg-surface-container-low text-primary');
        else $box.html('<span class="w-5 h-1 rounded-full bg-outline-variant/60"></span>').addClass('text-outline-variant');
      });
      $message.text(pin.length === 6
        ? 'No live arena found with PIN #' + pin + '. Check your classroom board!'
        : 'PIN incomplete (' + pin.length + '/6 digits). Ask your teacher for the 6-digit room code!');
      $submit.prop('disabled', pin.length !== 6);
    }

    $input.val(game.pin || '').on('input', render).on('keydown', function (event) {
      if (event.key === 'Enter') $submit.trigger('click');
    });
    $container.on('click', function () { $input.trigger('focus'); });
    $('#btn-clear-pin').on('click', function () {
      $input.val('');
      game.pin = '';
      window.ReanRushGame.save(game);
      render();
      $input.trigger('focus');
    });
    $('#btn-host-help').on('click', function () {
      window.alert('Teacher PIN Support: Ask your class host to refresh their arena lobby dashboard.');
    });
    $submit.on('click', function () {
      var pin = $input.val();
      if (pin.length !== 6) {
        $input.trigger('focus');
        return;
      }
      game.pin = pin;
      window.ReanRushGame.save(game);
      if (pin === '123456') window.location.href = '../student/nickname.html';
      else render();
    });
    render();
  } };
})(jQuery);