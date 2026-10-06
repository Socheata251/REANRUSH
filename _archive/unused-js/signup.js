window.ReanRushPage = { init: function () {
	var form = $('#signup-form');
	var schoolField = $('#school-name-field');

	function selectRole(role) {
		form.attr('data-role', role);
		schoolField.prop('hidden', role !== 'host');
		schoolField.find('input').prop('required', role === 'host');
		$('.role-card').each(function () {
			var active = $(this).attr('data-role') === role;
			$(this).toggleClass('btn-secondary', !active).toggleClass('btn-gold', active);
			$(this).attr('aria-pressed', String(active));
		});
	}

	$('.role-card').on('click', function () {
		selectRole($(this).attr('data-role'));
	});
	$('#show-password').on('change', function () {
		$('#signup-password').attr('type', this.checked ? 'text' : 'password');
	});
	selectRole('student');
} };
