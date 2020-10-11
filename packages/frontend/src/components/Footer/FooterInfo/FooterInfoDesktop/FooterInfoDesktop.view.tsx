import React from 'react';

import Link from 'next/link';

import { CenterWrapper } from '../../../../styles/center-wrapper';
import {
	FooterInfoImage,
	FooterInfoImageContiner,
	FooterInfoItemItem,
	FooterInfoItemItemContainer,
	FooterInfoLink,
} from '../shared/styles';

import {
	FooterInfoDesktopItem,
	FooterInfoDesktopItemContainer,
	FooterInfoDesktopItemHeader,
} from './FooterInfoDesktop.styles';

export const FooterInfoDesktopView = () => {
	return (
		<div style={{ background: '#eceaeb' }}>
			<CenterWrapper>
				<FooterInfoDesktopItemContainer>
					<FooterInfoDesktopItem>
						<FooterInfoDesktopItemHeader>Vanliga frågor</FooterInfoDesktopItemHeader>
						<FooterInfoItemItemContainer>
							<FooterInfoItemItem>
								<Link
									href="/[[...slug]]?tab=fullstandiga-kopvillkor"
									as="/kundservice?tab=fullstandiga-kopvillkor"
									passHref
								>
									<FooterInfoLink>Köpvillkor</FooterInfoLink>
								</Link>
							</FooterInfoItemItem>
							<FooterInfoItemItem>
								<Link href="/[[...slug]]?tab=betalning" as="/kundservice?tab=betalning" passHref>
									<FooterInfoLink>Betalning</FooterInfoLink>
								</Link>
							</FooterInfoItemItem>
							<FooterInfoItemItem>
								<Link href="/[[...slug]]?tab=frakt" as="/kundservice?tab=frakt" passHref>
									<FooterInfoLink>Leverans</FooterInfoLink>
								</Link>
							</FooterInfoItemItem>
						</FooterInfoItemItemContainer>
					</FooterInfoDesktopItem>
					<FooterInfoDesktopItem>
						<FooterInfoDesktopItemHeader>Betalningsalternativ</FooterInfoDesktopItemHeader>
						<FooterInfoImageContiner>
							<li>
								<FooterInfoImage src="/images/klarna.jpg" />
							</li>
							<li>
								<FooterInfoImage src="/images/visa.png" />
							</li>
							<li>
								<FooterInfoImage src="/images/mastercard.png" />
							</li>
							<li>
								<FooterInfoImage src="/images/amex.png" />
							</li>
							<li>
								<FooterInfoImage src="/images/faktura.png" />
							</li>
						</FooterInfoImageContiner>
					</FooterInfoDesktopItem>
					<FooterInfoDesktopItem>
						<FooterInfoDesktopItemHeader>Vi skickar med</FooterInfoDesktopItemHeader>
						<FooterInfoImageContiner>
							<li>
								<FooterInfoImage src="/images/dhl.jpg" />
							</li>
						</FooterInfoImageContiner>
					</FooterInfoDesktopItem>
					<FooterInfoDesktopItem>
						<FooterInfoDesktopItemHeader>Enkel onlineshopping</FooterInfoDesktopItemHeader>
						<FooterInfoItemItemContainer>
							<FooterInfoItemItem style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ width: '24px', height: '28px', display: 'flex', alignItems: 'center' }}>
									<img src="/images/car.png" alt="" width="100%" />
								</div>
								<span style={{ marginLeft: '8px' }}>Klimatkompenserad frakt</span>
							</FooterInfoItemItem>
							<FooterInfoItemItem style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ width: '24px', height: '28px', display: 'flex', alignItems: 'center' }}>
									<img src="/images/check.png" alt="" width="100%" />
								</div>
								<span style={{ marginLeft: '8px' }}>Snabb och fri frakt över 999kr</span>
							</FooterInfoItemItem>
							<FooterInfoItemItem style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ width: '24px', height: '28px', display: 'flex', alignItems: 'center' }}>
									<img src="/images/tree.png" alt="" width="100%" />
								</div>
								<span style={{ marginLeft: '8px' }}>14 dagar öppet köp</span>
							</FooterInfoItemItem>
						</FooterInfoItemItemContainer>
					</FooterInfoDesktopItem>
					<FooterInfoDesktopItem>
						<FooterInfoDesktopItemHeader>Trygg e-handel</FooterInfoDesktopItemHeader>
						<FooterInfoImageContiner>
							<li>
								<FooterInfoImage src="/images/verified-by-visa.jpg" />
							</li>
							<li>
								<FooterInfoImage src="/images/mastercard-securecode.png" />
							</li>
						</FooterInfoImageContiner>
					</FooterInfoDesktopItem>
				</FooterInfoDesktopItemContainer>
			</CenterWrapper>
		</div>
	);
};
