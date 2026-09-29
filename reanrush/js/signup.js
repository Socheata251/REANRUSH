window.ReanRushPage = { init: function () { $('#show-password').on('change', function () { $('#signup-password').attr('type', this.checked ? 'text' : 'password'); }); } };
