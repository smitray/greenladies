import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { HideOnMinSize, ShowOnMinSize } from '../../../styles/responsive';

import { CustomPageTripleImage_tripleImage } from './__generated__/CustomPageTripleImage_tripleImage.graphql';
import { CustomPageTripleImageDesktop } from './CustomPageTripleImageDesktop';
import { CustomPageTripleImageMobile } from './CustomPageTripleImageMobile';

interface CustomPageTripleImageViewProps {
	tripleImage: CustomPageTripleImage_tripleImage;
}

const CustomPageTripleImageView = ({ tripleImage }: CustomPageTripleImageViewProps) => {
	return (
		<React.Fragment>
			<HideOnMinSize size="m">
				<CustomPageTripleImageMobile tripleImage={tripleImage} />
			</HideOnMinSize>
			<ShowOnMinSize size="m">
				<CustomPageTripleImageDesktop tripleImage={tripleImage} />
			</ShowOnMinSize>
		</React.Fragment>
	);
};

export default createFragmentContainer(CustomPageTripleImageView, {
	tripleImage: graphql`
		fragment CustomPageTripleImage_tripleImage on CustomPageTripleImage {
			...CustomPageTripleImageMobile_tripleImage
			...CustomPageTripleImageDesktop_tripleImage
		}
	`,
});
