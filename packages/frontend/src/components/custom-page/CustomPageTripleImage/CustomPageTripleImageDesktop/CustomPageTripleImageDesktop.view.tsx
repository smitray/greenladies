import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { useWindowDimensions } from '../../../../hooks/use-window-dimensions';
import { Link } from '../../../Link';

import { CustomPageTripleImageDesktop_tripleImage } from './__generated__/CustomPageTripleImageDesktop_tripleImage.graphql';
import {
	TripleImageDesktopBigTitle,
	TripleImageDesktopImage,
	TripleImageDesktopItem,
	TripleImageDesktopItemsContainer,
	TripleImageDesktopShop,
	TripleImageDesktopSmallTitle,
	TripleImageDesktopTextItem,
	TripleImageDesktopWrapper,
} from './CustomPageTripleImage.styles';

interface CustomPageTripleImageDesktopViewProps {
	tripleImage: CustomPageTripleImageDesktop_tripleImage;
}

const CustomPageTripleImageDesktopView = ({ tripleImage }: CustomPageTripleImageDesktopViewProps) => {
	const { width: windowWidth } = useWindowDimensions();

	const images: string[] = [tripleImage.firstImagePath];
	if (tripleImage.secondImagePath) {
		images.push(tripleImage.secondImagePath);
	}

	if (tripleImage.thirdImagePath && windowWidth > 960) {
		images.push(tripleImage.thirdImagePath);
	}

	return (
		<TripleImageDesktopWrapper background={tripleImage.color}>
			<TripleImageDesktopItemsContainer>
				<TripleImageDesktopTextItem widthPercentage={100 / (1 + images.length)}>
					<div>
						<TripleImageDesktopSmallTitle>{tripleImage.smallTitle}</TripleImageDesktopSmallTitle>
						<TripleImageDesktopBigTitle>
							{tripleImage.bigTitle.split('\n').reduce<React.ReactNode[]>((prev, current, index) => {
								if (index === 0) {
									return [current];
								}

								return [...prev, <br key={index} />, current];
							}, [])}
						</TripleImageDesktopBigTitle>
					</div>
					<Link link={tripleImage.link}>
						<TripleImageDesktopShop>Shoppa</TripleImageDesktopShop>
					</Link>
				</TripleImageDesktopTextItem>
				{images.map((image, index) => (
					<TripleImageDesktopItem key={index} widthPercentage={100 / (1 + images.length)}>
						<Link link={tripleImage.link}>
							<a>
								<TripleImageDesktopImage src={image} />
							</a>
						</Link>
					</TripleImageDesktopItem>
				))}
			</TripleImageDesktopItemsContainer>
		</TripleImageDesktopWrapper>
	);
};

export default createFragmentContainer(CustomPageTripleImageDesktopView, {
	tripleImage: graphql`
		fragment CustomPageTripleImageDesktop_tripleImage on CustomPageTripleImage {
			smallTitle
			bigTitle
			link {
				...Link_link
			}
			firstImagePath
			secondImagePath
			thirdImagePath
			color
		}
	`,
});
