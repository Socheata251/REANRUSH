// Prototype-only guard; replace this check with ASP.NET Identity authorization later.
(function () {
  function normalizeRole(role) {
    if (!role) return '';
    var value = String(role).trim().toLowerCase();
    var aliasMap = { host: 'teacher', teacher: 'teacher', student: 'student', admin: 'admin' };
    return aliasMap[value] || value;
  }

  function currentPageRole() {
    var match = /\/(student|teacher|admin)\/[^\/]*$/.exec(window.location.pathname);
    return match ? match[1] : '';
  }

  function readRole() {
    try { return normalizeRole(window.localStorage.getItem('role')); } catch (e) { return ''; }
  }

  window.logoutUser = function () {
    try {
      window.localStorage.removeItem('role');
      window.localStorage.removeItem('user');
    } catch (e) {}
    if (window.ReanRushStore && typeof window.ReanRushStore.remove === 'function') {
      window.ReanRushStore.remove('reanrush_store');
    }
    window.location.href = '../public/login.html';
  };

  var pageRole = currentPageRole();
  if (!pageRole) return;

  var role = readRole();
  // Student pages are open to guests (PIN code, QR scan, home). Teacher and admin still need login.
  var allowed = pageRole === 'student' ? (role === '' || role === 'student') : role === pageRole;
  if (!allowed) {
    window.location.replace('../public/login.html');
    return;
  }

  document.addEventListener('click', function (event) {
    var target = event.target.closest && event.target.closest('[data-action="logout"]');
    if (!target) return;
    event.preventDefault();
    window.logoutUser();
  });
})();