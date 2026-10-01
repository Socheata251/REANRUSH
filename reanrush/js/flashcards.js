window.ReanRushPage = { init: function () {
  // Flip with click or keyboard, and mark cards as known or still practicing.
  var cards = window.ReanRushData.flashcards || [];
  var index = 0;
  var flipped = false;

  function render() {
    var card = cards[index];
    $('#card-side').text(flipped ? 'ANSWER' : 'QUESTION');
    $('#card-text').text(flipped ? card.back : card.front);
    $('#card-progress').text((index + 1) + ' of ' + cards.length);
  }

  function flip() {
    flipped = !flipped;
    render();
  }

  function next() {
    index = (index + 1) % cards.length;
    flipped = false;
    render();
  }

  function previous() {
    index = (index + cards.length - 1) % cards.length;
    flipped = false;
    render();
  }

  $('#flip-card, #flashcard').on('click', flip);
  $('#flashcard').on('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); flip(); }
  });
  $('#next-card').on('click', next);
  $('#previous-card').on('click', previous);
  $('#got-it').on('click', function () {
    var progress = JSON.parse(window.localStorage.getItem('reanrush_flashcard_progress') || '{"gotIt":[],"needMore":[]}');
    progress.gotIt.push(cards[index].front);
    window.localStorage.setItem('reanrush_flashcard_progress', JSON.stringify(progress));
    next();
  });
  $('#need-more').on('click', function () {
    var progress = JSON.parse(window.localStorage.getItem('reanrush_flashcard_progress') || '{"gotIt":[],"needMore":[]}');
    progress.needMore.push(cards[index].front);
    window.localStorage.setItem('reanrush_flashcard_progress', JSON.stringify(progress));
    next();
  });

  $(document).on('keydown', function (event) {
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') previous();
    if (event.key.toLowerCase() === 'f') flip();
    if (event.key.toLowerCase() === 'g') $('#got-it').trigger('click');
    if (event.key.toLowerCase() === 'm') $('#need-more').trigger('click');
  });

  render();
} };
