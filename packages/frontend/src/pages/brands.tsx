import React from 'react';

import Link from 'next/link';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { MyNextPage } from '../lib/types';
import { BRANDS_QUERY, BrandsQuery } from '../queries/brands';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto 16px auto;
`;

const Brands: MyNextPage = () => {
	const { brands } = useLazyLoadQuery<BrandsQuery>(BRANDS_QUERY, {}, { fetchPolicy: 'store-only' });
	const sectionMap = new Map<string, string[]>();

	for (const brand of brands) {
		const firstChar = brand.charAt(0).toLocaleLowerCase();

		const section = sectionMap.get(firstChar);
		if (section) {
			sectionMap.set(firstChar, [...section, brand]);
		} else {
			sectionMap.set(firstChar, [brand]);
		}
	}

	return (
		<CenterWrapper>
			<h1 style={{ fontSize: '32px', margin: '0 0 16px 0' }}>Alla Märken</h1>
			{[...sectionMap.entries()]
				.sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
				.map(([key, brands]) => {
					return (
						<div key={key} style={{ display: 'flex', borderTop: '1px solid lightgrey', padding: '8px 0' }}>
							<div style={{ flexBasis: '50px', fontSize: '16px', fontWeight: 'bold', padding: '4px 0' }}>
								{key.toLocaleUpperCase()}
							</div>
							<div style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap' }}>
								{brands.sort().map(brand => (
									<Link key={brand} href={`/categories/all?brands=${brand}`} passHref>
										<a
											style={{
												flexBasis: '25%',
												flexShrink: 0,
												fontSize: '14px',
												color: 'black',
												textDecoration: 'none',
												padding: '4px 0',
											}}
										>
											{brand}
										</a>
									</Link>
								))}
							</div>
						</div>
					);
				})}
		</CenterWrapper>
	);
};

Brands.getInitialProps = async ({ relayEnvironment }) => {
	await fetchQuery<BrandsQuery>(relayEnvironment, BRANDS_QUERY, {});

	return {};
};

export default Brands;
