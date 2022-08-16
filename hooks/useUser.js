import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';

export default function useUser({
	redirectTo = '',
	redirectIfFound = false,
} = {}) {
	const { data, mutate } = useSWR('/api/user');

	useEffect(() => {
		if (!redirectTo || !data) return;

		if (
			(redirectTo && !redirectIfFound && !data?.isLoggedIn) ||
			(redirectIfFound && data?.isLoggedIn)
		) {
			Router.push(redirectTo);
		}
	}, [data, redirectIfFound, redirectTo]);

	return [data, mutate];
}
