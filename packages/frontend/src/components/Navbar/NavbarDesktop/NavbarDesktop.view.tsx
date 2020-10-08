import React, { useEffect, useRef, useState } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Collapse } from 'react-collapse';
import { BiShoppingBag } from 'react-icons/bi';
import { FaRegHeart, FaSearch } from 'react-icons/fa';
import { graphql, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';
import styled from 'styled-components';

import { useShoppingCartModal } from '../../../contexts/shopping-cart-model-context';
import { useClickOutside } from '../../../hooks/use-click-outside';
import { CenterWrapper } from '../../../styles/center-wrapper';
import { IconWrapper } from '../../../styles/icon-wrapper';
import { Link } from '../../Link';
import { SearchResults } from '../../SearchResults';
import { ShoppingCartModal } from '../../ShoppingCartModal';
import { WishlistDrawer } from '../../WishlistDrawer';

import { NavbarDesktop_megamenu } from './__generated__/NavbarDesktop_megamenu.graphql';
import { NavbarDesktopShoppingCartQuery } from './__generated__/NavbarDesktopShoppingCartQuery.graphql';
import { NavbarDesktopWishlistQuery } from './__generated__/NavbarDesktopWishlistQuery.graphql';
import { MegaMenu } from './../MegaMenu';
import { DropdownWrapper, Group, Item, ItemText, ItemWrapper, Row, Wrapper } from './Navbar.styles';

const FirstRow = styled(Row)`
	align-items: center;
	height: 48px;

	@media (min-width: 641px) {
		flex-direction: row-reverse;
		position: relative;
	}
`;

const SecondRow = styled(Row)`
	border-top: 1px solid lightgrey;
	border-bottom: 1px solid lightgrey;
`;

const LogoWrapper = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Logo = styled.img`
	height: 28px;
`;

const WISHLIST_QUERY = graphql`
	query NavbarDesktopWishlistQuery {
		wishlist {
			products(first: 10000) @connection(key: "Wishlist_products") {
				edges {
					node {
						id
					}
				}
			}
			...WishlistDrawer_wishlist
		}
	}
`;

const SHOPPING_CART_QUERY = graphql`
	query NavbarDesktopShoppingCartQuery {
		shoppingCart {
			items(first: 10000) @connection(key: "ShoppingCart_items") {
				edges {
					node {
						amount
					}
				}
			}
			...ShoppingCartModal_cart
		}
	}
`;

interface NavbarDesktopViewProps {
	megamenu: NavbarDesktop_megamenu;
	currentlySelectedTopLevelItemIndex: number | null;
	handleTopLevelItemFocus: (index: number) => void;
	handleTopLevelItemUnfocus: () => void;
	handleMegaMenuFocus: () => void;
	handleMegaMenuUnfocus: () => void;
}

export const NavbarDesktopView = ({
	megamenu,
	currentlySelectedTopLevelItemIndex,
	handleTopLevelItemFocus,
	handleTopLevelItemUnfocus,
	handleMegaMenuFocus,
	handleMegaMenuUnfocus,
}: NavbarDesktopViewProps) => {
	const [wishlistDrawerIsOpen, setWishlistDrawerIsOpen] = useState(false);
	const {
		isOpen: shoppingCartModalIsOpen,
		open: openShoppingCartModal,
		close: closeShoppingCartModal,
	} = useShoppingCartModal();
	const relayEnvironment = useRelayEnvironment();
	const cartModalWrapperRef = useRef(null);
	const [shoppingCartModalButtonFocus, setShoppingCartModalButtonFocus] = useState(false);
	useClickOutside(cartModalWrapperRef, () => {
		if (!shoppingCartModalButtonFocus) {
			closeShoppingCartModal();
		}
	});
	const [searchIsOpen, setSearchIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const searchInputHovered = useRef(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	useClickOutside(dropdownRef, () => {
		if (searchIsOpen && !searchInputHovered.current) {
			setSearchIsOpen(false);
		}
	});

	const { asPath } = useRouter();
	useEffect(() => {
		setSearchIsOpen(false);
	}, [asPath]);

	useEffect(() => {
		if (currentlySelectedTopLevelItemIndex !== null) {
			setSearchIsOpen(false);
		}
	}, [currentlySelectedTopLevelItemIndex]);

	const showMegamenuDropdown = currentlySelectedTopLevelItemIndex !== null;
	const showSearchResultsDropdown = !showMegamenuDropdown && searchIsOpen;

	return (
		<Wrapper>
			<CenterWrapper>
				<FirstRow>
					<LogoWrapper>
						<NextLink href="/[[...slug]]" as="/" passHref>
							<a>
								<Logo src="/images/greenladies-logo.png" />
							</a>
						</NextLink>
					</LogoWrapper>
					<Group style={{ alignItems: 'center' }}>
						<QueryRenderer<NavbarDesktopWishlistQuery>
							environment={relayEnvironment}
							query={WISHLIST_QUERY}
							variables={{}}
							render={({ error, props }) => {
								if (error) {
									return null;
								}

								if (props) {
									const total = props.wishlist.products.edges.length;

									return (
										<React.Fragment>
											<WishlistDrawer
												wishlist={props.wishlist}
												open={wishlistDrawerIsOpen}
												onCloseRequest={() => setWishlistDrawerIsOpen(false)}
											/>
											<button
												style={{
													display: 'flex',
													flexDirection: 'column',
													justifyContent: 'center',
													alignItems: 'center',
													cursor: 'pointer',
													background: 'none',
													border: 'none',
													outline: 'none',
													padding: 'none',
												}}
												onClick={() => setWishlistDrawerIsOpen(true)}
											>
												<div style={{ width: '20px', height: '20px', position: 'relative' }}>
													<FaRegHeart size="20" />
													<div
														style={{
															position: 'absolute',
															background: '#ddd',
															borderRadius: '100%',
															fontSize: '10px',
															lineHeight: '16px',
															textAlign: 'center',
															top: '0',
															right: '-8px',
															width: '16px',
															height: '16px',
															fontWeight: 'bold',
														}}
													>
														{total}
													</div>
												</div>
												<div style={{ fontSize: '12px' }}>Favoriter</div>
											</button>
										</React.Fragment>
									);
								}

								return (
									<button
										style={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
											cursor: 'pointer',
											background: 'none',
											border: 'none',
											outline: 'none',
											padding: 'none',
										}}
										onClick={() => setWishlistDrawerIsOpen(true)}
									>
										<div style={{ width: '20px', height: '20px', position: 'relative' }}>
											<FaRegHeart size="20" />
										</div>
										<div style={{ fontSize: '12px' }}>Favoriter</div>
									</button>
								);
							}}
						/>
						<QueryRenderer<NavbarDesktopShoppingCartQuery>
							environment={relayEnvironment}
							query={SHOPPING_CART_QUERY}
							variables={{}}
							render={({ error, props }) => {
								if (error) {
									return null;
								}

								if (props) {
									const total = props.shoppingCart.items.edges.reduce((prev, current) => prev + current.node.amount, 0);

									return (
										<React.Fragment>
											<button
												style={{
													position: 'relative',
													background: 'none',
													outline: 'none',
													padding: '0',
													borderTop: shoppingCartModalIsOpen ? '2px solid black' : '2px solid transparent',
													borderLeft: shoppingCartModalIsOpen ? '2px solid black' : '2px solid transparent',
													borderRight: shoppingCartModalIsOpen ? '2px solid black' : '2px solid transparent',
													borderBottom: 'none',
													margin: '0 0 0 8px',
													zIndex: 40,
													transition: 'all 300ms',
												}}
												onClick={() => {
													if (shoppingCartModalButtonFocus) {
														if (shoppingCartModalIsOpen) {
															closeShoppingCartModal();
														} else {
															openShoppingCartModal();
														}
													}
												}}
											>
												<div
													style={{
														display: 'flex',
														flexDirection: 'column',
														justifyContent: 'center',
														alignItems: 'center',
														cursor: 'pointer',
														background: 'white',
														padding: '4px 4px 6px',
														zIndex: 1000,
														position: 'relative',
													}}
													onMouseEnter={() => setShoppingCartModalButtonFocus(true)}
													onMouseLeave={() => setShoppingCartModalButtonFocus(false)}
												>
													<div style={{ width: '20px', height: '20px', position: 'relative' }}>
														<BiShoppingBag size="20" />
														<div
															style={{
																position: 'absolute',
																background: 'black',
																color: 'white',
																borderRadius: '100%',
																fontSize: '10px',
																lineHeight: '16px',
																textAlign: 'center',
																top: '0',
																right: '-8px',
																width: '16px',
																height: '16px',
																fontWeight: 'bold',
															}}
														>
															{total}
														</div>
													</div>
													<div style={{ fontSize: '12px' }}>Varukorg</div>
												</div>
												<div
													style={{ position: 'absolute', marginTop: '-2px', right: '-2px', zIndex: 20 }}
													ref={cartModalWrapperRef}
												>
													<Collapse isOpened={shoppingCartModalIsOpen}>
														<div style={{ border: '2px solid black', background: 'white', zIndex: 20 }}>
															<ShoppingCartModal cart={props.shoppingCart} />
														</div>
													</Collapse>
												</div>
											</button>
										</React.Fragment>
									);
								}

								return (
									<button
										style={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
											cursor: 'pointer',
											background: 'none',
											border: 'none',
											outline: 'none',
											padding: 'none',
										}}
									>
										<div style={{ width: '20px', height: '20px', position: 'relative' }}>
											<BiShoppingBag size="20" />
										</div>
										<div style={{ fontSize: '12px' }}>Varukorg</div>
									</button>
								);
							}}
						/>
					</Group>
				</FirstRow>
			</CenterWrapper>
			<SecondRow>
				<CenterWrapper style={{ display: 'block' }}>
					<Row>
						<Group style={{ marginLeft: '-12px', flexGrow: 1 }}>
							{megamenu.items.map((item, index) => {
								return (
									<li key={index}>
										<Link link={item.link}>
											<ItemWrapper
												onMouseEnter={() => handleTopLevelItemFocus(index)}
												onMouseLeave={handleTopLevelItemUnfocus}
											>
												<Item active={index === currentlySelectedTopLevelItemIndex}>
													<ItemText>{item.name}</ItemText>
												</Item>
											</ItemWrapper>
										</Link>
									</li>
								);
							})}
						</Group>
						<Group
							style={{
								flexBasis: '40%',
								minWidth: '400px',
								borderLeft: '1px solid lightgrey',
								borderRight: '1px solid lightgrey',
								position: 'relative',
							}}
						>
							<input
								style={{
									border: 'none',
									outline: 'none',
									width: '100%',
									paddingLeft: '48px',
									height: '100%',
								}}
								type="text"
								placeholder="Sök produkter, kategorier och märken"
								value={searchQuery}
								onChange={e => {
									const query = e.target.value;
									setSearchQuery(query);

									if (query === '') {
										setSearchIsOpen(false);
									} else {
										setSearchIsOpen(true);
									}
								}}
								onClick={() => {
									if (searchQuery !== '') {
										setSearchIsOpen(true);
									}
								}}
								onMouseEnter={() => (searchInputHovered.current = true)}
								onMouseLeave={() => (searchInputHovered.current = false)}
							/>
							<div
								style={{
									position: 'absolute',
									left: '16px',
									bottom: '0',
									top: '0',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<IconWrapper size="16px">
									<FaSearch size="16px" color="grey" />
								</IconWrapper>
							</div>
						</Group>
					</Row>
				</CenterWrapper>
			</SecondRow>
			<DropdownWrapper ref={dropdownRef} onMouseEnter={handleMegaMenuFocus} onMouseLeave={handleMegaMenuUnfocus}>
				<Collapse isOpened={showMegamenuDropdown || showSearchResultsDropdown}>
					<CenterWrapper style={{ paddingTop: '32px', paddingBottom: '32px' }}>
						{showMegamenuDropdown && (
							<MegaMenu
								item={
									// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
									megamenu.items[currentlySelectedTopLevelItemIndex!]
								}
							/>
						)}
						{showSearchResultsDropdown && <SearchResults query={searchQuery} />}
					</CenterWrapper>
				</Collapse>
			</DropdownWrapper>
		</Wrapper>
	);
};
