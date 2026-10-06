window.ReanRushPage = { init: function () {
  // Manage quiz questions and enforce a minimum of 6 before hosting.
  var list = $('#question-list');
  var defaultQuestions = [
    { prompt: 'What force pulls objects toward Earth?', choices: ['Gravity', 'Magnetism', 'Friction', 'Sound'], answer: 'Gravity' },
    { prompt: 'What is the SI unit of force?', choices: ['Watt', 'Newton', 'Joule', 'Volt'], answer: 'Newton' },
    { prompt: 'Which simple machine is a rigid bar on a pivot?', choices: ['Pulley', 'Lever', 'Wheel', 'Spring'], answer: 'Lever' }
  ];

  function renderQuestions() {
    var questions = JSON.parse(window.localStorage.getItem('reanrush_quiz_questions') || 'null') || defaultQuestions;
    var total = questions.length;
    list.empty();
    questions.forEach(function (question, index) {
      var row = $('<label class="field question-row">Question ' + (index + 1) + '<input value="' + (question.prompt || '').replace(/"/g, '&quot;') + '" required placeholder="Write a question"><button class="btn btn-small btn-secondary" type="button" data-delete-question="' + index + '">Delete</button></label>');
      list.append(row);
    });
    $('#round-count').text((questions.length || 0) + '/6');
  }

  function readQuestions() {
    return list.find('.question-row input').map(function () { return $(this).val().trim(); }).get().filter(Boolean).map(function (value, index) {
      return { prompt: value, choices: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 'Option A' };
    });
  }

  $('#add-question').on('click', function () {
    var current = list.find('.question-row').length;
    list.append('<label class="field question-row">Question ' + (current + 1) + '<input required placeholder="Write a question"><button class="btn btn-small btn-secondary" type="button" data-delete-question="' + current + '">Delete</button></label>');
    $('#round-count').text((list.find('.question-row').length || 0) + '/6');
  });

  list.on('click', '[data-delete-question]', function () {
    $(this).closest('.question-row').remove();
    $('#round-count').text((list.find('.question-row').length || 0) + '/6');
  });

  $('#quiz-form').on('submit', function (event) {
    event.preventDefault();
    if (!this.reportValidity()) return;
    var title = $('input[name="title"]').val().trim();
    if (!title) {
      window.showToast('Quiz title is required.', 'error');
      return;
    }

    var draft = {
      title: title,
      subject: $('select[name="subject"]').val(),
      questions: readQuestions()
    };
    window.localStorage.setItem('reanrush_quiz_draft', JSON.stringify(draft));
    window.showToast('Quiz draft saved in this demo.');
  });

  $('#host-quiz').on('click', function () {
    var title = $('input[name="title"]').val().trim();
    if (!title) {
      window.showToast('Quiz title is required before hosting.', 'error');
      return;
    }

    var questionCount = list.find('.question-row').length;
    if (questionCount < 6) {
      window.showToast('Add at least 6 questions before hosting.', 'error');
      return;
    }

    var draft = {
      title: title,
      subject: $('select[name="subject"]').val(),
      questions: readQuestions()
    };
    window.localStorage.setItem('reanrush_quiz_draft', JSON.stringify(draft));
    window.location.href = 'lobby.html';
  });

  renderQuestions();
} };
