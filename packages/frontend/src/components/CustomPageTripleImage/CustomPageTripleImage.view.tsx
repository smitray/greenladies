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

const MobileWrapper = styled.div`
	display: block;
	padding: 16px 28px;

	@media (min-width: 641px) {
		display: none;
	}
`;

const NotMobileWrapper = styled.div`
	display: none;

	@media (min-width: 641px) {
		display: block;
	}
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
		<React.Fragment>
			<MobileWrapper style={{ background: tripleImage.color }}>
				<Link link={tripleImage.link}>
					<a style={{ position: 'relative', display: 'block' }}>
						<img style={{ display: 'block', width: '100%' }} src={tripleImage.firstImagePath} alt="" />
						<div
							style={{
								position: 'absolute',
								bottom: '12px',
								left: '-1px',
								width: '80%',
								padding: '12px',
								background: tripleImage.color,
							}}
						>
							<div style={{ fontSize: '18px' }}>{tripleImage.smallTitle}</div>
							<div style={{ fontSize: '32px', fontWeight: 'bold', fontFamily: 'Arimo, sans-serif' }}>
								{tripleImage.bigTitle}
							</div>
							<div
								style={{
									marginTop: '12px',
									display: 'inline-block',
									fontWeight: 'bold',
									paddingBottom: '2px',
									borderBottom: '2px solid black',
								}}
							>
								Shoppa
							</div>
						</div>
					</a>
				</Link>
			</MobileWrapper>
			<NotMobileWrapper>
				<div style={{ background: tripleImage.color, padding: '72px 0', margin: '0' }}>
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
									margin: '6% 0 0 0',
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
			</NotMobileWrapper>
		</React.Fragment>
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
