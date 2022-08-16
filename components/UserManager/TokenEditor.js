import React, { useEffect, useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRouter } from 'next/router';

import fetcher from '@/libs/fetcher.js';
import styles from '@/styles/components/Token.module.scss';

export default function TokenEditor({ username, onChange }) {
	const router = useRouter();
	const { application } = router.query;

	const [password, setPassword] = useState('');
	const [captcha, onVerify] = useState('');
	const captchaRef = useRef(null);

	const [btnText, setBtnText] = useState('Create');

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
			setBtnText('Creating');

			const body = {
				username,
				password,
				captcha,
				intent: 'third-party',
				website: application || 'unknown',
			};

			try {
				await fetcher('/api/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body),
				});

				onChange();
			} catch (error) {
				console.error(error.message);
			}
		}
	};

	useEffect(() => {
		login();
	}, [captcha]);

	return (
		<div className={styles.tokenEditor}>
			Password for {`@${username}`}?
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
			</button>
		</div>
	);
}
