import React from 'react';

import Head from 'next/head';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';

import { CustomPageBanner } from '../components/custom-page/CustomPageBanner';
import { CustomPageProductCarousel } from '../components/custom-page/CustomPageProductCarousel';
import { CustomPageTabs } from '../components/custom-page/CustomPageTabs';
import { CustomPageTripleImage } from '../components/custom-page/CustomPageTripleImage';
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
			{customPage.sections.map((section, index, sections) => {
				switch (section.section.__typename) {
					case 'CustomPageBanner':
						// Add white space if next component is another banner or a triple image
						if (index < sections.length - 1) {
							const next = sections[index + 1];
							if (
								next.section.__typename === 'CustomPageBanner' ||
								next.section.__typename === 'CustomPageTripleImage'
							) {
								return (
									<React.Fragment key={index}>
										<CustomPageBanner banner={section.section} />
										<div style={{ height: '72px' }}></div>
									</React.Fragment>
								);
							}
						}
						// Add white space if it is the last component, to add spacing between this and the email signup
						if (index === sections.length - 1) {
							return (
								<React.Fragment key={index}>
									<CustomPageBanner banner={section.section} />
									<div style={{ height: '72px' }}></div>
								</React.Fragment>
							);
						}
						return <CustomPageBanner key={index} banner={section.section} />;
					case 'CustomPageProductCarousel':
						return <CustomPageProductCarousel key={index} carousel={section.section} />;
					case 'CustomPageTab':
						return <CustomPageTabs key={index} tabs={section.section} />;
					case 'CustomPageTripleImage': {
						// Add white space if next component is another triple image or a banner
						if (index < sections.length - 1) {
							const next = sections[index + 1];
							if (
								next.section.__typename === 'CustomPageBanner' ||
								next.section.__typename === 'CustomPageTripleImage'
							) {
								return (
									<React.Fragment key={index}>
										<CustomPageTripleImage tripleImage={section.section} />
										<div style={{ height: '72px' }}></div>
									</React.Fragment>
								);
							}
						}
						// Add white space if it is the last component, to add spacing between this and the email signup
						if (index === sections.length - 1) {
							return (
								<React.Fragment key={index}>
									<CustomPageTripleImage tripleImage={section.section} />
									<div style={{ height: '72px' }}></div>
								</React.Fragment>
							);
						}
						return <CustomPageTripleImage key={index} tripleImage={section.section} />;
					}
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
