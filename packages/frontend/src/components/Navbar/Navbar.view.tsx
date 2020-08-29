import React, { useRef, useState } from 'react';

import Link from 'next/link';
import { BiShoppingBag } from 'react-icons/bi';
import { FaRegHeart } from 'react-icons/fa';
import { graphql, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';

import { useShoppingCartModal } from '../../contexts/shopping-cart-model-context';
import { useClickOutside } from '../../hooks/use-click-outside';
import { ShoppingCartModal } from '../ShoppingCartModal';
import { WishlistDrawer } from '../WishlistDrawer';

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

interface PromoBanner {
	image: string | null;
	title: string;
	subtitle: string;
}

interface NavbarProps {
	categories: {
		category: Category;
		promoBanner: PromoBanner;
	}[];
}

interface Category {
	name: string;
	href: string | null;
	categories: Category[];
}

interface NavbarViewProps {
	currentlySelectedTopLevelItemIndex: number | null;
	handleTopLevelItemFocus: (index: number) => void;
	handleTopLevelItemUnfocus: () => void;
	handleMegaMenuFocus: () => void;
	handleMegaMenuUnfocus: () => void;
}

export const NavbarView = ({
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
	const { categories }: NavbarProps = {
		categories: [
			{
				promoBanner: {
					image: null,
					title: 'Grönare Garderob',
					subtitle: 'Upptäck mer',
				},
				category: {
					href: null,
					name: 'Kläder',
					categories: [
						{
							href: null,
							name: 'Alla kläder',
							categories: [
								{
									href: null,
									name: 'Klänningar & Tunikor',
									categories: [],
								},
								{
									href: null,
									name: 'Toppar & Linnen',
									categories: [],
								},
								{
									href: null,
									name: 'Blusar & Skjortor',
									categories: [],
								},
								{
									href: null,
									name: 'Tröjor & Stickat',
									categories: [],
								},
								{
									href: null,
									name: 'Kavaj & Kostym',
									categories: [],
								},
								{
									href: null,
									name: 'Jackor & Kappor',
									categories: [],
								},
								{
									href: null,
									name: 'Byxor',
									categories: [],
								},
								{
									href: null,
									name: 'Jeans',
									categories: [],
								},
								{
									href: null,
									name: 'Kjolar & Shorts',
									categories: [],
								},
								{
									href: null,
									name: 'Basplagg & Underkläder',
									categories: [],
								},
							],
						},
						{
							href: null,
							name: 'Utvalt',
							categories: [
								{
									href: null,
									name: 'Nyheter',
									categories: [],
								},
								{
									href: null,
									name: 'Hållbara regnjackor',
									categories: [],
								},
								{
									href: null,
									name: 'Nordiska designers',
									categories: [],
								},
								{
									href: null,
									name: 'Stilinspiration: Grön garderob',
									categories: [],
								},
								{
									href: null,
									name: 'Vintage',
									categories: [],
								},
							],
						},
					],
				},
			},
			{
				promoBanner: {
					image: null,
					title: 'Grönare Garderob',
					subtitle: 'Upptäck mer',
				},
				category: {
					href: null,
					name: 'Skor',
					categories: [
						{
							href: null,
							name: 'Alla damskor',
							categories: [
								{
									href: null,
									name: 'Sneakers & Lågskor',
									categories: [],
								},
								{
									href: null,
									name: 'Högklackade skor',
									categories: [],
								},
								{
									href: null,
									name: 'Pumps',
									categories: [],
								},
								{
									href: null,
									name: 'Sandaler& Sandletter',
									categories: [],
								},
								{
									href: null,
									name: 'Ballerina',
									categories: [],
								},
								{
									href: null,
									name: 'Ankelboots',
									categories: [],
								},
								{
									href: null,
									name: 'Stövlar',
									categories: [],
								},
							],
						},
					],
				},
			},
		],
	};

	return (
		<Wrapper>
			<CenterWrapper>
				<Row>
					<Group style={{ marginLeft: '-20px' }}>
						{categories.map((category, index) => {
							return (
								<li key={index}>
									<Link href="/">
										<ItemWrapper
											onMouseEnter={() => handleTopLevelItemFocus(index)}
											onMouseLeave={handleTopLevelItemUnfocus}
										>
											<Item>
												<ItemText>{category.category.name}</ItemText>
											</Item>
										</ItemWrapper>
									</Link>
								</li>
							);
						})}
					</Group>
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
			<MegaMenuWrapper
				open={currentlySelectedTopLevelItemIndex !== null}
				onMouseEnter={handleMegaMenuFocus}
				onMouseLeave={handleMegaMenuUnfocus}
			>
				<CenterWrapper style={{ paddingTop: '20px', paddingBottom: '20px' }}>
					{currentlySelectedTopLevelItemIndex != null && (
						<MegaMenu category={categories[currentlySelectedTopLevelItemIndex].category} />
					)}
				</CenterWrapper>
			</MegaMenuWrapper>
		</Wrapper>
	);
};
