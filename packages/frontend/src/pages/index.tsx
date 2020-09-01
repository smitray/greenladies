import React from 'react';

import Link from 'next/link';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { ProductCarousel } from '../components/ProductCarousel';
import { useWindowDimensions } from '../hooks/use-window-dimensions';
import { MyNextPage } from '../lib/types';
import { HOME_QUERY, HomeQuery } from '../queries/home';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
	padding: 0 40px;
	display: flex;
	align-items: flex-start;
`;

const Home: MyNextPage = () => {
	const { category } = useLazyLoadQuery<HomeQuery>(HOME_QUERY, {}, { fetchKey: 'store-only' });

	const { width: windowWidth } = useWindowDimensions();

	return (
		<React.Fragment>
			<div style={{ position: 'relative' }}>
				<img src="/images/frontpage-1.jpg" alt="" style={{ width: '100%', display: 'block' }} />
				<div style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', zIndex: 1 }}>
					<Link href="#" passHref>
						<a style={{ textDecoration: 'none' }}>
							<div
								style={{
									padding: '16px 48px',
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-end',
								}}
							>
								<div style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', marginBottom: '48px' }}>
									Färgglada
									<br />
									Vårnyheter
								</div>
								<div>
									<span
										style={{
											color: 'white',
											fontSize: '12px',
											fontWeight: 'bold',
											paddingBottom: '2px',
											borderBottom: '2px solid white',
											textTransform: 'uppercase',
										}}
									>
										se mer
									</span>
								</div>
							</div>
						</a>
					</Link>
				</div>
			</div>
			<div>
				<CenterWrapper>
					<div>Underbara pasteller</div>
					<div>Få inspiration till vårens favoritfärg</div>
				</CenterWrapper>
				<ProductCarousel products={category.products} sidePadding={Math.max(windowWidth - 1240, 0) / 2} />
			</div>
			<div style={{ position: 'relative' }}>
				<img src="/images/frontpage-2.jpg" alt="" style={{ width: '100%', display: 'block' }} />
				<div style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', zIndex: 1 }}>
					<Link href="#" passHref>
						<a style={{ textDecoration: 'none' }}>
							<div
								style={{
									padding: '16px 48px',
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-end',
								}}
							>
								<div style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', marginBottom: '48px' }}>
									Naturfärgade & mjuka
									<br />
									vardagsfavoriter
								</div>
								<div>
									<span
										style={{
											color: 'white',
											fontSize: '12px',
											fontWeight: 'bold',
											paddingBottom: '2px',
											borderBottom: '2px solid white',
											textTransform: 'uppercase',
										}}
									>
										utforska
									</span>
								</div>
							</div>
						</a>
					</Link>
				</div>
			</div>
			<div>
				<CenterWrapper>
					<div>Underbara pasteller</div>
					<div>Få inspiration till vårens favoritfärg</div>
				</CenterWrapper>
				<ProductCarousel products={category.products} sidePadding={Math.max(windowWidth - 1240, 0) / 2} />
			</div>
			<div style={{ position: 'relative' }}>
				<img src="/images/frontpage-3.jpg" alt="" style={{ width: '100%', display: 'block' }} />
				<div style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', zIndex: 1 }}>
					<Link href="#" passHref>
						<a style={{ textDecoration: 'none' }}>
							<div
								style={{
									padding: '16px 48px',
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-end',
								}}
							>
								<div style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', marginBottom: '48px' }}>
									Utvalt
									<br />
									VECKANS FAVORITER
								</div>
								<div>
									<span
										style={{
											color: 'white',
											fontSize: '12px',
											fontWeight: 'bold',
											paddingBottom: '2px',
											borderBottom: '2px solid white',
											textTransform: 'uppercase',
										}}
									>
										se mer
									</span>
								</div>
							</div>
						</a>
					</Link>
				</div>
			</div>
			<div>
				<CenterWrapper>
					<div>Underbara pasteller</div>
					<div>Få inspiration till vårens favoritfärg</div>
				</CenterWrapper>
				<ProductCarousel products={category.products} sidePadding={Math.max(windowWidth - 1240, 0) / 2} />
			</div>
		</React.Fragment>
	);
};

Home.getInitialProps = async ({ relayEnvironment }) => {
	await fetchQuery<HomeQuery>(relayEnvironment, HOME_QUERY, {});

	return {};
};

export default Home;
