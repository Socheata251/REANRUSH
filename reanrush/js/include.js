$(function () {
  var root = document.body.getAttribute('data-root') || '.';
  var parts = ['header', 'nav', 'khmer-strip', 'footer', 'toast'];
  var loads = parts.map(function (part) {
    return new Promise(function (resolve) {
      $('[data-include="' + part + '"]').load(root + '/components/' + part + '.html', function () {
        resolve();
      });
    });
  });
  Promise.all(loads).then(function () {
    $('[data-route]').each(function () {
      $(this).attr('href', root + '/' + $(this).attr('data-route'));
    });
    var current = location.pathname.split('/').pop();
    $('.nav-link').each(function () {
      if ($(this).attr('href').split('/').pop() === current) $(this).attr('aria-current', 'page');
    });
  });
});
