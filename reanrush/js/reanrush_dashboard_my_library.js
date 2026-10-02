(function ($) {
  'use strict';

  var storageKey = 'reanrush_my_library_demo';
  var state = {
    activePin: '',
    deckTitles: [],
    createdDecks: [],
    hostedBattles: 0,
    pin: '402618'
  };

  try {
    var savedState = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
    if (savedState && typeof savedState === 'object') {
      state = $.extend(state, savedState);
    }
  } catch (error) {
    window.localStorage.removeItem(storageKey);
  }

  if (!Array.isArray(state.deckTitles)) state.deckTitles = [];
  if (!Array.isArray(state.createdDecks)) state.createdDecks = [];

  function saveState() {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function deckCards() {
    return $('[data-action="host-battle"]').closest('.group');
  }

  function updateTitle($card, title) {
    $card.find('h3').first().text(title);
    $card.find('.h-36 .z-10 span.font-headline-lg').first().text(title.toUpperCase());
  }

  function makePin() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function createDeck(title) {
    var $card = $template.clone();
    updateTitle($card, title);
    $card.find('.z-10 span.font-badge-arcade').first().text('Custom Deck • Draft');
    $card.find('p.font-body-md').first().text('Demo deck saved in this browser.');
    if ($builder.length) $card.insertBefore($builder);
    else $grid.append($card);
  }

  function askForDeckName() {
    var title = window.prompt('Name your demo quiz deck:', 'My New Quiz Deck');
    if (!title || !title.trim()) return;

    title = title.trim();
    state.createdDecks.push(title);
    createDeck(title);
    saveState();
    applyFilters();
  }

  function categoryMatches($card, filter) {
    var content = $card.text().toLowerCase();
    if (filter === 'grade') return /grade 12|bacii|stem lab/.test(content);
    if (filter === 'stem') return /physics|chemistry|stem/.test(content);
    if (filter === 'khmer') return /khmer literature/.test(content);
    return true;
  }

  var activeFilter = 'all';
  var $grid = $('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3').first();
  var $template = $('[data-action="host-battle"]').first().closest('.group').clone();
  var $builder = $('[data-action="builder"]').closest('.group').first();

  state.createdDecks.forEach(createDeck);
  deckCards().each(function (index) {
    if (state.deckTitles[index]) updateTitle($(this), state.deckTitles[index]);
  });

  function applyFilters() {
    var query = $('[data-action="search"]').val().trim().toLowerCase();
    deckCards().each(function () {
      var $card = $(this);
      var matchesText = !query || $card.text().toLowerCase().indexOf(query) !== -1;
      $card.toggle(matchesText && categoryMatches($card, activeFilter));
    });
  }

  $(document).on('input', '[data-action="search"]', applyFilters);

  $(document).on('click', '[data-action^="filter-"]', function () {
    activeFilter = $(this).attr('data-action').replace('filter-', '');
    var $filters = $('[data-action^="filter-"]');
    $filters.removeClass('bg-primary text-on-primary shadow-[2px_2px_0px_#00163a]')
      .addClass('bg-surface-container-lowest text-primary hover:bg-surface-container-high transition-all');
    $(this).removeClass('bg-surface-container-lowest text-primary hover:bg-surface-container-high transition-all')
      .addClass('bg-primary text-on-primary shadow-[2px_2px_0px_#00163a]');
    applyFilters();
  });

  $(document).on('click', '[data-action="host-battle"]', function () {
    var title = $(this).closest('.group').find('h3').first().text().trim();
    state.activePin = makePin();
    state.hostedBattles += 1;
    saveState();
    window.alert('Demo battle ready for ' + title + '. Game PIN: ' + state.activePin);
  });

  $(document).on('click', '[data-action="edit-deck"]', function () {
    var $card = $(this).closest('.group');
    var index = deckCards().index($card);
    var currentTitle = $card.find('h3').first().text().trim();
    var title = window.prompt('Edit demo deck title:', currentTitle);
    if (!title || !title.trim()) return;

    title = title.trim();
    updateTitle($card, title);
    state.deckTitles[index] = title;
    saveState();
    applyFilters();
  });

  $(document).on('click', '[data-action="create-deck"], [data-action="builder"]', askForDeckName);

  $(document).on('click', '[data-action="display-pin"], [data-action="launch-arena"]', function () {
    window.alert('Demo game PIN: ' + (state.activePin || state.pin));
  });

  $(document).on('click', '[data-action="join-game"]', function () {
    var pin = window.prompt('Enter the 6-digit demo game PIN:');
    if (pin === null) return;
    pin = pin.replace(/\D/g, '').slice(0, 6);
    if (pin.length !== 6) {
      window.alert('Enter a 6-digit PIN to join the demo game.');
      return;
    }

    state.lastJoinedPin = pin;
    saveState();
    window.alert('Demo PIN ' + pin + ' accepted.');
  });
})(jQuery);