// Shared header, footer and navigation for every page.
// One place to edit: change the link lists below and all pages in that role update.
(function () {
  'use strict';
  var layoutScript = document.currentScript;

  // Logo picture. Swap this file for your own logo (path works from the root and from /screens/<role>/).
  var IMG_BASE = /\/(public|student|teacher|admin)\/[^\/]*$/.test(window.location.pathname) ? '../../images/' : 'images/';
  var LOGO = IMG_BASE + 'rushy-mascot-534cceebad.jpg';

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
  // Settings and Profile live in /public/ but are used by students and teachers:
  // show the header of whoever is using them (guests get the student header).
  var layoutRole = folder;
  if (folder === 'public' && (file === 'settings.html' || file === 'profile.html') && loggedInRole !== 'admin') {
    layoutRole = loggedInRole === 'teacher' ? 'teacher' : 'student';
  }
  var nav = NAV[layoutRole] || NAV.public;

  var STRIP = '<div class="w-full h-2.5 bg-primary overflow-hidden flex items-center justify-center"><div class="w-full flex justify-around text-tertiary-fixed-dim text-[9px] tracking-[6px] select-none leading-none">' + new Array(51).join('❖ ').trim() + '</div></div>';
  var LINK = 'px-space-sm lg:px-space-md py-space-xs font-label-bold text-label-bold text-primary-fixed hover:text-on-primary transition-colors rounded-lg border-2 border-transparent whitespace-nowrap';
  var LINK_ON = 'px-space-sm lg:px-space-md py-space-xs font-label-bold text-label-bold bg-secondary-container text-on-secondary-container rounded-lg border-2 border-primary whitespace-nowrap';
  var BTN_GOLD = 'whitespace-nowrap shrink-0 inline-flex items-center justify-center px-space-md py-space-xs bg-secondary-container text-on-secondary-container font-title-card text-title-card rounded-xl border-[3px] border-primary shadow-[4px_4px_0px_#00163a] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all';
  var BTN_LIGHT = 'whitespace-nowrap shrink-0 inline-flex items-center justify-center px-space-md py-space-xs bg-surface-container-lowest text-primary-container font-title-card text-title-card rounded-xl border-[3px] border-primary shadow-[4px_4px_0px_#00163a] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all';

  function linkHtml(item) {
    var badge = item.badge ? '<span class="bg-tertiary-fixed-dim text-on-tertiary-fixed px-1.5 py-0.5 rounded text-[11px] font-bold border border-primary mr-1">' + esc(item.badge) + '</span>' : '';
    var on = isActive(item.href);
    return '<a class="' + (on ? LINK_ON : LINK) + '" href="' + item.href + '"' + (on ? ' aria-current="page"' : '') + '>' + badge + esc(item.label) + '</a>';
  }


  // ---- Student and teacher header: main links + settings + profile on big screens, burger popup (all links) on every screen ----
  function studentBurger(el, all, role) {
    var oldPanel = el.querySelector('[data-site="mobile-menu"]');
    if (oldPanel) oldPanel.parentNode.removeChild(oldPanel);
    // Small screens: Log out lives in the popup, so hide it in the header there.
    Array.prototype.forEach.call(el.querySelectorAll('[data-action="logout"]'), function (a) { a.classList.add('hidden'); if (role !== 'teacher') a.classList.add('md:inline-flex'); });
    // Big screens: keep the main links, drop "More" (the burger menu has everything).
    var moreBox = el.querySelector('nav[aria-label="Main"] details');
    if (moreBox) moreBox.parentNode.removeChild(moreBox);
    // Settings icon next to the profile icon (profile icon already links to Profile).
    var profileLink = el.querySelector('a[aria-label="Profile"]');
    if (profileLink) {
      profileLink.insertAdjacentHTML('beforebegin',
        '<a class="hidden md:flex w-9 h-9 rounded-full bg-primary items-center justify-center border-2 border-primary shrink-0" href="' + url('public', 'settings.html') + '" aria-label="Settings" title="Settings"><span class="material-symbols-outlined text-on-primary text-[18px]">settings</span></a>');
    }
    // Teacher has more links + a Host Game button, so the link row starts at lg (burger covers smaller screens).
    if (role === 'teacher') {
      var mainNav = el.querySelector('nav[aria-label="Main"]');
      if (mainNav) { mainNav.classList.remove('md:flex'); mainNav.classList.add('lg:flex'); }
      var settingsIcon = el.querySelector('a[aria-label="Settings"]');
      if (settingsIcon) { settingsIcon.classList.remove('md:flex'); settingsIcon.classList.add('lg:flex'); }
    }
    var btn = el.querySelector('[data-site="menu-button"]');
    if (!btn) return;
    btn.classList.remove('md:hidden');

    var links = all.map(function (i) {
      var on = isActive(i.href);
      return '<a class="flex items-center px-space-md py-2.5 rounded-lg border-2 ' + (on ? 'bg-secondary-container text-on-secondary-container border-primary' : 'text-primary-fixed border-transparent hover:bg-primary hover:text-on-primary') + ' font-label-bold text-label-bold" href="' + i.href + '">' + esc(i.label) + '</a>';
    }).join('');
    var name = storedName();
    var pop = document.createElement('div');
    pop.setAttribute('data-site', 'burger-popup');
    pop.className = 'hidden fixed inset-0 z-[60]';
    pop.innerHTML =
      '<div class="absolute inset-0 bg-black/50" data-burger-close></div>' +
      '<aside class="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-primary-container border-l-[3px] border-primary shadow-[-4px_0px_0px_#00163a] flex flex-col" role="dialog" aria-modal="true" aria-label="Menu">' +
        '<div class="h-16 flex items-center justify-between px-space-md border-b-[3px] border-primary">' +
          '<span class="font-title-card text-title-card text-on-primary">' + (name ? esc(name) : 'Menu') + '</span>' +
          '<button type="button" class="w-9 h-9 rounded-lg bg-primary border-2 border-primary flex items-center justify-center" aria-label="Close menu" data-burger-close><span class="material-symbols-outlined text-on-primary text-[22px]">close</span></button>' +
        '</div>' +
        '<nav class="flex-1 overflow-y-auto p-space-sm flex flex-col gap-1" aria-label="Menu">' + links + '</nav>' +
        '<div class="p-space-sm border-t-[3px] border-primary"><a class="' + BTN_LIGHT + ' w-full" href="' + url('public', 'login.html') + '"' + (loggedInRole ? ' data-action="logout">Log out' : '>Log in') + '</a></div>' +
      '</aside>';
    document.body.appendChild(pop);

    function setOpen(open) {
      pop.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', function () { setOpen(true); });
    pop.addEventListener('click', function (e) {
      if (e.target.closest('[data-burger-close]') || e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
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
    if (layoutRole === 'public') {
      if (loggedInRole && NAV[loggedInRole]) {
        right = '<a class="' + BTN_GOLD + '" href="' + NAV[loggedInRole].home + '">My ' + (loggedInRole === 'admin' ? 'Admin' : 'Dashboard') + '</a>' +
          '<a class="hidden sm:inline-flex ' + BTN_LIGHT + '" href="' + url('public', 'login.html') + '" data-action="logout">Log out</a>';
      } else {
        right = '<a class="' + BTN_GOLD + '" href="' + url('student', 'join-pin.html') + '">Join Game</a>' +
          '<a class="hidden sm:inline-flex ' + BTN_LIGHT + '" href="' + url('public', 'login.html') + '">Log in</a>' +
          '<a class="hidden md:inline-flex ' + BTN_LIGHT + '" href="' + url('public', 'signup.html') + '">Sign up</a>';
      }
    } else {
      if (nav.cta) right += '<a class="hidden ' + (layoutRole === 'teacher' ? 'xl' : 'sm') + ':inline-flex ' + BTN_GOLD + '" href="' + nav.cta.href + '">' + esc(nav.cta.label) + '</a>';
      var name = storedName();
      if (name && layoutRole !== 'student' && layoutRole !== 'teacher') right += '<span class="hidden xl:inline whitespace-nowrap font-label-bold text-label-bold text-primary-fixed">' + esc(name) + '</span>';
      var guest = layoutRole === 'student' && !loggedInRole;
      right += guest
        ? '<a class="' + BTN_LIGHT + '" href="' + url('public', 'login.html') + '">Log in</a>'
        : '<a class="' + BTN_LIGHT + '" href="' + url('public', 'login.html') + '" data-action="logout">Log out</a>';
    }
    var avatar = '<a class="w-9 h-9 rounded-full bg-primary flex items-center justify-center border-2 border-primary shrink-0" href="' + ((layoutRole === 'public' || layoutRole === 'student') && !loggedInRole ? url('public', 'login.html') : url('public', 'profile.html')) + '" aria-label="Profile"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></a>';

    var all = nav.primary.concat(nav.more || []);
    if (nav.cta) all = all.concat([nav.cta]);
    var mobile = all.map(function (i) { return '<a class="block ' + (isActive(i.href) ? LINK_ON : LINK) + '" href="' + i.href + '">' + esc(i.label) + '</a>'; }).join('');

    var el = document.createElement('header');
    el.className = 'fixed top-0 left-0 w-full z-50 bg-primary-container border-b-[3px] border-primary';
    el.setAttribute('data-site', 'header');
    el.innerHTML =
      '<div class="h-20 max-w-7xl mx-auto px-margin-mobile lg:px-margin flex items-center justify-between gap-space-md">' +
        '<div class="flex items-center gap-space-md min-w-0">' +
          '<a class="flex items-center gap-space-sm shrink-0" href="' + nav.home + '"><img alt="ReanRush Brand Logo" class="h-10 w-10 rounded-full bg-white border-2 border-primary object-contain shrink-0" src="' + LOGO + '" onerror="this.remove()"/><span class="font-title-card text-title-card text-on-primary tracking-wide hidden sm:inline-block">ReanRush</span></a>' +
          '<nav class="hidden md:flex items-center gap-1 ml-space-sm" aria-label="Main">' + items + more + '</nav>' +
        '</div>' +
        '<div class="flex items-center gap-space-sm shrink-0">' + right + langButton() + avatar +
          '<button type="button" class="md:hidden w-9 h-9 rounded-lg bg-primary border-2 border-primary flex items-center justify-center" aria-label="Menu" aria-expanded="false" data-site="menu-button"><span class="material-symbols-outlined text-on-primary text-[22px]">menu</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="hidden md:hidden bg-primary-container border-t-[3px] border-primary px-margin-mobile py-space-sm max-h-[70vh] overflow-y-auto" data-site="mobile-menu">' + mobile + '</div>' +
      STRIP;
    if (layoutRole === 'student' || layoutRole === 'teacher') studentBurger(el, all, layoutRole);
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
      '<div class="h-16 flex items-center px-space-md bg-primary-container border-b-[3px] border-primary"><a class="flex items-center gap-space-sm" href="' + nav.home + '"><img alt="ReanRush Brand Logo" class="h-10 w-10 rounded-full bg-white border-2 border-primary object-contain shrink-0" src="' + LOGO + '" onerror="this.remove()"/><span class="font-headline-md text-headline-md text-on-primary tracking-wide">ReanRush</span></a></div>' +
      '<div class="px-space-md py-space-sm"><span class="font-badge-arcade text-badge-arcade text-on-tertiary-container uppercase tracking-wider bg-tertiary px-space-sm py-space-xs rounded border border-on-tertiary-container">Admin Control Hub</span></div>' +
      '<nav class="flex-1 px-space-sm space-y-1 overflow-y-auto" aria-label="Admin">' + links + '</nav>' +
      '<div class="px-space-md py-space-sm flex justify-center">' + langButton() + '</div>' +
      '<div class="p-space-sm bg-primary border-t-[3px] border-primary-container"><div class="bg-primary-container rounded-lg p-space-sm border-[2px] border-primary shadow-[2px_2px_0px_#00163a] flex items-center justify-between">' +
        '<div class="flex items-center gap-space-xs overflow-hidden"><div class="w-8 h-8 rounded-full bg-secondary-container border border-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-secondary-container text-[18px]">shield_person</span></div><div class="truncate"><p class="font-label-bold text-label-bold text-on-primary leading-tight truncate">' + esc(name) + '</p><p class="font-body-sm text-body-sm text-primary-fixed-dim leading-tight truncate">Administrator</p></div></div>' +
        '<a class="p-1.5 rounded bg-primary hover:bg-error hover:text-on-error text-primary-fixed transition-colors border border-primary" title="Log out" aria-label="Log out" href="' + url('public', 'login.html') + '" data-action="logout"><span class="material-symbols-outlined text-[18px] block">logout</span></a>' +
      '</div></div>';
    return el;
  }

  // ---- Footer (all roles) ----
  // Footer link columns: teacher and student get links for their own work, everyone else gets the public links.
  function footerColumns(col, settings) {
    if (layoutRole === 'teacher') {
      return col('Teach', [
          { label: 'Dashboard', href: url('teacher', 'dashboard.html') },
          { label: 'Host a Game', href: url('teacher', 'start-game.html') },
          { label: 'Quiz Creator', href: url('teacher', 'quiz-creator.html') },
          { label: 'AI Assistant', href: url('teacher', 'ai-assistant.html') }
        ]) +
        col('Manage', [
          { label: 'Classes', href: url('teacher', 'class-detail.html') },
          { label: 'Assign Homework', href: url('teacher', 'assign-homework.html') },
          { label: 'Reports', href: url('teacher', 'reports.html') },
          { label: 'Discover Quizzes', href: url('teacher', 'discover.html') }
        ]) +
        col('Account', [
          { label: 'Profile', href: url('public', 'profile.html') },
          { label: 'Settings', href: settings },
          { label: 'Pricing', href: url('public', 'pricing.html') },
          { label: 'Blog', href: url('public', 'blog.html') }
        ]);
    }
    if (layoutRole === 'admin') {
      return col('Monitor', [
          { label: 'Dashboard', href: url('admin', 'dashboard.html') },
          { label: 'Live Games', href: url('admin', 'live-games.html') },
          { label: 'Reported Quizzes', href: url('admin', 'reported.html') },
          { label: 'Activity Log', href: url('admin', 'activity-log.html') }
        ]) +
        col('Manage', [
          { label: 'Users', href: url('admin', 'users.html') },
          { label: 'AI Usage', href: url('admin', 'ai-usage.html') },
          { label: 'Settings', href: settings },
          { label: 'Profile', href: url('public', 'profile.html') }
        ]) +
        col('Account', [
          { label: 'Log out', href: url('public', 'login.html'), logout: true },
          { label: 'Pricing', href: url('public', 'pricing.html') },
          { label: 'Blog', href: url('public', 'blog.html') }
        ]);
    }
    if (layoutRole === 'student') {
      return col('Play', [
          { label: 'Join a Game', href: url('student', 'join-pin.html') },
          { label: 'Game Modes', href: url('student', 'game-modes.html') },
          { label: 'Practice', href: url('student', 'practice.html') },
          { label: 'Flashcards', href: url('student', 'flashcards.html') }
        ]) +
        col('My Progress', [
          { label: 'Leaderboard', href: url('student', 'leaderboard.html') },
          { label: 'Progress', href: url('student', 'progress.html') },
          { label: 'Mistake Vault', href: url('student', 'mistake-vault.html') },
          { label: 'Classes', href: url('student', 'classes.html') }
        ]) +
        col('Account', [
          { label: 'Profile', href: url('public', 'profile.html') },
          { label: 'Settings', href: settings },
          { label: 'Avatar Shop', href: url('student', 'avatar-shop.html') },
          { label: loggedInRole ? 'Log out' : 'Log in', href: url('public', 'login.html'), logout: !!loggedInRole }
        ]);
    }
    return col('Play &amp; Learn', [
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
      ]);
  }

  function buildFooter() {
    function col(title, items) {
      return '<div class="flex flex-col gap-space-sm"><h4 class="font-title-card text-title-card text-tertiary-fixed-dim">' + title + '</h4><ul class="flex flex-col gap-space-xs font-body-sm text-body-sm">' +
        items.map(function (i) { return '<li><a class="text-primary-fixed hover:text-on-primary underline-offset-2 hover:underline" href="' + i.href + '"' + (i.logout ? ' data-action="logout"' : '') + '>' + esc(i.label) + '</a></li>'; }).join('') + '</ul></div>';
    }
    var settings = folder === 'admin' ? url('admin', 'settings.html') : url('public', 'settings.html');
    var el = document.createElement('footer');
    el.className = 'w-full bg-primary-container text-on-primary' + (folder === 'admin' ? ' pl-72' : '');
    el.setAttribute('data-site', 'footer');
    el.innerHTML = STRIP +
      '<div class="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg mb-space-xl">' +
        '<div class="flex flex-col gap-space-sm"><div class="flex items-center gap-space-sm"><img alt="ReanRush Brand Logo" class="h-10 w-10 rounded-full bg-white border-2 border-primary object-contain shrink-0" src="' + LOGO + '" onerror="this.remove()"/><span class="font-headline-md text-headline-md text-on-primary">ReanRush</span></div>' +
        '<p class="font-body-sm text-body-sm text-on-primary-container">High-octane quiz battles engineered for Cambodian high school classrooms. Fueling academic competition and collaborative learning.</p></div>' +
        footerColumns(col, settings) +
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

  // ---- Language switch: English / ខ្មែរ ----
  // Many labels were written as "English / ខ្មែរ" or "English (ខ្មែរ)". The switch shows only one side.
  // Default is English. The choice is saved in localStorage ("lang").
  var KH_CHARS = '\\u1780-\\u17FF';
  var KH_SRC = '[' + KH_CHARS + ']+(?:[\\s,.:!?\'"&/-]+[' + KH_CHARS + ']+)*';
  var RE_HAS_KH = new RegExp('[' + KH_CHARS + ']');
  var RE_EN_SLASH_KH = new RegExp('^([^' + KH_CHARS + ']*?)\\s*/\\s*(' + KH_SRC + ')(.*)$');
  var RE_KH_SLASH_EN = new RegExp('^(.*?)(' + KH_SRC + ')\\s*/\\s*([^' + KH_CHARS + ']+)$');
  var RE_EN_BULLET_KH = new RegExp('^([^' + KH_CHARS + ']*?)\\s*\u2022\\s*(' + KH_SRC + '.*)$');
  var RE_SLASH_ONLY_KH = new RegExp('^/\\s*(' + KH_SRC + '.*)$');
  var RE_EN_PAREN_KH = new RegExp('^([^' + KH_CHARS + ']*?)\\s*\\((' + KH_SRC + ')\\)\\s*(.*)$');

  function readLang() {
    try { return window.localStorage.getItem('lang') === 'km' ? 'km' : 'en'; } catch (e) { return 'en'; }
  }
  var lang = readLang();

  // Split one text into its English and Khmer versions (null if it is not bilingual).
  function splitText(core) {
    var m;
    if (!RE_HAS_KH.test(core)) return null;
    if ((m = RE_EN_SLASH_KH.exec(core)) && m[1].trim()) return { en: (m[1] + m[3]).trim(), km: (m[2] + m[3]).trim() };
    if ((m = RE_KH_SLASH_EN.exec(core)) && m[3].trim()) return { en: (m[1] + m[3]).trim(), km: (m[1] + m[2]).trim() };
    if ((m = RE_EN_PAREN_KH.exec(core)) && m[1].trim()) return { en: (m[1] + ' ' + m[3]).trim(), km: (m[2] + ' ' + m[3]).trim() };
    if ((m = RE_EN_BULLET_KH.exec(core)) && m[1].trim()) return { en: m[1].trim(), km: m[2].trim() };
    return null;
  }

  // Find the English text that sits right before a "/ ខ្មែរ" piece.
  function lastTextNode(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), last = null;
    while (w.nextNode()) { if (w.currentNode.nodeValue.trim()) last = w.currentNode; }
    return last;
  }
  function partnerOf(node) {
    var prev = node.previousSibling;
    while (prev && prev.nodeType === 3 && !prev.nodeValue.trim()) prev = prev.previousSibling;
    if (prev && prev.nodeType === 3) return prev;
    if (prev && prev.nodeType === 1) return lastTextNode(prev);
    var el = node.parentNode;
    if (!el || el === document.body) return null;
    var ps = el.previousSibling;
    while (ps && ps.nodeType === 3 && !ps.nodeValue.trim()) ps = ps.previousSibling;
    if (!ps) return null;
    return ps.nodeType === 3 ? ps : lastTextNode(ps);
  }

  // ---- Translation list (core/i18n.js) ----
  // Texts that are only English or only Khmer are looked up here: [english, khmer].
  // Use '' on one side to hide that text in the other language.
  var dictMap = null;
  var dictVersion = 0;
  function normText(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  function dictParts(core) {
    if (!dictMap) {
      dictMap = {};
      var list = (window.ReanRushI18n && window.ReanRushI18n.entries) || [];
      list.forEach(function (e) {
        var en = normText(e[0] || ''), km = normText(e[1] || '');
        var parts = { en: en, km: km };
        if (en) dictMap[en] = parts;
        if (km) dictMap[km] = parts;
      });
    }
    return dictMap[normText(core)] || null;
  }
  // core/i18n.js is loaded here, so no page needs an extra script tag.
  (function loadDictionary() {
    var s = document.createElement('script');
    var src = layoutScript && layoutScript.src ? layoutScript.src.replace(/components\/layout\.js.*$/, 'core/i18n.js') : '../../core/i18n.js';
    s.src = src;
    s.onload = function () { dictMap = null; dictVersion++; if (langStarted) applyLang(); };
    (document.head || document.documentElement).appendChild(s);
  })();

  var textStore = new WeakMap();
  var applying = false;
  var langObserver = null;

  function applyText(node) {
    var cur = node.nodeValue;
    var rec = textStore.get(node);
    if (!rec || cur !== rec.shown) {
      var lead = /^\s*/.exec(cur)[0], trail = /\s*$/.exec(cur)[0];
      var core = cur.trim();
      var parts = core ? splitText(core) : null;
      var slashKh = !parts && core ? RE_SLASH_ONLY_KH.exec(core) : null;
      if (slashKh) parts = { en: '', km: slashKh[1].trim() };
      rec = { lead: lead, trail: trail, parts: parts, shown: cur, slashOnly: !!slashKh };
      textStore.set(node, rec);
    }
    if (!rec.parts && !rec.slashOnly && rec.dictVer !== dictVersion) {
      rec.dictVer = dictVersion;
      var dp = rec.shown.trim() ? dictParts(rec.shown) : null;
      if (dp) rec.parts = dp;
    }
    if (rec.slashOnly) {
      // Hide the English text that came right before "/ ខ្មែរ" when Khmer is selected.
      if (!rec.partner) { var found = partnerOf(node); if (found && found !== node && !RE_HAS_KH.test(found.nodeValue)) rec.partner = found; }
      var partner = rec.partner;
      if (partner) {
        var prec = textStore.get(partner);
        if (!prec || prec.hiddenFor !== node) {
          prec = { lead: /^\s*/.exec(partner.nodeValue)[0], trail: /\s*$/.exec(partner.nodeValue)[0], parts: { en: partner.nodeValue.trim(), km: '' }, shown: partner.nodeValue, hiddenFor: node };
          textStore.set(partner, prec);
        }
        var pnext = prec.lead + (lang === 'km' ? prec.parts.km : prec.parts.en) + prec.trail;
        if (pnext !== partner.nodeValue) partner.nodeValue = pnext;
        prec.shown = pnext;
      }
    }
    if (!rec.parts) return;
    var next = rec.lead + (lang === 'km' ? rec.parts.km : rec.parts.en) + rec.trail;
    if (next !== node.nodeValue) { node.nodeValue = next; }
    rec.shown = next;
  }

  function applyAttr(el, attr) {
    var key = 'data-i18n-' + attr;
    var orig = el.hasAttribute(key) ? el.getAttribute(key) : el.getAttribute(attr);
    if (!el.hasAttribute(key)) {
      var parts0 = splitText((orig || '').trim()) || dictParts(orig || '');
      if (!parts0) return;
      el.setAttribute(key, orig);
    }
    var parts = splitText(orig.trim()) || dictParts(orig);
    if (parts) el.setAttribute(attr, lang === 'km' ? parts.km : parts.en);
  }

  function applyLang() {
    if (!document.body) return;
    applying = true;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) {
      var parent = walker.currentNode.parentNode;
      var tag = parent && parent.nodeName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'NOSCRIPT') continue;
      nodes.push(walker.currentNode);
    }
    nodes.forEach(applyText);
    Array.prototype.forEach.call(document.querySelectorAll('[placeholder]'), function (el) { applyAttr(el, 'placeholder'); });
    Array.prototype.forEach.call(document.querySelectorAll('[title]'), function (el) { applyAttr(el, 'title'); });
    document.documentElement.setAttribute('lang', lang === 'km' ? 'km' : 'en');
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-toggle]'), function (b) {
      Array.prototype.forEach.call(b.querySelectorAll('[data-lang]'), function (sp) {
        var on = sp.getAttribute('data-lang') === lang;
        sp.className = 'px-2 py-0.5 rounded-full ' + (on ? 'bg-secondary-container text-on-secondary-container' : 'text-primary-fixed');
      });
    });
    if (langObserver) langObserver.takeRecords();
    applying = false;
  }

  function setLang(next) {
    lang = next === 'km' ? 'km' : 'en';
    try { window.localStorage.setItem('lang', lang); } catch (e) {}
    applyLang();
  }

  var langStarted = false;
  function startLang() {
    if (langStarted) return;
    langStarted = true;
    applyLang();
    if (window.MutationObserver && document.body) {
      var pending = false;
      langObserver = new MutationObserver(function () {
        if (applying || pending) return;
        pending = true;
        window.setTimeout(function () { pending = false; applyLang(); }, 0);
      });
      langObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-lang-toggle]');
    if (t) setLang(lang === 'km' ? 'en' : 'km');
  });

  function langButton() {
    return '<button type="button" data-lang-toggle class="whitespace-nowrap shrink-0 inline-flex items-center gap-0.5 p-0.5 rounded-full bg-primary border-2 border-primary font-label-bold text-label-bold text-[12px]" aria-label="Change language" title="English / ខ្មែរ">' +
      '<span data-lang="en">EN</span><span data-lang="km">ខ្មែរ</span></button>';
  }

  // Buttons marked data-go="page.html" open that page (used for the teacher flow).
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-go]');
    if (el) window.location.href = el.getAttribute('data-go');
  });

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
  // Run the language switch after the other page scripts have started (they look for the original text).
  document.addEventListener('DOMContentLoaded', function () { window.setTimeout(startLang, 0); });
  if (document.readyState !== 'loading') window.setTimeout(startLang, 0);
})();