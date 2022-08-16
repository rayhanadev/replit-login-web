import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '@/libs/session.js';

import Login from '@/components/Login/Login.js';
import UserManager from '@/components/UserManager/UserManager.js';
import Verified from '@/components/shared/Verified.js';

import styles from '@/styles/pages/Home.module.scss';

async function serverSideProps({ req, res }) {
	const { user } = req.session;

	return {
		props: {
			user: user ? user : null,
			isLoggedIn: user ? true : false,
		},
	};
}

export const getServerSideProps = withIronSessionSsr(
	serverSideProps,
	sessionOptions,
);

export default function Home({ user, isLoggedIn }) {
	const [verified, setVerified] = useState(false);
	const router = useRouter();
	const { application } = router.query;

	useEffect(() => {
		const referrers = JSON.parse(process.env.NEXT_PUBLIC_VERIFIED_REFERRERS);
		setVerified(referrers.includes(application))
	});
	
	return (
		<React.Fragment>
			<Head>
				<title>Replit Login</title>
				<meta name="description" content="Work in Progress" />
			</Head>
			<div className={styles.page}>
				{isLoggedIn ? (
					<React.Fragment>
						<h1>Replit Auth</h1>
						<p className={styles.hint}>You are signing into {application}{
							verified ? <Verified /> : ''
						}.</p>
						<p>
							Hi{' '}
							{user.first_name && user.first_name.length < 15
								? user.first_name
								: `@${user.username}`}
							. Choose a Replit Token to provide to this
							application or create a new token below.
						</p>
						<UserManager user={user} />
					</React.Fragment>
				) : (
					<React.Fragment>
						<h1>Login with Replit</h1>
						<Login />
					</React.Fragment>
				)}
				<p>
					By logging in with Replit, you are allowing this application
					full access to your Replit account. Only use this with
					caution on verified applications. See{' '}
					<Link href="/about">
						<a>here</a>
					</Link>{' '}
					for more information
				</p>
			</div>
		</React.Fragment>
	);
}
