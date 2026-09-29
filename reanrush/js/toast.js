window.showToast = function (message) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(function () { toast.hidden = true; }, 2600);
};
