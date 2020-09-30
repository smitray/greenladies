import React from 'react';

import Head from 'next/head';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';

import { CustomPageBanner } from '../components/CustomPageBanner';
import { CustomPageProductCarousel } from '../components/CustomPageProductCarousel';
import CustomPageTabsView from '../components/CustomPageTabs/CustomPageTabs.view';
import { CustomPageTripleImage } from '../components/CustomPageTripleImage';
import { MyNextPage } from '../lib/types';
import { CUSTOM_PAGE_QUERY, CustomPageQuery } from '../queries/custom-page';

interface Props {
	path: string;
}

const CustomPage: MyNextPage<Props> = ({ path }) => {
	const { customPage } = useLazyLoadQuery<CustomPageQuery>(CUSTOM_PAGE_QUERY, { path }, { fetchKey: 'store-only' });

	return (
		<React.Fragment>
			<Head>
				<title>{customPage.metaTitle}</title>
				<meta name="keywords" content={customPage.metaKeywords} />
				<meta name="description" content={customPage.metaDescription} />
				<meta name="robots" content="index,follow" />
			</Head>
			{customPage.sections.map((section, index) => {
				switch (section.__typename) {
					case 'CustomPageBanner':
						return <CustomPageBanner key={index} banner={section} />;
					case 'CustomPageProductCarousel':
						return <CustomPageProductCarousel key={index} carousel={section} />;
					case 'CustomPageTab':
						return <CustomPageTabsView key={index} tabs={section} />;
					case 'CustomPageTripleImage':
						return <CustomPageTripleImage key={index} tripleImage={section} />;
					case '%other':
						return null;
				}
			})}
		</React.Fragment>
	);
};

CustomPage.getInitialProps = async ({ relayEnvironment, query }) => {
	const slug = Array.isArray(query.slug) ? query.slug : [];
	const path = '/' + slug.join('/');
	await fetchQuery<CustomPageQuery>(relayEnvironment, CUSTOM_PAGE_QUERY, {
		path,
	});

	return {
		path,
	};
};

export default CustomPage;
