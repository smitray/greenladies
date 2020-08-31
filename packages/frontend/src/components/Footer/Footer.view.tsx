import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { Footer_query } from './__generated__/Footer_query.graphql';
import { FooterCategoriesAndBrands } from './FooterCategoriesAndBrands';
import { FooterEmailSignup } from './FooterEmailSignup';
import { FooterInfo } from './FooterInfo';

interface FooterViewProps {
	query: Footer_query;
}

const FooterView = ({ query }: FooterViewProps) => {
	return (
		<div>
			<FooterEmailSignup />
			<FooterInfo />
			<FooterCategoriesAndBrands query={query} />
			<div style={{ textAlign: 'center', background: 'lightgrey', color: 'grey', padding: '16px', fontSize: '14px' }}>
				&copy; {new Date().getFullYear()} Green Ladies (Rödholms Ekipering AB). All Rights Reserved
			</div>
		</div>
	);
};

export default createFragmentContainer(FooterView, {
	query: graphql`
		fragment Footer_query on Query {
			...FooterCategoriesAndBrands_query
		}
	`,
});
