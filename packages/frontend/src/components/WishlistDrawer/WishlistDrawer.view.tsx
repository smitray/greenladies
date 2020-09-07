import React, { useState } from 'react';

import Link from 'next/link';
import Drawer from 'rc-drawer';
import { FaRegTrashAlt, FaTimes } from 'react-icons/fa';
import { createFragmentContainer, graphql } from 'react-relay';

import { useRemoveFromWishlistMutation } from '../../mutations/wishlist';

import { WishlistDrawer_wishlist } from './__generated__/WishlistDrawer_wishlist.graphql';

interface WishlistDrawerViewProps {
	wishlist: WishlistDrawer_wishlist;
	open: boolean;
	onCloseRequest: () => void;
}

const WishlistDrawerView = ({ wishlist, open, onCloseRequest }: WishlistDrawerViewProps) => {
	const { commit: removeFromWishlist } = useRemoveFromWishlistMutation();
	const [isEditingState, setIsEditingState] = useState(false);

	const requestClose = () => {
		onCloseRequest();
		setIsEditingState(false);
	};

	return (
		<Drawer level={null} open={open} placement="right" handler={false} width={500} onClose={requestClose}>
			<div style={{ padding: '24px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
					<button
						style={{ padding: '8px', border: 'none', outline: 'none', background: 'none', cursor: 'pointer' }}
						onClick={() => requestClose()}
					>
						<div style={{ width: '24px', height: '24px' }}>
							<FaTimes size="24" />
						</div>
					</button>
					<div>
						<button
							style={{
								border: '2px solid black',
								background: 'white',
								fontSize: '16px',
								fontWeight: 'bold',
								padding: '12px 16px',
								cursor: 'pointer',
								borderRadius: '0',
								outline: 'none',
							}}
							onClick={() => setIsEditingState(isEditingState => !isEditingState)}
						>
							{isEditingState ? 'KLAR' : 'ÄNDRA LISTA'}
						</button>
					</div>
				</div>
				{wishlist.products.totalCount === 0 && (
					<div
						style={{
							color: 'grey',
							marginTop: '64px',
							textAlign: 'center',
						}}
					>
						Du har inga produkter i din önskelista
					</div>
				)}
				{wishlist.products.edges.length > 0 && (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '16px',
						}}
					>
						{wishlist.products.edges.map(({ node: product }) => (
							<Link key={product.id} href="/products/[key]" as={`/products/${product.urlKey}`}>
								<a style={{ display: 'block', textDecoration: 'none', color: 'black' }} onClick={() => requestClose()}>
									<div>
										<div
											style={{
												display: 'block',
												position: 'relative',
												background: '#f6f6f6',
												width: '100%',
												paddingTop: '131.4%',
												marginBottom: '8px',
											}}
										>
											{isEditingState && (
												<button
													style={{
														position: 'absolute',
														top: '8px',
														right: '8px',
														padding: '6px',
														border: 'none',
														background: 'none',
														outline: 'none',
														cursor: 'pointer',
														zIndex: 10,
													}}
													onClick={() => removeFromWishlist(product.id)}
												>
													<div style={{ width: '16px', height: '16px' }}>
														<FaRegTrashAlt size="16" />
													</div>
												</button>
											)}
											<div
												style={{
													position: 'absolute',
													top: '0',
													right: '0',
													bottom: '0',
													left: '0',
												}}
											>
												<img
													src={product.image}
													alt=""
													style={{
														width: '100%',
														height: '100%',
													}}
												/>
											</div>
										</div>
										<div style={{ fontSize: '16px', textAlign: 'center' }}>{product.name}</div>
										<div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', color: 'red' }}>
											{product.specialPrice} kr
										</div>
									</div>
								</a>
							</Link>
						))}
					</div>
				)}
			</div>
		</Drawer>
	);
};

export default createFragmentContainer(WishlistDrawerView, {
	wishlist: graphql`
		fragment WishlistDrawer_wishlist on Wishlist {
			products(first: 10000) @connection(key: "Wishlist_products") {
				edges {
					node {
						id
						name
						urlKey
						specialPrice
						image
					}
				}
				totalCount
			}
		}
	`,
});
