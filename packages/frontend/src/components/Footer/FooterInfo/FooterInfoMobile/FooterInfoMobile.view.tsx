import React, { useState } from 'react';

import { Collapse } from 'react-collapse';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import { IconWrapper } from '../../../../styles/icon-wrapper';
import { sections } from '../sections';

import {
	FooterInfoMobileSection,
	FooterInfoMobileSectionContentWrapper,
	FooterInfoMobileSectionHeader,
	FooterInfoMobileSectionsContainer,
	FooterInfoMobileWrapper,
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
		<FooterInfoMobileWrapper>
			<FooterInfoMobileSectionsContainer>
				<FooterInfoMobileSection>
					{sections.map(section => (
						<FooterInfoMobileSection key={section.id}>
							<FooterInfoMobileSectionHeader onClick={() => handleTitleClick(section.id)}>
								<span>{section.title}</span>
								<IconWrapper size="14px">
									{openSections.includes(section.id) ? <FiChevronUp size="14px" /> : <FiChevronDown size="14px" />}
								</IconWrapper>
							</FooterInfoMobileSectionHeader>
							<Collapse isOpened={openSections.includes(section.id)}>
								<FooterInfoMobileSectionContentWrapper>
									<section.component />
								</FooterInfoMobileSectionContentWrapper>
							</Collapse>
						</FooterInfoMobileSection>
					))}
				</FooterInfoMobileSection>
			</FooterInfoMobileSectionsContainer>
		</FooterInfoMobileWrapper>
	);

	// return <div>Right</div>;

	// return (
	// 	<div style={{ background: '#eceaeb' }}>
	// 		<FooterInfoMobileItemContainer>
	// 			<FooterInfoMobileItem>
	// 				<FooterInfoMobileItemHeader onClick={() => handleTitleClick('common-questions')}>
	// 					<span>Vanliga frågor</span>
	// 					<IconWrapper size="14px">
	// 						{openSections.includes('common-questions') ? <FaAngleUp size="14px" /> : <FaAngleDown size="14px" />}
	// 					</IconWrapper>
	// 				</FooterInfoMobileItemHeader>
	// 				<Collapse isOpened={openSections.includes('common-questions')}>
	// 					<FooterInfoMobileItemItemContainer>
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
	// 					</FooterInfoMobileItemItemContainer>
	// 				</Collapse>
	// 			</FooterInfoMobileItem>
	// 			<FooterInfoMobileItem>
	// 				<FooterInfoMobileItemHeader onClick={() => handleTitleClick('payment-alternatives')}>
	// 					<span>Betalningsalternativ</span>
	// 					<IconWrapper size="14px">
	// 						{openSections.includes('payment-alternatives') ? <FaAngleUp size="14px" /> : <FaAngleDown size="14px" />}
	// 					</IconWrapper>
	// 				</FooterInfoMobileItemHeader>
	// 				<Collapse isOpened={openSections.includes('payment-alternatives')}>
	// 					<FooterInfoMobileItemItemContainer style={{ paddingLeft: '16px' }}>
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
	// 					</FooterInfoMobileItemItemContainer>
	// 				</Collapse>
	// 			</FooterInfoMobileItem>
	// 			<FooterInfoMobileItem>
	// 				<FooterInfoMobileItemHeader onClick={() => handleTitleClick('shipping-carriers')}>
	// 					<span>Vi skickar med</span>
	// 					<IconWrapper size="14px">
	// 						{openSections.includes('shipping-carriers') ? <FaAngleUp size="14px" /> : <FaAngleDown size="14px" />}
	// 					</IconWrapper>
	// 				</FooterInfoMobileItemHeader>
	// 				<Collapse isOpened={openSections.includes('shipping-carriers')}>
	// 					<FooterInfoMobileImageContiner>
	// 						<li>
	// 							<FooterInfoImage src="/images/dhl.jpg" />
	// 						</li>
	// 					</FooterInfoMobileImageContiner>
	// 				</Collapse>
	// 			</FooterInfoMobileItem>
	// 			<FooterInfoMobileItem>
	// 				<FooterInfoMobileItemHeader onClick={() => handleTitleClick('easy-e-shopping')}>
	// 					<span>Enkel onlineshopping</span>
	// 					<IconWrapper size="14px">
	// 						{openSections.includes('easy-e-shopping') ? <FaAngleUp size="14px" /> : <FaAngleDown size="14px" />}
	// 					</IconWrapper>
	// 				</FooterInfoMobileItemHeader>
	// 				<Collapse isOpened={openSections.includes('easy-e-shopping')}>
	// 					<FooterInfoMobileItemItemContainer>
	// 						<FooterInfoItemItem style={{ display: 'flex', alignItems: 'center' }}>
	// 							<div style={{ width: '24px', height: '28px', display: 'flex', alignItems: 'center' }}>
	// 								<img src="/images/car.png" alt="" width="100%" />
	// 							</div>
	// 							<span style={{ marginLeft: '8px' }}>Klimatkompenserad frakt</span>
	// 						</FooterInfoItemItem>
	// 						<FooterInfoItemItem style={{ display: 'flex', alignItems: 'center' }}>
	// 							<div style={{ width: '24px', height: '28px', display: 'flex', alignItems: 'center' }}>
	// 								<img src="/images/check.png" alt="" width="100%" />
	// 							</div>
	// 							<span style={{ marginLeft: '8px' }}>Snabb och fri frakt över 999kr</span>
	// 						</FooterInfoItemItem>
	// 						<FooterInfoItemItem style={{ display: 'flex', alignItems: 'center' }}>
	// 							<div style={{ width: '24px', height: '28px', display: 'flex', alignItems: 'center' }}>
	// 								<img src="/images/tree.png" alt="" width="100%" />
	// 							</div>
	// 							<span style={{ marginLeft: '8px' }}>14 dagar öppet köp</span>
	// 						</FooterInfoItemItem>
	// 					</FooterInfoMobileItemItemContainer>
	// 				</Collapse>
	// 			</FooterInfoMobileItem>
	// 			<FooterInfoMobileItem>
	// 				<FooterInfoMobileItemHeader onClick={() => handleTitleClick('safe-e-shopping')}>
	// 					<span>Trygg e-handel</span>
	// 					<IconWrapper size="14px">
	// 						{openSections.includes('safe-e-shopping') ? <FaAngleUp size="14px" /> : <FaAngleDown size="14px" />}
	// 					</IconWrapper>
	// 				</FooterInfoMobileItemHeader>
	// 				<Collapse isOpened={openSections.includes('safe-e-shopping')}>
	// 					<FooterInfoMobileImageContiner>
	// 						<li>
	// 							<FooterInfoImage src="/images/verified-by-visa.jpg" />
	// 						</li>
	// 						<li>
	// 							<FooterInfoImage src="/images/mastercard-securecode.png" />
	// 						</li>
	// 					</FooterInfoMobileImageContiner>
	// 				</Collapse>
	// 			</FooterInfoMobileItem>
	// 		</FooterInfoMobileItemContainer>
	// 	</div>
	// );
};
