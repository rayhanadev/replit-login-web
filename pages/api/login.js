import { login } from 'replit-login';
import { sessionOptions } from '@/libs/session.js';
import { withIronSessionApiRoute } from 'iron-session/next';
import Database from '@replit/database';

const db = new Database();

async function handler(req, res) {
	switch (req.method) {
		case 'POST': {
			const { username, password, captcha, intent } = req.body;
			const auth = [username, password, captcha];

			if (!username) {
				res.status(400).json({
					ok: false,
					message: 'Missing Username.',
				});
				break;
			}

			if (!password) {
				res.status(400).json({
					ok: false,
					message: 'Missing Password.',
				});
				break;
			}

			if (!captcha) {
				res.status(400).json({
					ok: false,
					message: 'Missing Captcha.',
				});
				break;
			}

			if (!(intent && ['session', 'third-party'].includes(intent))) {
				res.status(400).json({
					ok: false,
					message: 'Malformed intent.',
				});
			}

			let loginResponse;

			try {
				loginResponse = await login(...auth);
			} catch (error) {
				res.status(500).json({ ok: false });
			}

			const { token, message, ...data } = loginResponse;

			if (message) {
				res.status(401).json({ ok: false, message: message });
				break;
			}

			if (intent === 'third-party') {
				const { website } = req.body;
				const { user } = req.session;

				const tokens = (await db.get(user.id)) || [];
				await db.set(user.id, [
					...tokens,
					{ websites: [website], token },
				]);

				res.status(200).json({ ok: true, token });
				break;
			}

			req.session.user = {
				token,
				isLoggedIn: true,
				id: data.id,
				username: data.username,
				first_name: data.first_name,
				last_name: data.last_name,
				icon: data.icon,
				roles: data.roles,
			};

			await req.session.save();

			res.status(200).json({ ok: true, token, ...data });
			break;
		}
		default: {
			res.status(405).send('Method not allowed');
		}
	}
}

export default withIronSessionApiRoute(handler, sessionOptions);
