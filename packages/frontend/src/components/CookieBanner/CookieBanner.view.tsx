import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { GdprAcceptButton, GdprBannerInfoText, GdprBannerLink, GdprBannerWrapper } from './CookieBanner.styles';

export const CookieBannerView = () => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('greenladies_gdpr') !== 'true') {
			setOpen(true);
		}
	}, []);

	return (
		<GdprBannerWrapper open={open}>
			<GdprBannerInfoText>
				Hey! Vi använder cookies för att personifiera vårt innehåll för att ge dig en bättre upplevelse, samt för att
				analysera trafiken. Läs mer i vår{' '}
				<Link href="/kundservice?tab=integritetspolicy" passHref>
					<GdprBannerLink>Integritetspolicy</GdprBannerLink>
				</Link>
			</GdprBannerInfoText>
			<GdprAcceptButton
				onClick={() => {
					setOpen(false);
					localStorage.setItem('greenladies_gdpr', 'true');
				}}
			>
				Yes, OK
			</GdprAcceptButton>
		</GdprBannerWrapper>
	);
};
