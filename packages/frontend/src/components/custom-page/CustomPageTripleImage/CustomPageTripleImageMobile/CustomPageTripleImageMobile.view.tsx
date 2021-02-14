import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { Link } from '../../../Link';

import { CustomPageTripleImageMobile_tripleImage } from './__generated__/CustomPageTripleImageMobile_tripleImage.graphql';
import {
	TripleImageMobileBigTitle,
	TripleImageMobileImage,
	TripleImageMobileImageOverlay,
	TripleImageMobileImageWrapper,
	TripleImageMobileShop,
	TripleImageMobileSmallTitle,
	TripleImageMobileWrapper,
} from './CustomPageTripleImageMobile.styles';

interface CustomPageTripleImageMobileViewProps {
	tripleImage: CustomPageTripleImageMobile_tripleImage;
}

const CustomPageTripleImageMobileView = ({ tripleImage }: CustomPageTripleImageMobileViewProps) => {
	return (
		<TripleImageMobileWrapper background={tripleImage.color}>
			<Link link={tripleImage.link}>
				<TripleImageMobileImageWrapper>
					<TripleImageMobileImage src={tripleImage.mobileImagePath} />
					<TripleImageMobileImageOverlay background={tripleImage.color}>
						<TripleImageMobileSmallTitle>{tripleImage.smallTitle}</TripleImageMobileSmallTitle>
						<TripleImageMobileBigTitle> {tripleImage.bigTitle}</TripleImageMobileBigTitle>
						<TripleImageMobileShop>Shoppa</TripleImageMobileShop>
					</TripleImageMobileImageOverlay>
				</TripleImageMobileImageWrapper>
			</Link>
		</TripleImageMobileWrapper>
	);
};

export default createFragmentContainer(CustomPageTripleImageMobileView, {
	tripleImage: graphql`
		fragment CustomPageTripleImageMobile_tripleImage on CustomPageTripleImage {
			smallTitle
			bigTitle
			link {
				...Link_link
			}
			mobileImagePath
			color
		}
	`,
});
