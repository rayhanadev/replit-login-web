export const sessionOptions = {
	password: process.env.SIGNING_SECRET,
	cookieName: 'replit-login/auth',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},
};
