// Login for public/login.html (Stitch form: #loginForm, #email, #password).
// Prototype auth only; replace with ASP.NET Identity and role claims.
window.ReanRushPage = { init: function () {
	var form = $('#loginForm');
	if (!form.length) return;

	var destinations = {
		student: 'student/home.html',
		host: 'teacher/dashboard.html',
		teacher: 'teacher/dashboard.html',
		admin: 'admin/dashboard.html'
	};

	form.on('submit', function (event) {
		event.preventDefault();
		event.stopPropagation();

		var email = $('#email').val().trim().toLowerCase();
		var password = $('#password').val();
		var users = (window.ReanRushData && window.ReanRushData.users) || [];
		var account = users.find(function (user) {
			return user.email.toLowerCase() === email && user.password === password;
		});

		if (!account) {
			window.showToast('Email or password is incorrect.', 'error');
			return;
		}

		window.localStorage.setItem('role', account.role);
		window.localStorage.setItem('user', JSON.stringify({ email: account.email, role: account.role, name: account.name }));
		var root = (document.body.getAttribute('data-root') || '..').replace(/\/+$/, '');
		window.location.href = root + '/' + destinations[account.role];
	});

	$('#email').trigger('focus');
} };
