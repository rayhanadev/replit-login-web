(function () {
	// Util version
	const selem = document.currentScript;

	let button;

	if (document.getElementById('replit-login-button')) {
		button = document.getElementById('replit-login-button');
	} else {
		button = document.createElement('button');
		button.className = 'replit-login-button';
		button.textContent = 'Login With Replit';
	}

	if (location.protocol !== 'https:') {
		let err;

		if (document.getElementById('replit-login-error')) {
			err = document.getElementById('replit-login-error');
		} else {
			err = document.createElement('div');
			err.className = 'replit-login-error';
		}

		err.textContent = 'Replit Login Requires HTTPS!';
		if (!document.getElementById('replit-login-error')) {
			selem.parentNode.insertBefore(err, selem);
		}
	}

	button.onclick = function () {
		window.addEventListener('message', authComplete);
		window.addEventListener('unload', closeWindow);

		const h = 600;
		const w = 530;
		const left = screen.width / 2 - w / 2;
		const top = screen.height / 2 - h / 2;

		const authWindow = window.open(
			'https://login.rayhanadev.repl.co?application=' + location.host,
			'_blank',
			`modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`,
		);

		function authComplete(e) {
			if (e.data.includes('auth_complete')) {
				selem.setAttribute(
					'data-token',
					e.data.replace('auth_complete---', ''),
				);
				window.removeEventListener('unload', closeWindow);
				window.removeEventListener('message', authComplete);
				authWindow.close();
			}

			if (selem.getAttribute('authed')) {
				eval(selem.getAttribute('authed'));
			}

			return;
		}

		function closeWindow(e) {
			authWindow.close();
		}
	};

	if (!document.getElementById('replit-login-button')) {
		selem.parentNode.insertBefore(button, selem);
	}
})();
