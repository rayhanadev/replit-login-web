import React, { useEffect, useState, useRef } from 'react';
import Router from 'next/router';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import useUser from '@/hooks/useUser.js';
import fetcher from '@/libs/fetcher.js';
import styles from '@/styles/components/Login.module.scss';

export default function Login() {
	const [, mutateUser] = useUser();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [captcha, onVerify] = useState('');
	const captchaRef = useRef(null);

	const [btnText, setBtnText] = useState('Log in');

	const onSubmit = (event) => {
		event.preventDefault();
		captchaRef.current.execute();
	};

	const onExpire = () => {
		console.log('hCaptcha Token Expired');
	};

	const onError = (err) => {
		console.log(`hCaptcha Error: ${err}`);
	};

	const login = async () => {
		if (captcha) {
			setBtnText('Logging In');

			const body = {
				username,
				password,
				captcha,
				intent: 'session',
			};

			try {
				const data = await fetcher('/api/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body),
				});

				mutateUser(data);
				Router.reload();
			} catch (error) {
				console.error(error.message);
			}
		}
	};

	useEffect(() => {
		login();
	}, [captcha, username, password]);

	return (
		<form className={styles.login}>
			<label htmlFor="username">Username</label>
			<input
				type="text"
				id="username"
				placeholder="Email or username"
				value={username}
				onChange={(event) => setUsername(event.target.value)}
			/>
			<label htmlFor="password">Password</label>
			<input
				type="password"
				id="password"
				placeholder="Password"
				value={password}
				onChange={(event) => setPassword(event.target.value)}
			/>
			<HCaptcha
				sitekey="473079ba-e99f-4e25-a635-e9b661c7dd3e"
				size="invisible"
				onVerify={onVerify}
				onError={onError}
				onExpire={onExpire}
				ref={captchaRef}
			/>
			<button className={styles.formSubmit} onClick={onSubmit}>
				{btnText}
				<svg
					preserveAspectRatio="xMidYMin"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M19.5303 11.4697C19.8232 11.7626 19.8232 12.2374 19.5303 12.5303L12.5303 19.5303C12.2374 19.8232 11.7626 19.8232 11.4697 19.5303C11.1768 19.2374 11.1768 18.7626 11.4697 18.4697L17.1893 12.75L5 12.75C4.58579 12.75 4.25 12.4142 4.25 12C4.25 11.5858 4.58579 11.25 5 11.25L17.1893 11.25L11.4697 5.53033C11.1768 5.23744 11.1768 4.76256 11.4697 4.46967C11.7626 4.17678 12.2374 4.17678 12.5303 4.46967L19.5303 11.4697Z"
					></path>
				</svg>
			</button>
		</form>
	);
}
