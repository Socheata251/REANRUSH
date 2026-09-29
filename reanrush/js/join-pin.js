window.ReanRushPage = { init: function () { $('#pin-input').trigger('focus').on('input', function () { this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); }); } };
