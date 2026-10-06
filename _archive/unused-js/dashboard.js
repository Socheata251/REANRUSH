window.ReanRushPage = { init: function () {
  var classes = window.ReanRushData.classes;
  $('#class-list').html(classes.map(function (item) { return '<article class="card class-card"><span class="badge">' + item.players + ' students</span><h2>' + item.name + '</h2><p class="muted">' + item.subject + ' • PIN ' + item.pin + '</p><div class="row"><strong>' + item.score.toLocaleString() + ' pts</strong><button class="btn btn-small btn-secondary" data-action="copy" data-copy="' + item.pin + '" type="button">Copy PIN</button></div></article>'; }).join(''));
} };
