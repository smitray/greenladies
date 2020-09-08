import React, { useEffect, useRef, useState } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Drawer from 'rc-drawer';
import { Collapse } from 'react-collapse';
import { BiShoppingBag } from 'react-icons/bi';
import { FaBars, FaRegHeart, FaSearch, FaTimes } from 'react-icons/fa';
import { graphql, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';
import styled from 'styled-components';

import { useShoppingCartModal } from '../../contexts/shopping-cart-model-context';
import { useClickOutside } from '../../hooks/use-click-outside';
import { useWindowDimensions } from '../../hooks/use-window-dimensions';
import { CenterWrapper } from '../../styles/center-wrapper';
import { IconWrapper } from '../../styles/icon-wrapper';
import { NORMAL_TABLET_SIZE } from '../../utils/device-size';
import { DrawerMenu } from '../DrawerMenu';
import { Link } from '../Link';
import { SearchResults } from '../SearchResults';
import { ShoppingCartDrawer } from '../ShoppingCartDrawer';
import { ShoppingCartModal } from '../ShoppingCartModal';
import { WishlistDrawer } from '../WishlistDrawer';

import { Navbar_megamenu } from './__generated__/Navbar_megamenu.graphql';
import { Navbar_query } from './__generated__/Navbar_query.graphql';
import { NavbarShoppingCartQuery } from './__generated__/NavbarShoppingCartQuery.graphql';
import { NavbarWishlistQuery } from './__generated__/NavbarWishlistQuery.graphql';
import { MegaMenu } from './MegaMenu';
import { DropdownWrapper, Group, Item, ItemText, ItemWrapper, Row, Wrapper } from './Navbar.styles';

const FirstRow = styled(Row)`
	padding: 8px;
	align-items: center;

	@media (min-width: 641px) {
		flex-direction: row-reverse;
		position: relative;
	}
`;

const SecondRow = styled(Row)`
	display: none;

	border-top: 1px solid lightgrey;
	border-bottom: 1px solid lightgrey;

	@media (min-width: 961px) {
		display: block;
	}
`;

const MobileRow = styled(Row)`
	display: flex;

	border-top: 1px solid lightgrey;
	border-bottom: 1px solid lightgrey;

	@media (min-width: 961px) {
		display: none;
	}
`;

const LogoWrapper = styled.div`
	@media (min-width: 641px) {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

const Logo = styled.img`
	height: 24px;
`;

const Header = styled.div`
	position: relative;
	padding: 0.5em 0;
	text-align: center;
	font-size: 1.5em;
	line-height: 1.5em;
`;

const CloseButton = styled.button`
	position: absolute;
	right: 0.5em;
	top: 0.25em;
	background: white;
	border: none;
	outline: none;
	padding: 0.5em;
	font-size: 1em;
	cursor: pointer;
`;

interface NavbarViewProps {
	megamenu: Navbar_megamenu;
	query: Navbar_query;
	currentlySelectedTopLevelItemIndex: number | null;
	handleTopLevelItemFocus: (index: number) => void;
	handleTopLevelItemUnfocus: () => void;
	handleMegaMenuFocus: () => void;
	handleMegaMenuUnfocus: () => void;
}

export const NavbarView = ({
	query,
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
		setMobileSearchIsOpen(false);
	}, [asPath]);

	useEffect(() => {
		if (currentlySelectedTopLevelItemIndex !== null) {
			setSearchIsOpen(false);
		}
	}, [currentlySelectedTopLevelItemIndex]);

	const mobileSearchInputEl = useRef<HTMLInputElement>(null);

	const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
	const [mobileSearchIsOpen, setMobileSearchIsOpen] = useState(true);

	const showMegamenuDropdown = currentlySelectedTopLevelItemIndex !== null;
	const showSearchResultsDropdown = !showMegamenuDropdown && searchIsOpen;

	const { width: windowWidth } = useWindowDimensions();

	return (
		<Wrapper>
			<DrawerMenu query={query} open={mobileMenuIsOpen} onCloseRequest={() => setMobileMenuIsOpen(false)} />
			<Drawer
				level={null}
				open={mobileSearchIsOpen}
				placement="bottom"
				handler={null}
				height="100%"
				onClose={() => setMobileSearchIsOpen(false)}
				afterVisibleChange={open => {
					if (open && mobileSearchInputEl.current) {
						mobileSearchInputEl.current.focus();
					}
				}}
			>
				<Header>
					Sök
					<CloseButton onClick={() => setMobileSearchIsOpen(false)}>
						<IconWrapper size="1em">
							<FaTimes size="1em" />
						</IconWrapper>
					</CloseButton>
				</Header>
				<div style={{ padding: '0.5em 1em' }}>
					<input
						autoFocus
						ref={mobileSearchInputEl}
						style={{
							border: 'none',
							borderBottom: '1px solid black',
							padding: '0.5em 0',
							fontSize: '1em',
							lineHeight: '1em',
							width: '100%',
							outline: 'none',
						}}
						type="text"
						placeholder="Sök efter produkter mm."
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<div style={{ padding: '0.5em 1em' }}>
					<SearchResults query={searchQuery} />
				</div>
			</Drawer>
			<CenterWrapper>
				<FirstRow>
					<LogoWrapper>
						<NextLink href="/[[...slug]]" as="/" passHref>
							<a>
								<Logo src="/images/greenladies-logo.png" />
							</a>
						</NextLink>
					</LogoWrapper>
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
											...ShoppingCartDrawer_cart
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
														{shoppingCartModalIsOpen && windowWidth > NORMAL_TABLET_SIZE && (
															<div style={{ border: '2px solid lightgrey', background: 'white' }}>
																<ShoppingCartModal cart={props.shoppingCart} />
															</div>
														)}
													</div>
												</button>
												<ShoppingCartDrawer
													cart={props.shoppingCart}
													open={shoppingCartModalIsOpen && windowWidth <= NORMAL_TABLET_SIZE}
													onCloseRequest={() => closeShoppingCartModal()}
												/>
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
								<IconWrapper size="16px">
									<FaSearch size="16px" color="grey" />
								</IconWrapper>
							</div>
						</Group>
					</Row>
				</CenterWrapper>
			</SecondRow>
			<MobileRow>
				<Group>
					<div style={{ padding: '16px', cursor: 'pointer' }} onClick={() => setMobileMenuIsOpen(true)}>
						<IconWrapper size="16px">
							<FaBars size="16px" color="black" />
						</IconWrapper>
					</div>
				</Group>
				<Group
					style={{
						flexGrow: 1,
						borderLeft: '1px solid lightgrey',
						display: 'flex',
						cursor: 'pointer',
						padding: '16px',
					}}
					onClick={() => setMobileSearchIsOpen(true)}
				>
					<IconWrapper size="16px">
						<FaSearch size="16px" color="grey" />
					</IconWrapper>
					<span
						style={{
							marginLeft: '16px',
							color: 'grey',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							display: 'block',
						}}
					>
						Sök efter produkter mm.
					</span>
				</Group>
			</MobileRow>
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
