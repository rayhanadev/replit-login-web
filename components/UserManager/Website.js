import React from 'react';

import Verified from '@/components/shared/Verified.js';
import styles from '@/styles/components/Website.module.scss';

export default function Website({ website }) {
	const referrers = JSON.parse(process.env.NEXT_PUBLIC_VERIFIED_REFERRERS);

	return (
		<li className={styles.website}>
			{website} {referrers.includes(website) ? <Verified /> : ''}
		</li>
	);
}
