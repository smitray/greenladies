import React from 'react';

import { CenterWrapper } from '../../../../styles/center-wrapper';
import { sections } from '../sections';

import {
	FooterInfoDesktopSection,
	FooterInfoDesktopSectionHeader,
	FooterInfoDesktopSectionsContainer,
	FooterInfoDesktopWrapper,
} from './FooterInfoDesktop.styles';

export const FooterInfoDesktopView = () => {
	return (
		<FooterInfoDesktopWrapper>
			<CenterWrapper>
				<FooterInfoDesktopSectionsContainer>
					{sections.map(section => (
						<FooterInfoDesktopSection key={section.id} style={{ width: `${100 / sections.length}%` }}>
							<FooterInfoDesktopSectionHeader>{section.title}</FooterInfoDesktopSectionHeader>
							<section.component />
						</FooterInfoDesktopSection>
					))}
				</FooterInfoDesktopSectionsContainer>
			</CenterWrapper>
		</FooterInfoDesktopWrapper>
	);

	// return <div>Right</div>;

	// return (
	// 	<div style={{ background: '#eceaeb' }}>
	// 		<CenterWrapper>
	// 			<FooterInfoDesktopSectionsContainer>
	// 				<FooterInfoDesktopItem>
	// 					<FooterInfoDesktopItemHeader>Vanliga frågor</FooterInfoDesktopItemHeader>
	// 					<FooterInfoItemItemContainer>
	// 						<FooterInfoItemItem>
	// 							<Link
	// 								href="/[[...slug]]?tab=fullstandiga-kopvillkor"
	// 								as="/kundservice?tab=fullstandiga-kopvillkor"
	// 								passHref
	// 							>
	// 								<FooterInfoLink>Köpvillkor</FooterInfoLink>
	// 							</Link>
	// 						</FooterInfoItemItem>
	// 						<FooterInfoItemItem>
	// 							<Link href="/[[...slug]]?tab=betalning" as="/kundservice?tab=betalning" passHref>
	// 								<FooterInfoLink>Betalning</FooterInfoLink>
	// 							</Link>
	// 						</FooterInfoItemItem>
	// 						<FooterInfoItemItem>
	// 							<Link href="/[[...slug]]?tab=frakt" as="/kundservice?tab=frakt" passHref>
	// 								<FooterInfoLink>Leverans</FooterInfoLink>
	// 							</Link>
	// 						</FooterInfoItemItem>
	// 					</FooterInfoItemItemContainer>
	// 				</FooterInfoDesktopItem>
	// 				<FooterInfoDesktopItem>
	// 					<FooterInfoDesktopItemHeader>Betalningsalternativ</FooterInfoDesktopItemHeader>
	// 					<FooterInfoImageContainer>
	// 						<li>
	// 							<FooterInfoImage src="/images/klarna.jpg" />
	// 						</li>
	// 						<li>
	// 							<FooterInfoImage src="/images/visa.png" />
	// 						</li>
	// 						<li>
	// 							<FooterInfoImage src="/images/mastercard.png" />
	// 						</li>
	// 						<li>
	// 							<FooterInfoImage src="/images/amex.png" />
	// 						</li>
	// 						<li>
	// 							<FooterInfoImage src="/images/faktura.png" />
	// 						</li>
	// 					</FooterInfoImageContainer>
	// 				</FooterInfoDesktopItem>
	// 				<FooterInfoDesktopItem>
	// 					<FooterInfoDesktopItemHeader>Vi skickar med</FooterInfoDesktopItemHeader>
	// 					<FooterInfoImageContainer>
	// 						<li>
	// 							<FooterInfoImage src="/images/dhl.jpg" />
	// 						</li>
	// 					</FooterInfoImageContainer>
	// 				</FooterInfoDesktopItem>
	// 				<FooterInfoDesktopItem>
	// 					<FooterInfoDesktopItemHeader>Enkel onlineshopping</FooterInfoDesktopItemHeader>
	// 					<FooterInfoItemItemContainer>
	// 						<FooterInfoItemItem style={{ display: 'flex', alignItems: 'center' }}>
	// 							<div style={{ width: '24px', height: '28px', display: 'flex', alignItems: 'center' }}>
	// 								<img src="/images/car.png" alt="" width="100%" />
	// 							</div>
	// 							<span style={{ marginLeft: '8px' }}>Klimatkompenserad frakt</span>
	// 						</FooterInfoItemItem>
	// 						<FooterInfoItemItem style={{ display: 'flex', alignItems: 'center' }}>
	// 							<FooterInfoIconImageWrapper>
	// 								<FooterInfoIconImage src="/images/check.png" />
	// 							</FooterInfoIconImageWrapper>
	// 							<FooterInfoIconImageText>Snabb och fri frakt över 999kr</FooterInfoIconImageText>
	// 						</FooterInfoItemItem>
	// 						<FooterInfoItemItem style={{ display: 'flex', alignItems: 'center' }}>
	// 							<FooterInfoIconImageWrapper>
	// 								<FooterInfoIconImage src="/images/tree.png" />
	// 							</FooterInfoIconImageWrapper>
	// 							<FooterInfoIconImageText>14 dagar öppet köp</FooterInfoIconImageText>
	// 						</FooterInfoItemItem>
	// 					</FooterInfoItemItemContainer>
	// 				</FooterInfoDesktopItem>
	// 				<FooterInfoDesktopItem>
	// 					<FooterInfoDesktopItemHeader>Trygg e-handel</FooterInfoDesktopItemHeader>
	// 					<FooterInfoImageContainer>
	// 						<li>
	// 							<FooterInfoImage src="/images/verified-by-visa.jpg" />
	// 						</li>
	// 						<li>
	// 							<FooterInfoImage src="/images/mastercard-securecode.png" />
	// 						</li>
	// 					</FooterInfoImageContainer>
	// 				</FooterInfoDesktopItem>
	// 			</FooterInfoDesktopSectionsContainer>
	// 		</CenterWrapper>
	// 	</div>
	// );
};
