window.ReanRushPage = { init: function () {
  var cards = window.ReanRushData.flashcards; var index = 0; var flipped = false;
  function render() { var card = cards[index]; $('#card-side').text(flipped ? 'ANSWER' : 'QUESTION'); $('#card-text').text(flipped ? card.back : card.front); $('#card-progress').text((index + 1) + ' of ' + cards.length); }
  function flip() { flipped = !flipped; render(); }
  $('#flip-card, #flashcard').on('click', flip);
  $('#flashcard').on('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); flip(); } });
  $('#next-card').on('click', function () { index = (index + 1) % cards.length; flipped = false; render(); });
  $('#previous-card').on('click', function () { index = (index + cards.length - 1) % cards.length; flipped = false; render(); });
  render();
} };
