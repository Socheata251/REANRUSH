$(function () {
  $(document).on('click', '[data-action="copy"]', function () {
    var value = $(this).attr('data-copy') || '';
    if (navigator.clipboard) navigator.clipboard.writeText(value);
    window.showToast('Copied ' + value);
  });

  $(document).on('submit', 'form[data-next]', function (event) {
    event.preventDefault();
    if (!this.reportValidity()) return;
    var next = $(this).attr('data-next');
    window.showToast('Ready! Let’s go.');
    window.setTimeout(function () { location.href = next; }, 450);
  });

  $(document).on('click', '[data-answer]', function () {
    var correct = $(this).attr('data-answer') === 'correct';
    $('[data-answer]').prop('disabled', true);
    $(this).addClass(correct ? 'answer-correct' : 'answer-wrong');
    window.showToast(correct ? 'Nice answer! +100 points' : 'Good try. Keep learning!');
  });

  if (window.ReanRushPage && typeof window.ReanRushPage.init === 'function') window.ReanRushPage.init();
});
