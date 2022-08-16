import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import useMessage from '@rottitime/react-hook-message-event';

import Token from './Token.js';
import TokenEditor from './TokenEditor.js';
import { RadioContext } from '@/contexts/RadioContext.js';
import fetcher from '@/libs/fetcher.js';
import styles from '@/styles/components/UserManager.module.scss';

export default function UserManager({ user }) {
	const router = useRouter();
	const { application } = router.query;
	const [radioEnabled, setRadio] = useState(0);
	const [rerender, setRerender] = useState(true);
	const [newToken, openNewToken] = useState(false);
	const [tokens, setTokens] = useState([]);
	const [selectedToken, setSelectedToken] = useState(null);
	const [submitBtnText, setSubmitBtnText] = useState('Select');
	const [isOpener, setIsOpener] = useState(false);

	const { sendToParent } = useMessage('auth_complete', (send, payload) => {
		send({ type: 'auth_complete', success: true });
	});

	useEffect(() => {
		fetcher('/api/tokens', {
			method: 'GET',
		})
			.then((data) => setTokens(data.tokens))
			.then(() => newToken === 'refresh' && setRadio(tokens.length));
	}, [rerender, newToken]);

	useEffect(() => {
		if (opener) setIsOpener(true);
		else router.push('/~');
	});

	return (
		<React.Fragment>
			{isOpener && application ? (
				<div className={styles.manager}>
					{selectedToken === null ? (
						<React.Fragment>
							<RadioContext.Provider value={radioEnabled}>
								{tokens.map(({ token, websites }, index) => (
									<Token
										id={index}
										token={token}
										websites={websites}
										onChange={setRadio}
										key={index}
										onClick={() => setRadio(index)}
										rerender={() => setRerender(!rerender)}
									/>
								))}
							</RadioContext.Provider>
							{newToken === true ? (
								<TokenEditor
									username={user.username}
									onChange={() => openNewToken('refresh')}
								/>
							) : newToken === false || tokens.length === 0 ? (
								<button
									className={styles.newTokenBtn}
									onClick={() => openNewToken(true)}
								>
									New Token
								</button>
							) : (
								<React.Fragment></React.Fragment>
							)}
						</React.Fragment>
					) : (
						<Token
							id={0}
							token={selectedToken.token}
							websites={selectedToken.websites}
							onChange={() => {}}
							checked={true}
						/>
					)}
					<button
						onClick={() => {
							setSubmitBtnText('Selected');
							setSelectedToken(tokens[radioEnabled]);
							fetcher('/api/tokens', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									token: tokens[radioEnabled].token,
									website: application,
								})
							}).then(() => {
								if (opener) {
									sendToParent(
										`auth_complete---${tokens[radioEnabled].token}`,
									);
								}
							});
						}}
					>
						{submitBtnText}
					</button>
				</div>
			) : (
				<pre className={styles.error}>
					Error: Application querystring missing.
					{'\n\n'}
					Please contact the website's developer and ask them to add
					`?application={'<hostname>'}` to their querystring.
					{'\n\n'}
					If you use the official Replit Auth embed script, this
					querystring is automatically set.
				</pre>
			)}
		</React.Fragment>
	);
}
