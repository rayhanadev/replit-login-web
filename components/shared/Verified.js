import React from 'react';

import styles from '@/styles/components/Verified.module.scss';

export default function Verified(props) {
	return (
		<div className={styles.verified}>
			<svg
				preserveAspectRatio="xMidYMin"
				width={12}
				height={12}
				viewBox="0 0 24 24"
				fill="currentColor"
				style={{
					verticalAlign: 'middle',
				}}
				{...props}
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M20.53 5.47a.75.75 0 0 1 0 1.06l-11 11a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 1 1 1.06-1.06L9 15.94 19.47 5.47a.75.75 0 0 1 1.06 0Z"
				/>
			</svg>
		</div>
	)
};