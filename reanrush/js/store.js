(function () {
  var STORAGE_KEY = 'reanrush_store';

  function parseValue(rawValue) {
    try {
      return rawValue === null || rawValue === undefined ? null : JSON.parse(rawValue);
    } catch (error) {
      return rawValue;
    }
  }

  function get(key, fallbackValue) {
    if (!window.localStorage) {
      return fallbackValue;
    }

    var value = window.localStorage.getItem(key);
    if (value === null || value === undefined) {
      return fallbackValue;
    }

    var parsed = parseValue(value);
    return parsed === null ? fallbackValue : parsed;
  }

  function set(key, value) {
    if (!window.localStorage) {
      return value;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function remove(key) {
    if (!window.localStorage) {
      return;
    }

    window.localStorage.removeItem(key);
  }

  function defaultStore() {
    return {
      users: [],
      quizzes: [],
      classes: [],
      games: [],
      players: [],
      answers: [],
      mistakes: [],
      flashcards: [],
      notifications: []
    };
  }

  function ensureStore() {
    var store = get(STORAGE_KEY, null);
    if (!store) {
      store = defaultStore();
      set(STORAGE_KEY, store);
    }
    return store;
  }

  window.ReanRushStore = {
    STORAGE_KEY: STORAGE_KEY,
    get: get,
    set: set,
    remove: remove,
    ensureStore: ensureStore,
    reset: function () {
      var fresh = defaultStore();
      set(STORAGE_KEY, fresh);
      return fresh;
    }
  };

  window.reanrushStore = window.ReanRushStore;
})();
