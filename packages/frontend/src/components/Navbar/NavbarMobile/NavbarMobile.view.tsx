import React, { useState } from 'react';

import Link from 'next/link';
import { BiShoppingBag } from 'react-icons/bi';
import { FaRegHeart } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { HiOutlineSearch } from 'react-icons/hi';
import { createFragmentContainer, graphql, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';

import { useShoppingCartModal } from '../../../contexts/shopping-cart-model-context';
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
	const { open: openShoppingCart, isOpen: shoppingCartOpen } = useShoppingCartModal();

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
									items(first: 10000) @connection(key: "ShoppingCart_items") {
										edges {
											node {
												amount
											}
										}
									}
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
								const total = props.shoppingCart.items.edges.reduce((prev, current) => prev + current.node.amount, 0);

								return (
									<React.Fragment>
										<li onClick={() => openShoppingCart()}>
											<IconWrapper size="24px" style={{ position: 'relative' }}>
												<BiShoppingBag size="24" />
												<div
													style={{
														position: 'absolute',
														background: 'black',
														color: 'white',
														borderRadius: '100%',
														fontSize: '10px',
														lineHeight: '16px',
														textAlign: 'center',
														top: '-2px',
														right: '-6px',
														width: '16px',
														height: '16px',
														fontWeight: 'bold',
													}}
												>
													{total}
												</div>
											</IconWrapper>
										</li>
										<NavbarMobileShoppingCartDrawer cart={props.shoppingCart} open={shoppingCartOpen} />
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
