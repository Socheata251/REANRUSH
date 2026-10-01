window.ReanRushPage = { init: function () {
  var input = document.getElementById('pin-input-master');
  var container = document.getElementById('pin-boxes-container');
  var counter = document.getElementById('pin-char-counter');
  var message = document.getElementById('pin-error-message');
  var submit = document.getElementById('btn-verify-pin');
  var clear = document.getElementById('btn-clear-pin');
  var help = document.getElementById('btn-host-help');

  if (!input || !container) return;

  function render() {
    var pin = input.value.replace(/\D/g, '').slice(0, 6);
    input.value = pin;
    counter.textContent = pin.length + ' / 6 DIGITS';
    container.querySelectorAll('.pin-box').forEach(function (box, index) {
      box.replaceChildren();
      box.classList.remove('bg-secondary-fixed/20', 'bg-surface-container-low');
      if (index < pin.length) {
        box.textContent = pin[index];
        box.classList.add('bg-secondary-fixed/20', 'text-primary');
        box.classList.remove('text-outline-variant');
      } else if (index === pin.length) {
        var activeDash = document.createElement('span');
        activeDash.className = 'w-6 h-1 rounded-full bg-outline animate-pulse';
        box.appendChild(activeDash);
        box.classList.add('bg-surface-container-low', 'text-primary');
        box.classList.remove('text-outline-variant');
      } else {
        var dash = document.createElement('span');
        dash.className = 'w-5 h-1 rounded-full bg-outline-variant/60';
        box.appendChild(dash);
        box.classList.add('text-outline-variant');
      }
    });

    message.textContent = pin.length === 6
      ? 'No live arena found with PIN #' + pin + '. Check your classroom board!'
      : 'PIN incomplete (' + pin.length + '/6 digits). Ask your teacher for the 6-digit room code!';
  }

  input.value = (window.localStorage.getItem('reanrush_last_pin') || '').replace(/\D/g, '').slice(0, 6);
  input.addEventListener('input', render);
  container.addEventListener('click', function () { input.focus(); });
  clear.addEventListener('click', function () {
    input.value = '';
    window.localStorage.removeItem('reanrush_last_pin');
    render();
    input.focus();
  });
  help.addEventListener('click', function () {
    window.alert('Teacher PIN Support: Ask your class host to refresh their arena lobby dashboard.');
  });
  submit.addEventListener('click', function () {
    var pin = input.value;
    if (pin.length !== 6) {
      input.focus();
      container.classList.add('translate-x-1');
      window.setTimeout(function () { container.classList.remove('translate-x-1'); }, 150);
      return;
    }

    window.localStorage.setItem('reanrush_last_pin', pin);
    if (pin === '123456') {
      window.location.href = 'nickname.html';
      return;
    }
    render();
  });
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') submit.click();
  });
  render();
} };