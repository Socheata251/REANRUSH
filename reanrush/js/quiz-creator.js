window.ReanRushPage = { init: function () {
  var count = 1;
  $('#add-question').on('click', function () { count += 1; $('#question-list').append('<label class="field question-row">Question ' + count + '<input required placeholder="Write a question"></label>'); });
  $('#quiz-form').on('submit', function (event) { event.preventDefault(); if (this.reportValidity()) window.showToast('Quiz draft saved in this demo.'); });
} };
