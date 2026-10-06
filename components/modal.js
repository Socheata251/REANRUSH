(function ($) {
  function getModal(id) {
    return document.getElementById(id);
  }

  function openModal(id) {
    var modal = getModal(id);
    if (!modal) return;

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('opacity-100');
    modal.classList.remove('opacity-0');
    modal.classList.add('pointer-events-auto');
    modal.classList.remove('pointer-events-none');

    var focusTarget = modal.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
    if (focusTarget) {
      focusTarget.focus();
    }
  }

  function closeModal(id) {
    var modal = getModal(id);
    if (!modal) return;

    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modal.classList.remove('pointer-events-auto');
    modal.classList.add('pointer-events-none');
  }

  $(document).on('click', '[data-action="open-modal"]', function (event) {
    event.preventDefault();
    var target = $(this).attr('data-target');
    if (target) openModal(target);
  });

  $(document).on('click', '[data-action="close-modal"]', function (event) {
    event.preventDefault();
    var target = $(this).attr('data-target') || $(this).closest('[role="dialog"]').attr('id');
    if (target) closeModal(target);
  });

  $(document).on('click', '[role="dialog"]', function (event) {
    if (event.target === this) {
      closeModal(this.id);
    }
  });

  $(document).on('keydown', function (event) {
    if (event.key !== 'Escape') return;

    var activeDialog = document.querySelector('[role="dialog"][aria-hidden="false"]');
    if (activeDialog) {
      closeModal(activeDialog.id);
    }
  });

  window.ReanRushModal = {
    open: openModal,
    close: closeModal
  };
})(window.jQuery || window.$);
