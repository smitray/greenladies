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
};
