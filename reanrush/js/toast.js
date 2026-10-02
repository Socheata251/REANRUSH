(function () {
  function ensureToast() {
    var container = document.getElementById('toast');
    if (container) return container;

    container = document.createElement('div');
    container.id = 'toast';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    container.style.position = 'fixed';
    container.style.right = '20px';
    container.style.top = '20px';
    container.style.zIndex = '9999';
    container.style.maxWidth = '320px';
    container.style.padding = '12px 16px';
    container.style.borderRadius = '14px';
    container.style.background = '#00163a';
    container.style.border = '2px solid #f8bd4d';
    container.style.color = '#fff';
    container.style.fontSize = '14px';
    container.style.fontWeight = '600';
    container.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.18)';
    container.style.opacity = '0';
    container.style.transform = 'translateY(-8px)';
    container.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    container.hidden = true;
    document.body.appendChild(container);
    return container;
  }

  function showToast(message, variant) {
    var toast = ensureToast();
    if (!message) return;

    var tone = variant || 'success';
    toast.textContent = message;
    toast.hidden = false;
    toast.style.background = tone === 'error' ? '#b3261e' : tone === 'warning' ? '#8a5b00' : '#00163a';
    toast.style.borderColor = tone === 'error' ? '#f9c2bf' : tone === 'warning' ? '#f8bd4d' : '#f8bd4d';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    window.clearTimeout(window.toastTimer);
    window.toastTimer = window.setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px)';
      window.setTimeout(function () {
        toast.hidden = true;
      }, 180);
    }, 2600);
  }

  window.showToast = showToast;
  window.ReanRushToast = { show: showToast };
})();
