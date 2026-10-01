window.ReanRushPage = { init: function () {
	var selectedRole = 'student';
	var form = $('#login-form');
	var title = $('#login-title');
	var signupLink = $('#signup-link');
	var googleButton = $('#google-login');
	var roleTitles = { student: 'Log in as a Student', host: 'Log in as a Host', admin: 'Log in as an Admin' };
	var destinations = {
		student: 'student/home.html',
		host: 'teacher/dashboard.html',
		admin: 'admin/dashboard.html'
	};

	function selectRole(role) {
		selectedRole = role;
		title.text(roleTitles[role]);
		form.attr('data-role', role);
		signupLink.prop('hidden', role === 'admin');
		$('[data-route="pages/signup.html"]').prop('hidden', role === 'admin');
		googleButton.prop('hidden', role === 'admin');
		$('.role-card').each(function () {
			var active = $(this).attr('data-role') === role;
			$(this).toggleClass('btn-secondary', !active).toggleClass('btn-gold', active);
			$(this).attr('aria-pressed', String(active));
		});
	}

	$('.role-card').on('click', function () {
		selectRole($(this).attr('data-role'));
	});

	form.on('submit', function (event) {
		event.preventDefault();
		event.stopPropagation();

		var email = $('#login-email').val().trim().toLowerCase();
		var password = $('#login-password').val();
		var account = window.ReanRushData.users.find(function (user) {
			return user.email.toLowerCase() === email && user.password === password;
		});

		if (!account) {
			window.showToast('Email or password is incorrect.', 'error');
			return;
		}

		if (account.role !== selectedRole) {
			window.showToast('This account is not a ' + selectedRole + ' account.', 'error');
			return;
		}

		// Prototype auth only; replace with ASP.NET Identity and role claims.
		window.localStorage.setItem('role', account.role);
		window.localStorage.setItem('user', JSON.stringify({ email: account.email, role: account.role, name: account.name }));
		var root = document.body.getAttribute('data-root') || '..';
		window.location.href = root + '/pages/' + destinations[account.role];
	});

	selectRole(selectedRole);
	$('#login-email').trigger('focus');
} };
