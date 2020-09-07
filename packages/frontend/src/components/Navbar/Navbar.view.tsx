import React, { useEffect, useRef, useState } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Collapse } from 'react-collapse';
import { BiShoppingBag } from 'react-icons/bi';
import { FaRegHeart, FaSearch } from 'react-icons/fa';
import { fetchQuery, graphql, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';

import { useShoppingCartModal } from '../../contexts/shopping-cart-model-context';
import { useClickOutside } from '../../hooks/use-click-outside';
import { Link } from '../Link';
import { ShoppingCartModal } from '../ShoppingCartModal';
import { WishlistDrawer } from '../WishlistDrawer';

import { Navbar_megamenu } from './__generated__/Navbar_megamenu.graphql';
import { NavbarSearchQuery } from './__generated__/NavbarSearchQuery.graphql';
import { NavbarShoppingCartQuery } from './__generated__/NavbarShoppingCartQuery.graphql';
import { NavbarWishlistQuery } from './__generated__/NavbarWishlistQuery.graphql';
import { MegaMenu } from './MegaMenu';
import {
	CenterWrapper,
	Group,
	Item,
	ItemText,
	ItemWrapper,
	MegaMenu as MegaMenuWrapper,
	Row,
	Wrapper,
} from './Navbar.styles';

const SEARCH_QUERY = graphql`
	query NavbarSearchQuery($query: String!) {
		search(query: $query) {
			brands {
				id
				name
			}
			categories {
				id
				name
				urlKey
			}
			products {
				id
				urlKey
				brand
				name
				image
				originalPrice
				specialPrice
			}
		}
	}
`;

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
	const [searchResults, setSearchResults] = useState<NavbarSearchQuery['response']['search'] | null>(null);
	const searchInputHovered = useRef(false);
	const searchDebounceTimeout = useRef<number | null>(null);
	const searchResultEl = useRef<HTMLDivElement>(null);
	useClickOutside(searchResultEl, () => {
		if (!searchInputHovered.current) {
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
									if (searchDebounceTimeout.current !== null) {
										clearTimeout(searchDebounceTimeout.current);
										searchDebounceTimeout.current = null;
									}

									if (query !== '') {
										searchDebounceTimeout.current = window.setTimeout(() => {
											fetchQuery<NavbarSearchQuery>(relayEnvironment, SEARCH_QUERY, {
												query,
											}).then(({ search }) => {
												setSearchResults(search);
												setSearchIsOpen(true);
											});
										}, 1000);
									}
								}}
								onFocus={() => {
									if (searchResults !== null) {
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
								<div style={{ width: '16px', height: '16px' }}>
									<FaSearch size="16" color="grey" />
								</div>
							</div>
						</Group>
					</Row>
				</CenterWrapper>
			</Row>
			<MegaMenuWrapper
				open={currentlySelectedTopLevelItemIndex !== null}
				onMouseEnter={handleMegaMenuFocus}
				onMouseLeave={handleMegaMenuUnfocus}
			>
				<CenterWrapper style={{ paddingTop: '32px', paddingBottom: '32px' }}>
					{currentlySelectedTopLevelItemIndex != null && (
						<MegaMenu item={megamenu.items[currentlySelectedTopLevelItemIndex]} />
					)}
				</CenterWrapper>
			</MegaMenuWrapper>
			<div style={{ zIndex: 200, position: 'absolute', width: '100%' }}>
				<Collapse isOpened={searchIsOpen}>
					<div style={{ padding: '20px 0', background: 'white' }} ref={searchResultEl}>
						<CenterWrapper>
							{searchResults === null ||
							(searchResults.brands.length === 0 &&
								searchResults.categories.length === 0 &&
								searchResults.products.length === 0) ? (
								<div style={{ padding: '64px', textAlign: 'center' }}>inga resultat hittades</div>
							) : (
								<React.Fragment>
									{(searchResults.brands.length > 0 || searchResults.categories.length > 0) && (
										<div style={{ display: 'flex', marginBottom: '24px' }}>
											{searchResults.brands.length > 0 && (
												<div
													style={{
														flexBasis: '50%',
														flexShrink: 0,
														display: 'flex',
														flexDirection: 'column',
														alignItems: 'flex-start',
													}}
												>
													<div style={{ fontWeight: 'bold', marginBottom: '16px' }}>Märken</div>
													{searchResults.brands.map(brand => (
														<NextLink key={brand.id} href={`/categories/all?brands=${brand.name}`} passHref>
															<a style={{ color: 'black', textDecoration: 'none', padding: '4px 0' }}>{brand.name}</a>
														</NextLink>
													))}
												</div>
											)}
											{searchResults.categories.length > 0 && (
												<div
													style={{
														flexBasis: '50%',
														flexShrink: 0,
														display: 'flex',
														flexDirection: 'column',
														alignItems: 'flex-start',
													}}
												>
													<div style={{ fontWeight: 'bold', marginBottom: '16px' }}>Kategorier</div>
													{searchResults.categories.map(category => (
														<NextLink
															key={category.id}
															href="/categories/[key]"
															as={`/categories/${category.urlKey}`}
															passHref
														>
															<a style={{ color: 'black', textDecoration: 'none', padding: '4px 0' }}>
																{category.name}
															</a>
														</NextLink>
													))}
												</div>
											)}
										</div>
									)}

									{searchResults.products.length > 0 && (
										<React.Fragment>
											<div style={{ fontWeight: 'bold', marginBottom: '16px' }}>Produkter</div>
											<div>
												<div style={{ display: 'flex', margin: '0 -8px' }}>
													{searchResults.products.slice(0, 7).map(product => (
														<NextLink key={product.id} href="/products/[key]" as={`/products/${product.urlKey}`}>
															<a
																style={{
																	padding: '0 8px',
																	flexBasis: 100 / 7 + '%',
																	flexShrink: 0,
																	flexGrow: 0,
																	width: 100 / 7 + '%',
																	color: 'black',
																	textDecoration: 'none',
																}}
															>
																<div style={{ padding: '0 5%', background: '#f6f6f6', marginBottom: '8px' }}>
																	<div
																		style={{
																			position: 'relative',
																			width: '100%',
																			paddingTop: '131.4%',
																		}}
																	>
																		<img
																			src={product.image}
																			style={{
																				position: 'absolute',
																				top: '0',
																				right: '5%',
																				bottom: '0',
																				left: '5%',
																				width: '90%',
																			}}
																		/>
																	</div>
																</div>
																<div
																	style={{
																		overflow: 'hidden',
																		textOverflow: 'ellipsis',
																		whiteSpace: 'nowrap',
																		fontSize: '14px',
																		fontWeight: 'bold',
																		marginBottom: '4px',
																	}}
																>
																	{product.brand}
																</div>
																<div
																	style={{
																		overflow: 'hidden',
																		textOverflow: 'ellipsis',
																		whiteSpace: 'nowrap',
																		fontSize: '14px',
																		marginBottom: '4px',
																	}}
																>
																	{product.name}
																</div>
																<div>
																	<span
																		style={{
																			color: 'grey',
																			textDecoration: 'line-through',
																			fontSize: '14px',
																		}}
																	>
																		{product.originalPrice} kr
																	</span>
																	<span
																		style={{
																			color: 'red',
																			marginLeft: '8px',
																			fontSize: '14px',
																		}}
																	>
																		{product.specialPrice} kr
																	</span>
																</div>
															</a>
														</NextLink>
													))}
												</div>
											</div>
										</React.Fragment>
									)}
								</React.Fragment>
							)}
						</CenterWrapper>
					</div>
				</Collapse>
			</div>
		</Wrapper>
	);
};
