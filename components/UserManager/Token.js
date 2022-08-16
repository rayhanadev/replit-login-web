import React, { useState, useContext } from 'react';

import Website from './Website.js';
import { RadioContext } from '@/contexts/RadioContext.js';
import fetcher from '@/libs/fetcher.js';
import styles from '@/styles/components/Token.module.scss';

export default function Token({
	token,
	websites,
	id,
	onChange,
	onClick,
	checked,
	rerender,
}) {
	const radioEnabled = useContext(RadioContext);

	const deleteToken = () => {
		fetcher('/api/logout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				token: token
			}),
		}).then(() => rerender())
	};

	return (
		<div
			className={
				radioEnabled === id || checked
					? styles.tokenSelected
					: styles.token
			}
			onClick={onClick}
		>
			<div className={styles.top}>
				<p>Token: {token.slice(0, 20) + '**********'}</p>
				<label className={styles.radio} htmlFor={'token_' + id}>
					<input
						name="token"
						value={id}
						id={'token_' + id}
						type="radio"
						onChange={() => {
							onChange(id);
						}}
					/>
					{radioEnabled === id || checked ? (
						<div className={styles.checked}></div>
					) : (
						<React.Fragment></React.Fragment>
					)}
				</label>
			</div>
			<div className={styles.websites}>
				<p>Connected Services:</p>
				<ul>
					{websites.map((website, index) => (
						<Website website={website} key={index} />
					))}
				</ul>
				<svg
					preserveAspectRatio="xMidYMin"
					width={16}
					height={16}
					viewBox="0 0 24 24"
					className={styles.trashIcon}
					onClick={() => deleteToken()}
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M10 2.75A1.25 1.25 0 0 0 8.75 4v1.25h6.5V4A1.25 1.25 0 0 0 14 2.75h-4Zm6.75 2.5V4A2.75 2.75 0 0 0 14 1.25h-4A2.75 2.75 0 0 0 7.25 4v1.25H3a.75.75 0 0 0 0 1.5h1.25V20A2.75 2.75 0 0 0 7 22.75h10A2.75 2.75 0 0 0 19.75 20V6.75H21a.75.75 0 0 0 0-1.5h-4.25Zm-11 1.5V20A1.25 1.25 0 0 0 7 21.25h10A1.25 1.25 0 0 0 18.25 20V6.75H5.75Zm4.25 3.5a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75Zm4 0a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75Z"
					/>
				</svg>
			</div>
		</div>
	);
}
