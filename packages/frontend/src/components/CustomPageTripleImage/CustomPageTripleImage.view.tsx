import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { useWindowDimensions } from '../../hooks/use-window-dimensions';
import { CenterWrapper } from '../../styles/center-wrapper';
import { Link } from '../Link';

import { CustomPageTripleImage_tripleImage } from './__generated__/CustomPageTripleImage_tripleImage.graphql';

const A = styled.div`
	margin: 0 12px;
`;

interface CustomPageTripleImageViewProps {
	tripleImage: CustomPageTripleImage_tripleImage;
}

const CustomPageTripleImageView = ({ tripleImage }: CustomPageTripleImageViewProps) => {
	const { width: windowWidth } = useWindowDimensions();

	const images: string[] = [tripleImage.firstImagePath];
	if (tripleImage.secondImagePath) {
		images.push(tripleImage.secondImagePath);
	}

	if (tripleImage.thirdImagePath && windowWidth > 960) {
		images.push(tripleImage.thirdImagePath);
	}

	return (
		<div style={{ background: tripleImage.color, padding: '48px 0', margin: '0 -12px' }}>
			<CenterWrapper>
				<div style={{ display: 'flex' }}>
					<A
						style={{
							flexBasis: `${100 / (1 + images.length)}%`,
							width: `${100 / (1 + images.length)}%`,
							flexGrow: 1,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							margin: '10% 0 0 0',
						}}
					>
						<div>
							<div style={{ fontSize: '32px', fontWeight: 'bold' }}>{tripleImage.smallTitle}</div>
							<div style={{ fontSize: '52px', fontWeight: 'bold' }}>{tripleImage.bigTitle}</div>
						</div>
						<Link link={tripleImage.link}>
							<a
								style={{
									fontSize: '20px',
									fontWeight: 'bold',
									paddingBottom: '4px',
									borderBottom: '2px solid black',
									color: 'inherit',
									textDecoration: 'none',
								}}
							>
								Shoppa
							</a>
						</Link>
					</A>
					{images.map((image, index) => (
						<A
							key={index}
							style={{
								flexBasis: `${100 / (1 + images.length)}%`,
								width: `${100 / (1 + images.length)}%`,
							}}
						>
							<Link link={tripleImage.link}>
								<a>
									<img style={{ width: '100%' }} src={image} alt="" />
								</a>
							</Link>
						</A>
					))}
				</div>
			</CenterWrapper>
			{/*  */}
		</div>
	);
};

export default createFragmentContainer(CustomPageTripleImageView, {
	tripleImage: graphql`
		fragment CustomPageTripleImage_tripleImage on CustomPageTripleImage {
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
