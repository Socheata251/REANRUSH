window.ReanRushPage = { init: function () {
  // Accept a 6-digit PIN only and route invalid values to the not-found screen.
  var form = $('#pin-form');
  var input = $('#pin-input');

  input.trigger('focus').on('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 6);
  });

  form.on('submit', function (event) {
    event.preventDefault();
    var pin = input.val().trim();

    if (!/^\d{6}$/.test(pin)) {
      window.showToast('Enter a valid 6-digit PIN.', 'error');
      return;
    }

    if (pin === '123456') {
      window.localStorage.setItem('reanrush_last_pin', pin);
      window.location.href = 'nickname.html';
      return;
    }

    window.localStorage.setItem('reanrush_last_pin', pin);
    window.location.href = 'game-not-found.html';
  });
} };
