import { sessionOptions } from '@/libs/session.js';
import { withIronSessionApiRoute } from 'iron-session/next';

async function handler(req, res) {
	const { user } = req.session;

	if (user) {
		res.status(200).send(
			JSON.stringify({
				isLoggedIn: true,
				...user,
			}),
		);
	} else {
		res.status(200).send(
			JSON.stringify({
				isLoggedIn: false,
			}),
		);
	}
}

export default withIronSessionApiRoute(handler, sessionOptions);
