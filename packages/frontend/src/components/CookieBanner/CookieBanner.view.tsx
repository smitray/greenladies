import React, { useEffect, useState } from 'react';

import Link from 'next/link';

export const CookieBannerView = () => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('gdpr') !== 'true') {
			setOpen(true);
		}
	}, []);

	return (
		<div
			style={{
				position: 'fixed',
				display: open ? 'flex' : 'none',
				background: 'black',
				bottom: '0',
				width: '100%',
				padding: '12px',
				color: 'white',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div style={{ textAlign: 'center' }}>
				Hey! Vi använder cookies för att personifiera vårt innehåll för att ge dig en bättre upplevelse, samt för att
				analysera trafiken. Läs mer i vår{' '}
				<Link href="/kundservice?tab=integritetspolicy" passHref>
					<a style={{ color: 'white' }}>Integritetspolicy</a>
				</Link>
			</div>
			<button
				onClick={() => {
					setOpen(false);
					localStorage.setItem('gdpr', 'true');
				}}
				style={{
					marginLeft: '1em',
					padding: '0.5em 1em',
					color: 'white',
					background: 'none',
					outline: 'none',
					border: '1px solid white',
					whiteSpace: 'nowrap',
					cursor: 'pointer',
				}}
			>
				Yes, OK
			</button>
		</div>
	);
};
