window.ReanRushPage = { init: function () {
  // Load the saved wrong answers from localStorage and turn them into a review set.
  var list = $('#mistake-list');
  var mistakes = [];

  try {
    mistakes = JSON.parse(window.localStorage.getItem('reanrush_mistake_vault') || '[]');
  } catch (error) {
    mistakes = [];
  }

  if (!mistakes.length) {
    list.html('<li class="muted">No missed questions yet. Finish a battle to build your revenge round.</li>');
    return;
  }

  list.html(mistakes.map(function (item, index) {
    return '<li><strong>Q' + (index + 1) + ':</strong> ' + item.question + '<br><small>You chose: ' + (item.picked || 'No answer') + ' · Correct answer: ' + (item.answer || 'N/A') + '</small></li>';
  }).join(''));
} };
