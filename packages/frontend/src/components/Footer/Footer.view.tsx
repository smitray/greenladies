import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { Footer_query } from './__generated__/Footer_query.graphql';
import { FooterCopyright } from './Footer.styles';
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
			<FooterCopyright>&copy; {new Date().getFullYear()} Green Ladies. All Rights Reserved</FooterCopyright>
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
