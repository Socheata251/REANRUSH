window.showToast = function (message, variant) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.style.background = variant === 'error' ? '#b3261e' : '#00163a';
  toast.style.borderColor = variant === 'error' ? '#f9c2bf' : '#f8bd4d';
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(function () {
    toast.hidden = true;
    toast.style.background = '#00163a';
    toast.style.borderColor = '#f8bd4d';
  }, 2600);
};
