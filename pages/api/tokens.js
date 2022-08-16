import { sessionOptions } from '@/libs/session.js';
import { withIronSessionApiRoute } from 'iron-session/next';
import Database from '@replit/database';

const db = new Database();

async function handler(req, res) {
	switch (req.method) {
		case 'GET': {
			const { user } = req.session;
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

			res.status(200).json({ ok: true, tokens });
			break;
		}
		case 'POST': {
			const { user } = req.session;
			const { token: identifier, website: newApplication } = req.body;
			
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

			if(!tokens[tokenToEdit].websites.includes(newApplication)) {			
				tokens[tokenToEdit] = {
					token: tokens[tokenToEdit].token,
					websites: [
						...tokens[tokenToEdit].websites,
						newApplication,
					]
				};
	
				await db.set(user.id, tokens);
			}

			res.status(200).json({ ok: true, tokens });
			break;
		}
		default: {
			res.status(405).send('Method not allowed');
		}
	}
}

export default withIronSessionApiRoute(handler, sessionOptions);
