import React, { useEffect, useRef, useState } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Collapse } from 'react-collapse';
import { BiShoppingBag } from 'react-icons/bi';
import { FaRegHeart, FaSearch } from 'react-icons/fa';
import { graphql, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';

import { useShoppingCartModal } from '../../contexts/shopping-cart-model-context';
import { useClickOutside } from '../../hooks/use-click-outside';
import { CenterWrapper } from '../../styles/center-wrapper';
import { IconWrapper } from '../../styles/icon-wrapper';
import { Link } from '../Link';
import { SearchResults } from '../SearchResults';
import { ShoppingCartModal } from '../ShoppingCartModal';
import { WishlistDrawer } from '../WishlistDrawer';

import { Navbar_megamenu } from './__generated__/Navbar_megamenu.graphql';
import { NavbarShoppingCartQuery } from './__generated__/NavbarShoppingCartQuery.graphql';
import { NavbarWishlistQuery } from './__generated__/NavbarWishlistQuery.graphql';
import { MegaMenu } from './MegaMenu';
import { DropdownWrapper, Group, Item, ItemText, ItemWrapper, Row, Wrapper } from './Navbar.styles';

interface NavbarViewProps {
	megamenu: Navbar_megamenu;
	currentlySelectedTopLevelItemIndex: number | null;
	handleTopLevelItemFocus: (index: number) => void;
	handleTopLevelItemUnfocus: () => void;
	handleMegaMenuFocus: () => void;
	handleMegaMenuUnfocus: () => void;
}

export const NavbarView = ({
	megamenu,
	currentlySelectedTopLevelItemIndex,
	handleTopLevelItemFocus,
	handleTopLevelItemUnfocus,
	handleMegaMenuFocus,
	handleMegaMenuUnfocus,
}: NavbarViewProps) => {
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
				<Row style={{ flexDirection: 'row-reverse', position: 'relative', padding: '8px' }}>
					<div
						style={{
							position: 'absolute',
							top: '0',
							right: '0',
							bottom: '0',
							left: '0',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<NextLink href="/[[...slug]]" as="/" passHref>
							<a>
								<img src="/images/greenladies-logo.png" alt="" style={{ height: '32px' }} />
							</a>
						</NextLink>
					</div>
					<Group>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<QueryRenderer<NavbarWishlistQuery>
								environment={relayEnvironment}
								query={graphql`
									query NavbarWishlistQuery {
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
								`}
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
							<QueryRenderer<NavbarShoppingCartQuery>
								environment={relayEnvironment}
								query={graphql`
									query NavbarShoppingCartQuery {
										shoppingCart {
											items(first: 1000) @connection(key: "ShoppingCart_items") {
												edges {
													node {
														amount
													}
												}
											}
											...ShoppingCartModal_cart
										}
									}
								`}
								variables={{}}
								render={({ error, props }) => {
									if (error) {
										return null;
									}

									if (props) {
										const total = props.shoppingCart.items.edges.reduce(
											(prev, current) => prev + current.node.amount,
											0,
										);

										return (
											<React.Fragment>
												<button
													style={{
														position: 'relative',
														background: 'none',
														border: 'none',
														outline: 'none',
														padding: '0',
														margin: '0 0 0 8px',
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
														style={{ position: 'absolute', marginTop: '8px', right: '0', zIndex: 30 }}
														ref={cartModalWrapperRef}
													>
														{shoppingCartModalIsOpen && (
															<div style={{ border: '2px solid lightgrey', background: 'white' }}>
																<ShoppingCartModal cart={props.shoppingCart} />
															</div>
														)}
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
						</div>
					</Group>
				</Row>
			</CenterWrapper>
			<Row style={{ borderTop: '1px solid lightgrey', borderBottom: '1px solid lightgrey', display: 'block' }}>
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
								flexBasis: '300px',
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
								placeholder="Sök produkter eller märken"
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
								<IconWrapper size={16}>
									<FaSearch size="16" color="grey" />
								</IconWrapper>
							</div>
						</Group>
					</Row>
				</CenterWrapper>
			</Row>
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
