import { logout } from 'replit-login';
import { sessionOptions } from '@/libs/session.js';
import { withIronSessionApiRoute } from 'iron-session/next';
import Database from '@replit/database';

const db = new Database();

async function handler(req, res) {
	switch (req.method) {
		case 'GET': {
			req.session.destroy();
			res.status(200).json({ isLoggedIn: false });
			break;
		}
		case 'POST': {
			const { user } = req.session;
			const { token: identifier } = req.body;
			
			if (!user) {
				res.status(401).json({
					ok: false,
					message: 'Unauthenticated.',
				});
				break;
			}

			const tokens = (await db.get(user.id)) || [];

			if (!tokens) {
				res.status(204).end();
				break;
			}

			const tokenToEdit = tokens.indexOf(tokens.filter(({ token }) => {
				return token === identifier;
			})[0]);
			
			if(tokenToEdit === -1) {
				res.status(204).end();
				break;
			}

			let ok = false;

			try {
				ok = await logout(tokens[tokenToEdit]);
			} catch (error) {
				res.status(500).json({ ok });
			}

			if (!ok) {
				res.status(500).json({ ok });
				break;
			}
			
			tokens[tokenToEdit] = undefined;
			await db.set(user.id, tokens.filter((token) => token !== undefined));

			res.status(200).json({ ok: true, tokens });
			break;
		}
		default: {
			res.status(405).send('Method not allowed');
		}
	}
}

export default withIronSessionApiRoute(handler, sessionOptions);
