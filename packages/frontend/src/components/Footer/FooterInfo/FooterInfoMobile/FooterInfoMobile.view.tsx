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
};
