import React, { useState } from 'react';

import Link from 'next/link';
import { Collapse } from 'react-collapse';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

import { IconWrapper } from '../../../../styles/icon-wrapper';
import {
	FooterInfoImage,
	FooterInfoImageContiner,
	FooterInfoItemItem,
	FooterInfoItemItemContainer,
	FooterInfoLink,
} from '../shared/styles';

import {
	FooterInfoMobileItem,
	FooterInfoMobileItemContainer,
	FooterInfoMobileItemHeader,
} from './FooterInfoMobile.styles';

export const FooterInfoMobileView = () => {
	const [openSections, setOpenSections] = useState<string[]>([]);

	const handleTitleClick = (section: string) => {
		if (openSections.includes(section)) {
			setOpenSections(openSections => openSections.filter(openSection => openSection !== section));
		} else {
			setOpenSections(openSections => [...openSections, section]);
		}
	};

	return (
		<div style={{ background: '#eceaeb' }}>
			<FooterInfoMobileItemContainer>
				<FooterInfoMobileItem>
					<FooterInfoMobileItemHeader onClick={() => handleTitleClick('common-questions')}>
						<span>Vanliga frågor</span>
						<IconWrapper size="14px">
							{openSections.includes('common-questions') ? <FaAngleUp size="14px" /> : <FaAngleDown size="14px" />}
						</IconWrapper>
					</FooterInfoMobileItemHeader>
					<Collapse isOpened={openSections.includes('common-questions')}>
						<FooterInfoItemItemContainer style={{ paddingLeft: '16px' }}>
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
					</Collapse>
				</FooterInfoMobileItem>
				<FooterInfoMobileItem>
					<FooterInfoMobileItemHeader onClick={() => handleTitleClick('payment-alternatives')}>
						<span>Betalningsalternativ</span>
						<IconWrapper size="14px">
							{openSections.includes('payment-alternatives') ? <FaAngleUp size="14px" /> : <FaAngleDown size="14px" />}
						</IconWrapper>
					</FooterInfoMobileItemHeader>
					<Collapse isOpened={openSections.includes('payment-alternatives')}>
						<FooterInfoImageContiner style={{ paddingLeft: '16px' }}>
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
					</Collapse>
				</FooterInfoMobileItem>
				<FooterInfoMobileItem>
					<FooterInfoMobileItemHeader onClick={() => handleTitleClick('shipping-carriers')}>
						<span>Vi skickar med</span>
						<IconWrapper size="14px">
							{openSections.includes('shipping-carriers') ? <FaAngleUp size="14px" /> : <FaAngleDown size="14px" />}
						</IconWrapper>
					</FooterInfoMobileItemHeader>
					<Collapse isOpened={openSections.includes('shipping-carriers')}>
						<FooterInfoImageContiner style={{ paddingLeft: '16px' }}>
							<li>
								<FooterInfoImage src="/images/dhl.jpg" />
							</li>
						</FooterInfoImageContiner>
					</Collapse>
				</FooterInfoMobileItem>
				<FooterInfoMobileItem>
					<FooterInfoMobileItemHeader onClick={() => handleTitleClick('easy-e-shopping')}>
						<span>Enkel onlineshopping</span>
						<IconWrapper size="14px">
							{openSections.includes('easy-e-shopping') ? <FaAngleUp size="14px" /> : <FaAngleDown size="14px" />}
						</IconWrapper>
					</FooterInfoMobileItemHeader>
					<Collapse isOpened={openSections.includes('easy-e-shopping')}>
						<FooterInfoItemItemContainer style={{ paddingLeft: '16px' }}>
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
					</Collapse>
				</FooterInfoMobileItem>
				<FooterInfoMobileItem>
					<FooterInfoMobileItemHeader onClick={() => handleTitleClick('safe-e-shopping')}>
						<span>Trygg e-handel</span>
						<IconWrapper size="14px">
							{openSections.includes('safe-e-shopping') ? <FaAngleUp size="14px" /> : <FaAngleDown size="14px" />}
						</IconWrapper>
					</FooterInfoMobileItemHeader>
					<Collapse isOpened={openSections.includes('safe-e-shopping')}>
						<FooterInfoImageContiner style={{ paddingLeft: '16px' }}>
							<li>
								<FooterInfoImage src="/images/verified-by-visa.jpg" />
							</li>
							<li>
								<FooterInfoImage src="/images/mastercard-securecode.png" />
							</li>
						</FooterInfoImageContiner>
					</Collapse>
				</FooterInfoMobileItem>
			</FooterInfoMobileItemContainer>
		</div>
	);
};
