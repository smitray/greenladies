import React, { useState } from 'react';

import Link from 'next/link';
import { BiShoppingBag } from 'react-icons/bi';
import { FaRegHeart } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { HiOutlineSearch } from 'react-icons/hi';
import { createFragmentContainer, graphql, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';

import { IconWrapper } from '../../../styles/icon-wrapper';
import { WishlistDrawer } from '../../WishlistDrawer';

import { NavbarMobile_query } from './__generated__/NavbarMobile_query.graphql';
import { NavbarMobileShoppingCartQuery } from './__generated__/NavbarMobileShoppingCartQuery.graphql';
import { NavbarMobileWishlistQuery } from './__generated__/NavbarMobileWishlistQuery.graphql';
import {
	LogoImage,
	NavGroup,
	NavGroupHamburgerMenuItem,
	NavGroupLogoItem,
	NavGroupWishlistItem,
	NavRow,
	RightNavGroup,
} from './NavbarMobile.styles';
import { NavbarMobileMenuDrawer } from './NavbarMobileMenuDrawer';
import { NavbarMobileSearchDrawer } from './NavbarMobileSearchDrawer';
import { NavbarMobileShoppingCartDrawer } from './NavbarMobileShoppingCartDrawer';

interface NavbarMobileViewProps {
	searchQuery: string;
	onSearchQueryChange: (newSearchQuery: string) => void;
	query: NavbarMobile_query;
}

const NavbarMobileView = ({ searchQuery, onSearchQueryChange, query }: NavbarMobileViewProps) => {
	const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
	const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
	const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
	const [shoppingCartDrawerOpen, setShoppingCartDrawerOpen] = useState(false);

	const relayEnvironment = useRelayEnvironment();

	return (
		<React.Fragment>
			<NavRow>
				<NavGroup>
					<NavGroupHamburgerMenuItem onClick={() => setMenuDrawerOpen(true)}>
						<IconWrapper size="24px">
							<FiMenu size="24px" color="black" />
						</IconWrapper>
					</NavGroupHamburgerMenuItem>
					<NavGroupLogoItem>
						<Link href="/[[...slug]]" as="/" passHref>
							<a>
								<LogoImage src="/images/greenladies-logo.png" />
							</a>
						</Link>
					</NavGroupLogoItem>
				</NavGroup>
				<RightNavGroup>
					<li onClick={() => setSearchDrawerOpen(true)}>
						<IconWrapper size="24px">
							<HiOutlineSearch size="24px" />
						</IconWrapper>
					</li>
					<QueryRenderer<NavbarMobileWishlistQuery>
						environment={relayEnvironment}
						query={graphql`
							query NavbarMobileWishlistQuery {
								wishlist {
									...WishlistDrawer_wishlist
								}
							}
						`}
						variables={{}}
						render={({ error, props }) => {
							if (error) {
								return null;
							}

							if (props) {
								return (
									<React.Fragment>
										<NavGroupWishlistItem onClick={() => setWishlistDrawerOpen(true)}>
											<IconWrapper size="20px">
												<FaRegHeart size="20" />
											</IconWrapper>
										</NavGroupWishlistItem>
										<WishlistDrawer
											wishlist={props.wishlist}
											open={wishlistDrawerOpen}
											onCloseRequest={() => setWishlistDrawerOpen(false)}
										/>
									</React.Fragment>
								);
							}

							return (
								<NavGroupWishlistItem>
									<IconWrapper size="20px">
										<FaRegHeart size="20" />
									</IconWrapper>
								</NavGroupWishlistItem>
							);
						}}
					/>
					<QueryRenderer<NavbarMobileShoppingCartQuery>
						environment={relayEnvironment}
						query={graphql`
							query NavbarMobileShoppingCartQuery {
								shoppingCart {
									...NavbarMobileShoppingCartDrawer_cart
								}
							}
						`}
						variables={{}}
						render={({ error, props }) => {
							if (error) {
								return null;
							}

							if (props) {
								return (
									<React.Fragment>
										<li onClick={() => setShoppingCartDrawerOpen(true)}>
											<IconWrapper size="24px">
												<BiShoppingBag size="24" />
											</IconWrapper>
										</li>
										<NavbarMobileShoppingCartDrawer
											cart={props.shoppingCart}
											open={shoppingCartDrawerOpen}
											onCloseRequest={() => setShoppingCartDrawerOpen(false)}
										/>
									</React.Fragment>
								);
							}

							return (
								<li>
									<IconWrapper size="24px">
										<BiShoppingBag size="24" />
									</IconWrapper>
								</li>
							);
						}}
					/>
				</RightNavGroup>
			</NavRow>
			<NavbarMobileMenuDrawer query={query} open={menuDrawerOpen} onCloseRequest={() => setMenuDrawerOpen(false)} />
			<NavbarMobileSearchDrawer
				searchQuery={searchQuery}
				onSearchQueryChange={onSearchQueryChange}
				open={searchDrawerOpen}
				onCloseRequest={() => setSearchDrawerOpen(false)}
			/>
		</React.Fragment>
	);
};

export default createFragmentContainer(NavbarMobileView, {
	query: graphql`
		fragment NavbarMobile_query on Query {
			...NavbarMobileMenuDrawer_query
		}
	`,
});
