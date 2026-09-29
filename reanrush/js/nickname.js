window.ReanRushPage = { init: function () { $('#nickname-input').on('input', function () { $('#nickname-count').text(this.value.length + ' / 16 characters'); }); } };
