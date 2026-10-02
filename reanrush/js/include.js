$(function () {
  var root = (document.body.getAttribute('data-root') || '.').replace(/\/+$/, '') || '.';
  var storedRole = window.localStorage && window.localStorage.getItem('role');
  var pathRoleMatch = /(?:^|\/)(student|teacher|admin)(?:\/|$)/.exec(window.location.pathname);
  var inferredRole = pathRoleMatch ? pathRoleMatch[1] : (['student', 'teacher', 'admin'].includes(storedRole) ? storedRole : '');
  var layout = document.body.getAttribute('data-layout') || inferredRole || 'public';
  document.body.setAttribute('data-layout', layout);
  var shells = {
    'stitch-error': [
      { mount: 'header', file: 'header-game-not-found.html' }
    ],
    public: [
      { mount: 'header', file: 'header-public.html' },
      { mount: 'nav', file: 'nav-public.html' }
    ],
    student: [
      { mount: 'header', file: 'header-public.html' },
      { mount: 'bottom-nav', file: 'bottom-nav-student.html' }
    ],
    teacher: [
      { mount: 'header-teacher', file: 'header-teacher.html' },
      { mount: 'sidebar-teacher', file: 'sidebar-teacher.html' }
    ],
    admin: [{ mount: 'sidebar', file: 'sidebar-admin.html' }]
  };
  var shell = shells[layout] || shells.public;
  var common = layout === 'stitch-error' ? [
    { mount: 'footer', file: 'footer-game-not-found.html' },
    { mount: 'toast', file: 'toast.html' }
  ] : [
    { mount: 'khmer-strip', file: 'khmer-strip.html' },
    { mount: 'footer', file: 'footer.html' },
    { mount: 'toast', file: 'toast.html' }
  ];

  function ensureMount(name) {
    var mount = $('[data-include="' + name + '"]').first();
    if (mount.length) return mount;

    mount = $('<div>').attr('data-include', name);
    var main = $('main').first();
    if (name === 'header' || name === 'header-teacher' || name === 'nav' || name === 'sidebar' || name === 'sidebar-teacher' || name === 'khmer-strip') {
      if (main.length) mount.insertBefore(main);
      else mount.prependTo('body');
    } else {
      mount.appendTo('body');
    }
    return mount;
  }

  var loads = shell.concat(common).map(function (part) {
    return new Promise(function (resolve) {
      ensureMount(part.mount).load(root + '/components/' + part.file, function () {
        resolve();
      });
    });
  });
  Promise.all(loads).then(function () {
    $('[data-route]').each(function () {
      $(this).attr('href', root + '/' + $(this).attr('data-route'));
    });
    var current = location.pathname.split('/').pop();
    $('.nav-link, .sidebar-link, .bottom-nav-link').each(function () {
      if ($(this).attr('href').split('/').pop() === current) $(this).attr('aria-current', 'page');
    });
    $('[data-logout]').prop('hidden', !window.localStorage.getItem('role'));
  });
});
