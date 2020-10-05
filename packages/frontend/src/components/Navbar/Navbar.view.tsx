import React, { useState } from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { HideOnMinSize, ShowOnMinSize } from '../../styles/responsive';

import { Navbar_megamenu } from './__generated__/Navbar_megamenu.graphql';
import { Navbar_query } from './__generated__/Navbar_query.graphql';
import { NavbarDesktop } from './NavbarDesktop';
import { NavbarMobile } from './NavbarMobile';

interface NavbarViewProps {
	query: Navbar_query;
	megamenu: Navbar_megamenu;
}

const NavbarView = ({ query, megamenu }: NavbarViewProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	return (
		<React.Fragment>
			<HideOnMinSize size="l" style={{ height: '48px' }}>
				<NavbarMobile
					searchQuery={searchQuery}
					onSearchQueryChange={newSearchQuery => setSearchQuery(newSearchQuery)}
					query={query}
				/>
			</HideOnMinSize>
			<ShowOnMinSize size="l">
				<NavbarDesktop megamenu={megamenu} />
			</ShowOnMinSize>
		</React.Fragment>
	);
};

export default createFragmentContainer(NavbarView, {
	megamenu: graphql`
		fragment Navbar_megamenu on Megamenu {
			...NavbarDesktop_megamenu
		}
	`,
	query: graphql`
		fragment Navbar_query on Query {
			...NavbarMobile_query
		}
	`,
});
