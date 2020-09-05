import React, { useRef, useState } from 'react';

import NextLink from 'next/link';
import { BiShoppingBag } from 'react-icons/bi';
import { FaRegHeart, FaSearch } from 'react-icons/fa';
import { fetchQuery, graphql, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';
import styled from 'styled-components';

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

const SearchLink = styled.a`
	color: black;
	text-decoration: none;
	font-size: 14px;
	display: block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: hidden;
	padding: 8px 4px;
`;

const highlightResult = (result: string, indices: readonly number[]) => {
	const intervals: JSX.Element[] = [];
	let prevStartIndex = -1;
	let prevIndex = -1;
	indices.forEach((index, i, arr) => {
		const isFirst = i === 0;
		const isLast = i === arr.length - 1;

		if (isFirst) {
			if (index > 0) {
				intervals.push(<span>{result.slice(0, index)}</span>);
			}

			prevStartIndex = index;
		}

		if (!isFirst && index - prevIndex > 1) {
			intervals.push(<strong>{result.slice(prevStartIndex, prevIndex + 1)}</strong>);
			intervals.push(<span>{result.slice(prevIndex + 1, index)}</span>);

			prevStartIndex = index;
		}

		if (isLast) {
			intervals.push(<strong>{result.slice(prevStartIndex, index + 1)}</strong>);
			intervals.push(<span>{result.slice(index + 1)}</span>);
		}

		prevIndex = index;
	});

	return intervals;
};

const SEARCH_QUERY = graphql`
	query NavbarSearchQuery($query: String!) {
		search(query: $query) {
			results {
				node {
					__typename
					id
					... on Product {
						name
						urlKey
					}
					... on Brand {
						name
					}
				}
				meta {
					indices
				}
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
	const [searchResults, setSearchResults] = useState<NavbarSearchQuery['response']['search']['results'] | null>(null);
	const searchInputHovered = useRef(false);
	const searchDebounceTimeout = useRef<number | null>(null);
	const searchResultEl = useRef<HTMLDivElement>(null);
	useClickOutside(searchResultEl, () => {
		if (!searchInputHovered.current) {
			setSearchIsOpen(false);
		}
	});

	// const { categories }: NavbarProps = {
	// 	categories: [
	// 		{
	// 			promoBanner: {
	// 				image: null,
	// 				title: 'Grönare Garderob',
	// 				subtitle: 'Upptäck mer',
	// 			},
	// 			category: {
	// 				href: null,
	// 				name: 'Kläder',
	// 				categories: [
	// 					{
	// 						href: null,
	// 						name: 'Alla kläder',
	// 						categories: [
	// 							{
	// 								href: null,
	// 								name: 'Klänningar & Tunikor',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Toppar & Linnen',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Blusar & Skjortor',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Tröjor & Stickat',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Kavaj & Kostym',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Jackor & Kappor',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Byxor',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Jeans',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Kjolar & Shorts',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Basplagg & Underkläder',
	// 								categories: [],
	// 							},
	// 						],
	// 					},
	// 					{
	// 						href: null,
	// 						name: 'Utvalt',
	// 						categories: [
	// 							{
	// 								href: null,
	// 								name: 'Nyheter',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Hållbara regnjackor',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Nordiska designers',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Stilinspiration: Grön garderob',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Vintage',
	// 								categories: [],
	// 							},
	// 						],
	// 					},
	// 				],
	// 			},
	// 		},
	// 		{
	// 			promoBanner: {
	// 				image: null,
	// 				title: 'Grönare Garderob',
	// 				subtitle: 'Upptäck mer',
	// 			},
	// 			category: {
	// 				href: null,
	// 				name: 'Skor',
	// 				categories: [
	// 					{
	// 						href: null,
	// 						name: 'Alla damskor',
	// 						categories: [
	// 							{
	// 								href: null,
	// 								name: 'Sneakers & Lågskor',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Högklackade skor',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Pumps',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Sandaler& Sandletter',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Ballerina',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Ankelboots',
	// 								categories: [],
	// 							},
	// 							{
	// 								href: null,
	// 								name: 'Stövlar',
	// 								categories: [],
	// 							},
	// 						],
	// 					},
	// 				],
	// 			},
	// 		},
	// 	],
	// };

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
						<NextLink href="/" passHref>
							<a>
								<img src="/images/greenladies-logo.png" alt="" style={{ height: '24px' }} />
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
							}}
						>
							<div style={{ position: 'relative', width: '100%' }}>
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
													setSearchResults(search.results);
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
								<div
									ref={searchResultEl}
									style={{
										position: 'absolute',
										marginTop: '1px',
										right: '-1px',
										zIndex: 30,
										width: '150%',
										maxHeight: '500px',
									}}
								>
									{searchIsOpen && searchResults !== null && (
										<div
											style={{
												background: 'white',
												borderRight: '1px solid lightgrey',
												borderBottom: '1px solid lightgrey',
												borderLeft: '1px solid lightgrey',
												padding: '12px',
											}}
										>
											{searchResults.length === 0 && (
												<div style={{ color: '#999999', fontSize: '14px', textAlign: 'center', padding: '8px 0' }}>
													Hittade inget som matchade din sökning
												</div>
											)}
											{searchResults.length > 0 && (
												<div>
													{searchResults.map(result => {
														if (result.node.__typename === 'Product') {
															return (
																<NextLink href="/products/[key]" as={`/products/${result.node.urlKey}`} passHref>
																	<SearchLink onClick={() => setSearchIsOpen(false)}>
																		Produkt:{' '}
																		{
																			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
																			highlightResult(result.node.name!, result.meta.indices)
																		}
																	</SearchLink>
																</NextLink>
															);
														}

														if (result.node.__typename === 'Brand') {
															return (
																<NextLink
																	href={`/categories/all?brands=${result.node.name}`}
																	as={`/categories/all?brands=${result.node.name}`}
																	passHref
																>
																	<SearchLink onClick={() => setSearchIsOpen(false)}>
																		Märke:{' '}
																		{
																			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
																			highlightResult(result.node.name!, result.meta.indices)
																		}
																	</SearchLink>
																</NextLink>
															);
														}

														return null;
													})}
												</div>
											)}
										</div>
									)}
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
		</Wrapper>
	);
};
