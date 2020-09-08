import React from 'react';

import Link from 'next/link';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { MyNextPage } from '../lib/types';
import { BRANDS_QUERY, BrandsQuery } from '../queries/brands';
import { CenterWrapper } from '../styles/center-wrapper';

const SomeKindOfWrapper = styled.div`
	padding: 24px 0;
`;

const Brands: MyNextPage = () => {
	const { brands } = useLazyLoadQuery<BrandsQuery>(BRANDS_QUERY, {}, { fetchPolicy: 'store-only' });
	const sectionMap = new Map<string, BrandsQuery['response']['brands'][0][]>();

	for (const brand of brands) {
		const firstChar = brand.name.charAt(0).toLocaleLowerCase();

		const section = sectionMap.get(firstChar);
		if (section) {
			sectionMap.set(firstChar, [...section, brand]);
		} else {
			sectionMap.set(firstChar, [brand]);
		}
	}

	return (
		<CenterWrapper>
			<SomeKindOfWrapper>
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
										<Link key={brand.id} href={`/categories/all?brands=${brand.name}`} passHref>
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
												{brand.name}
											</a>
										</Link>
									))}
								</div>
							</div>
						);
					})}
			</SomeKindOfWrapper>
		</CenterWrapper>
	);
};

Brands.getInitialProps = async ({ relayEnvironment }) => {
	await fetchQuery<BrandsQuery>(relayEnvironment, BRANDS_QUERY, {});

	return {};
};

export default Brands;
