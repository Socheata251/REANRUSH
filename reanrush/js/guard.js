(function ($) {
  function normalizeRole(role) {
    if (!role) return '';
    var value = String(role).trim().toLowerCase();
    var aliasMap = {
      host: 'teacher',
      teacher: 'teacher',
      student: 'student',
      admin: 'admin'
    };
    return aliasMap[value] || value;
  }

  function currentPageRole() {
    var match = /(\/pages\/)(student|teacher|admin)(\/|$)/.exec(window.location.pathname);
    return match ? match[2] : '';
  }

  function redirectToLogin() {
    window.location.replace('../public/login.html');
  }

  window.logoutUser = function () {
    if (window.localStorage) {
      window.localStorage.removeItem('role');
      window.localStorage.removeItem('user');
    }

    if (window.ReanRushStore && typeof window.ReanRushStore.remove === 'function') {
      window.ReanRushStore.remove('reanrush_store');
    }

    window.location.href = '../public/login.html';
  };

  $(function () {
    var pageRole = currentPageRole();
    if (!pageRole) return;

    var storedRole = normalizeRole(window.localStorage.getItem('role'));
    if (!storedRole || storedRole !== pageRole) {
      redirectToLogin();
      return;
    }

    $(document).on('click', '[data-action="logout"]', function (event) {
      event.preventDefault();
      window.logoutUser();
    });
  });
})(window.jQuery || window.$);
