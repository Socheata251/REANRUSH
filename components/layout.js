// Shared header, footer and navigation for every page.
// One place to edit: change the link lists below and all pages in that role update.
(function () {
  'use strict';

  var LOGO = 'https://lh3.googleusercontent.com/aida/AEtjO1UutalnQoduZYBueLm3vyGymd3OhMAP8MIb9G7DGB2zOljx9hqbcXRAwYH-9wOoo8YAfYfY7tDtH1bRLc56tGIYnky5efgedaEmXCkJD4dsoSqwoc6wHsJ6AhPOi0euBSmKrbtaHNs0cTAUawWa438ooX1e8bL7gsh7W7m_c6_gA6u72P4FNfiTOXXvxWrdKiSq1ksPiJSo8MLvfbWzxtCN_r4FFgLEcN3ceZ1PnDx-QpvY8pW0JscbppE';

  // ---- Which role is this page for? (decided by its folder) ----
  var folderMatch = /\/(public|student|teacher|admin)\/[^\/]*$/.exec(window.location.pathname);
  var folder = folderMatch ? folderMatch[1] : 'public';
  var file = (window.location.pathname.split('/').pop() || 'index.html') || 'index.html';

  function storedRole() {
    try {
      var r = String(window.localStorage.getItem('role') || '').toLowerCase();
      return r === 'host' ? 'teacher' : r;
    } catch (e) { return ''; }
  }
  function storedName() {
    try { return (JSON.parse(window.localStorage.getItem('user') || 'null') || {}).name || ''; } catch (e) { return ''; }
  }
  var loggedInRole = storedRole();

  function url(dir, page) { return '../' + dir + '/' + page; }
  function isActive(href) { return href.split('/').pop() === file && href.indexOf('../' + folder + '/') === 0; }
  function esc(text) { return String(text).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---- Navigation per role (edit here) ----
  var NAV = {
    public: {
      home: url('public', 'index.html'),
      primary: [
        { label: 'Games', href: url('student', 'join-pin.html') },
        { label: 'Blog', href: url('public', 'blog.html') },
        { label: 'Pricing', href: url('public', 'pricing.html') },
        { label: 'Class PIN', href: url('public', 'class-pin.html'), badge: 'PIN' }
      ],
      more: []
    },
    student: {
      home: url('student', 'home.html'),
      primary: [
        { label: 'Home', href: url('student', 'home.html') },
        { label: 'Play', href: url('student', 'join-pin.html') },
        { label: 'Flashcards', href: url('student', 'flashcards.html') },
        { label: 'Practice', href: url('student', 'practice.html') },
        { label: 'Progress', href: url('student', 'progress.html') }
      ],
      more: [
        { label: 'Game Modes', href: url('student', 'game-modes.html') },
        { label: 'Classes', href: url('student', 'classes.html') },
        { label: 'Leaderboard', href: url('student', 'leaderboard.html') },
        { label: 'Mistake Vault', href: url('student', 'mistake-vault.html') },
        { label: 'Avatar Shop', href: url('student', 'avatar-shop.html') },
        { label: 'Profile', href: url('public', 'profile.html') },
        { label: 'Settings', href: url('public', 'settings.html') }
      ]
    },
    teacher: {
      home: url('teacher', 'dashboard.html'),
      primary: [
        { label: 'Dashboard', href: url('teacher', 'dashboard.html') },
        { label: 'Classes', href: url('teacher', 'class-detail.html') },
        { label: 'Quizzes', href: url('teacher', 'quiz-creator.html') },
        { label: 'Flashcards', href: url('teacher', 'flashcard-creator.html') },
        { label: 'Reports', href: url('teacher', 'reports.html') }
      ],
      more: [
        { label: 'AI Assistant', href: url('teacher', 'ai-assistant.html') },
        { label: 'Review AI Questions', href: url('teacher', 'review-ai.html') },
        { label: 'Import Questions', href: url('teacher', 'import-questions.html') },
        { label: 'Assign Homework', href: url('teacher', 'assign-homework.html') },
        { label: 'Discover Quizzes', href: url('teacher', 'discover.html') },
        { label: 'Host Lobby', href: url('teacher', 'host-lobby.html') },
        { label: 'Live Battle', href: url('teacher', 'host-battle.html') },
        { label: 'Profile', href: url('public', 'profile.html') },
        { label: 'Settings', href: url('public', 'settings.html') }
      ],
      cta: { label: 'Host Game', href: url('teacher', 'start-game.html') }
    },
    admin: {
      home: url('admin', 'dashboard.html'),
      side: [
        { label: 'Dashboard', icon: 'grid_view', href: url('admin', 'dashboard.html') },
        { label: 'Users (អ្នកប្រើប្រាស់)', icon: 'group', href: url('admin', 'users.html') },
        { label: 'Reports (របាយការណ៍)', icon: 'analytics', href: url('admin', 'reported.html') },
        { label: 'AI Usage (ការប្រើប្រាស់ AI)', icon: 'smart_toy', href: url('admin', 'ai-usage.html') },
        { label: 'Live Games (ការប្រកួតផ្ទាល់)', icon: 'sports_esports', href: url('admin', 'live-games.html') },
        { label: 'Settings (ការកំណត់)', icon: 'settings', href: url('admin', 'settings.html') },
        { label: 'Activity Log (កំណត់ហេតុ)', icon: 'receipt_long', href: url('admin', 'activity-log.html') }
      ]
    }
  };
  var nav = NAV[folder] || NAV.public;

  var STRIP = '<div class="w-full h-2.5 bg-primary overflow-hidden flex items-center justify-center"><div class="w-full flex justify-around text-tertiary-fixed-dim text-[9px] tracking-[6px] select-none leading-none">' + new Array(51).join('❖ ').trim() + '</div></div>';
  var LINK = 'px-space-sm lg:px-space-md py-space-xs font-label-bold text-label-bold text-primary-fixed hover:text-on-primary transition-colors rounded-lg border-2 border-transparent whitespace-nowrap';
  var LINK_ON = 'px-space-sm lg:px-space-md py-space-xs font-label-bold text-label-bold bg-secondary-container text-on-secondary-container rounded-lg border-2 border-primary whitespace-nowrap';
  var BTN_GOLD = 'inline-flex items-center justify-center px-space-md py-space-xs bg-secondary-container text-on-secondary-container font-title-card text-title-card rounded-xl border-[3px] border-primary shadow-[4px_4px_0px_#00163a] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all';
  var BTN_LIGHT = 'inline-flex items-center justify-center px-space-md py-space-xs bg-surface-container-lowest text-primary-container font-title-card text-title-card rounded-xl border-[3px] border-primary shadow-[4px_4px_0px_#00163a] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all';

  function linkHtml(item) {
    var badge = item.badge ? '<span class="bg-tertiary-fixed-dim text-on-tertiary-fixed px-1.5 py-0.5 rounded text-[11px] font-bold border border-primary mr-1">' + esc(item.badge) + '</span>' : '';
    var on = isActive(item.href);
    return '<a class="' + (on ? LINK_ON : LINK) + '" href="' + item.href + '"' + (on ? ' aria-current="page"' : '') + '>' + badge + esc(item.label) + '</a>';
  }

  // ---- Header (public, student, teacher) ----
  function buildHeader() {
    var items = nav.primary.map(linkHtml).join('');
    var more = '';
    if (nav.more && nav.more.length) {
      var moreActive = nav.more.some(function (i) { return isActive(i.href); });
      more = '<details class="relative"><summary class="list-none cursor-pointer ' + (moreActive ? LINK_ON : LINK) + '">More ▾</summary>' +
        '<div class="absolute right-0 mt-2 w-56 bg-primary-container border-[3px] border-primary rounded-xl shadow-[4px_4px_0px_#00163a] p-space-xs flex flex-col z-50">' +
        nav.more.map(linkHtml).join('') + '</div></details>';
    }
    var right = '';
    if (folder === 'public') {
      if (loggedInRole && NAV[loggedInRole]) {
        right = '<a class="' + BTN_GOLD + '" href="' + NAV[loggedInRole].home + '">My ' + (loggedInRole === 'admin' ? 'Admin' : 'Dashboard') + '</a>' +
          '<a class="hidden sm:inline-flex ' + BTN_LIGHT + '" href="' + url('public', 'login.html') + '" data-action="logout">Log out</a>';
      } else {
        right = '<a class="' + BTN_GOLD + '" href="' + url('student', 'join-pin.html') + '">Join Game</a>' +
          '<a class="hidden sm:inline-flex ' + BTN_LIGHT + '" href="' + url('public', 'login.html') + '">Log in</a>' +
          '<a class="hidden md:inline-flex ' + BTN_LIGHT + '" href="' + url('public', 'signup.html') + '">Sign up</a>';
      }
    } else {
      if (nav.cta) right += '<a class="hidden sm:inline-flex ' + BTN_GOLD + '" href="' + nav.cta.href + '">' + esc(nav.cta.label) + '</a>';
      var name = storedName();
      if (name) right += '<span class="hidden xl:inline font-label-bold text-label-bold text-primary-fixed">' + esc(name) + '</span>';
      right += '<a class="' + BTN_LIGHT + '" href="' + url('public', 'login.html') + '" data-action="logout">Log out</a>';
    }
    var avatar = '<a class="w-9 h-9 rounded-full bg-primary flex items-center justify-center border-2 border-primary shrink-0" href="' + (folder === 'public' && !loggedInRole ? url('public', 'login.html') : url('public', 'profile.html')) + '" aria-label="Profile"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></a>';

    var all = nav.primary.concat(nav.more || []);
    if (nav.cta) all = all.concat([nav.cta]);
    var mobile = all.map(function (i) { return '<a class="block ' + (isActive(i.href) ? LINK_ON : LINK) + '" href="' + i.href + '">' + esc(i.label) + '</a>'; }).join('');

    var el = document.createElement('header');
    el.className = 'fixed top-0 left-0 w-full z-50 bg-primary-container border-b-[3px] border-primary';
    el.setAttribute('data-site', 'header');
    el.innerHTML =
      '<div class="h-20 max-w-7xl mx-auto px-margin-mobile lg:px-margin flex items-center justify-between gap-space-md">' +
        '<div class="flex items-center gap-space-md min-w-0">' +
          '<a class="flex items-center gap-space-sm shrink-0" href="' + nav.home + '"><img alt="ReanRush Brand Logo" class="h-8 w-auto object-contain" src="' + LOGO + '"/><span class="font-title-card text-title-card text-on-primary tracking-wide hidden sm:inline-block">ReanRush</span></a>' +
          '<nav class="hidden md:flex items-center gap-1 ml-space-sm" aria-label="Main">' + items + more + '</nav>' +
        '</div>' +
        '<div class="flex items-center gap-space-sm">' + right + avatar +
          '<button type="button" class="md:hidden w-9 h-9 rounded-lg bg-primary border-2 border-primary flex items-center justify-center" aria-label="Menu" aria-expanded="false" data-site="menu-button"><span class="material-symbols-outlined text-on-primary text-[22px]">menu</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="hidden md:hidden bg-primary-container border-t-[3px] border-primary px-margin-mobile py-space-sm max-h-[70vh] overflow-y-auto" data-site="mobile-menu">' + mobile + '</div>' +
      STRIP;
    return el;
  }

  // ---- Sidebar (admin) ----
  function buildSidebar() {
    var links = nav.side.map(function (i) {
      var on = isActive(i.href);
      return '<a class="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg border-[2px] transition-all ' +
        (on ? 'bg-secondary-container text-on-secondary-container border-transparent shadow-[3px_3px_0px_#00163a] font-label-bold' : 'text-primary-fixed hover:bg-primary hover:text-on-primary border-transparent') +
        '" href="' + i.href + '"' + (on ? ' aria-current="page"' : '') + '><span class="material-symbols-outlined text-[20px]">' + i.icon + '</span><span class="font-body-md text-body-md">' + esc(i.label) + '</span></a>';
    }).join('');
    var name = storedName() || 'Admin';
    var el = document.createElement('aside');
    el.className = 'fixed left-0 top-0 h-full w-72 bg-primary-container z-50 flex flex-col border-r-[3px] border-primary-container shadow-[4px_0px_0px_#0B2A5B]';
    el.setAttribute('data-site', 'sidebar');
    el.innerHTML =
      '<div class="h-16 flex items-center px-space-md bg-primary-container border-b-[3px] border-primary"><a class="flex items-center gap-space-sm" href="' + nav.home + '"><img alt="ReanRush Brand Logo" class="h-8 w-auto object-contain" src="' + LOGO + '"/><span class="font-headline-md text-headline-md text-on-primary tracking-wide">ReanRush</span></a></div>' +
      '<div class="px-space-md py-space-sm"><span class="font-badge-arcade text-badge-arcade text-on-tertiary-container uppercase tracking-wider bg-tertiary px-space-sm py-space-xs rounded border border-on-tertiary-container">Admin Control Hub</span></div>' +
      '<nav class="flex-1 px-space-sm space-y-1 overflow-y-auto" aria-label="Admin">' + links + '</nav>' +
      '<div class="p-space-sm bg-primary border-t-[3px] border-primary-container"><div class="bg-primary-container rounded-lg p-space-sm border-[2px] border-primary shadow-[2px_2px_0px_#00163a] flex items-center justify-between">' +
        '<div class="flex items-center gap-space-xs overflow-hidden"><div class="w-8 h-8 rounded-full bg-secondary-container border border-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-secondary-container text-[18px]">shield_person</span></div><div class="truncate"><p class="font-label-bold text-label-bold text-on-primary leading-tight truncate">' + esc(name) + '</p><p class="font-body-sm text-body-sm text-primary-fixed-dim leading-tight truncate">Administrator</p></div></div>' +
        '<a class="p-1.5 rounded bg-primary hover:bg-error hover:text-on-error text-primary-fixed transition-colors border border-primary" title="Log out" aria-label="Log out" href="' + url('public', 'login.html') + '" data-action="logout"><span class="material-symbols-outlined text-[18px] block">logout</span></a>' +
      '</div></div>';
    return el;
  }

  // ---- Footer (all roles) ----
  function buildFooter() {
    function col(title, items) {
      return '<div class="flex flex-col gap-space-sm"><h4 class="font-title-card text-title-card text-tertiary-fixed-dim">' + title + '</h4><ul class="flex flex-col gap-space-xs font-body-sm text-body-sm">' +
        items.map(function (i) { return '<li><a class="text-primary-fixed hover:text-on-primary underline-offset-2 hover:underline" href="' + i.href + '">' + esc(i.label) + '</a></li>'; }).join('') + '</ul></div>';
    }
    var settings = folder === 'admin' ? url('admin', 'settings.html') : url('public', 'settings.html');
    var el = document.createElement('footer');
    el.className = 'w-full bg-primary-container text-on-primary' + (folder === 'admin' ? ' pl-72' : '');
    el.setAttribute('data-site', 'footer');
    el.innerHTML = STRIP +
      '<div class="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg mb-space-xl">' +
        '<div class="flex flex-col gap-space-sm"><div class="flex items-center gap-space-sm"><img alt="ReanRush Brand Logo" class="h-8 w-auto object-contain" src="' + LOGO + '"/><span class="font-headline-md text-headline-md text-on-primary">ReanRush</span></div>' +
        '<p class="font-body-sm text-body-sm text-on-primary-container">High-octane quiz battles engineered for Cambodian high school classrooms. Fueling academic competition and collaborative learning.</p></div>' +
        col('Play &amp; Learn', [
          { label: 'Join a Game', href: url('student', 'join-pin.html') },
          { label: 'Flashcards', href: url('student', 'flashcards.html') },
          { label: 'Leaderboard', href: url('student', 'leaderboard.html') },
          { label: 'Class PIN', href: url('public', 'class-pin.html') }
        ]) +
        col('Teachers &amp; Schools', [
          { label: 'Teacher Dashboard', href: url('teacher', 'dashboard.html') },
          { label: 'Quiz Creator', href: url('teacher', 'quiz-creator.html') },
          { label: 'Pricing', href: url('public', 'pricing.html') },
          { label: 'Blog', href: url('public', 'blog.html') }
        ]) +
        col('Account', [
          { label: 'Log in', href: url('public', 'login.html') },
          { label: 'Sign up', href: url('public', 'signup.html') },
          { label: 'Forgot password', href: url('public', 'forgot-password.html') },
          { label: 'Settings', href: settings }
        ]) +
      '</div><div class="pt-space-md border-t-[2px] border-primary/60 flex flex-col sm:flex-row items-center justify-between gap-space-sm">' +
        '<p class="font-body-sm text-body-sm text-primary-fixed">Copyright © ' + new Date().getFullYear() + ' ReanRush. Made for Cambodian high school learners.</p>' +
        '<p class="font-body-sm text-body-sm text-on-primary-container text-xs"><a class="hover:underline" href="' + url('public', 'home.html') + '">Battle Hub</a></p>' +
      '</div></div>';
    return el;
  }

  function mount() {
    if (document.querySelector('[data-site="header"],[data-site="sidebar"]')) return;
    var body = document.body;

    // Remove any leftover old header/footer at the top level so there is only one.
    Array.prototype.slice.call(body.children).forEach(function (child) {
      var tag = child.tagName;
      if (tag === 'HEADER' || tag === 'FOOTER' || (tag === 'ASIDE' && !child.hasAttribute('data-site')) ) child.parentNode.removeChild(child);
    });

    var style = document.createElement('style');
    style.setAttribute('data-site', 'style');
    style.textContent = folder === 'admin'
      ? 'body{padding-left:0}'
      : 'body{padding-top:5rem}details>summary::-webkit-details-marker{display:none}';
    document.head.appendChild(style);

    if (folder === 'admin') {
      body.insertBefore(buildSidebar(), body.firstChild);
    } else {
      body.insertBefore(buildHeader(), body.firstChild);
      // The old design reserved space for its own header; the shared header does that now.
      var main = document.querySelector('main');
      if (main) ['pt-16', 'pt-20', 'pt-24'].forEach(function (c) { main.classList.remove(c); });
      Array.prototype.forEach.call(document.querySelectorAll('.pl-64'), function (el) { el.classList.remove('pl-64'); });
    }
    body.appendChild(buildFooter());
    body.setAttribute('data-layout', folder);

    var btn = document.querySelector('[data-site="menu-button"]');
    var panel = document.querySelector('[data-site="mobile-menu"]');
    if (btn && panel) {
      btn.addEventListener('click', function () {
        var open = panel.classList.toggle('hidden');
        btn.setAttribute('aria-expanded', String(!open));
        panel.classList.toggle('md:hidden', true);
      });
    }
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
