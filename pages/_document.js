import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html lang="en-US">
				<Head>
					<link
						rel="icon"
						type="image/png"
						sizes="196x196"
						href="/favicon-196.png"
					/>
					<link rel="manifest" href="/site.webmanifest" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
