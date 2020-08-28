import React, { useRef, useState } from 'react';

import { Collapse } from 'react-collapse';
import { BiShoppingBag } from 'react-icons/bi';
import { FaAngleDown, FaAngleUp, FaHeart, FaRegHeart } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { useClickOutside } from '../../hooks/use-click-outside';
import { useAddToCartMutation } from '../../mutations/shopping-cart';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../../mutations/wishlist';

import { ProductDetails_product } from './__generated__/ProductDetails_product.graphql';

const CollapseTitle = styled.div`
	border-top: 1px solid #ddd;
	padding: 24px 8px;
	display: flex;
	justify-content: space-between;
	cursor: pointer;
`;

const CollapseContentWrapper = styled.div`
	padding: 8px;
`;

interface ProductDetailsViewProps {
	product: ProductDetails_product;
}

const ProductDetailsView = ({ product }: ProductDetailsViewProps) => {
	const [descriptionOpen, setDescriptionOpen] = useState(false);
	const [materialOpen, setMaterialOpen] = useState(false);
	const [selectSizeOpen, setSelectSizeOpen] = useState(false);

	const [selectedConfiguration, setSelectedConfiguration] = useState<
		ProductDetails_product['virtualProducts'][0] | null
	>(null);

	const { commit: addToWishlist, pending: addingToWishlist } = useAddToWishlistMutation();
	const { commit: removeFromWishlist, pending: removingFromWishlist } = useRemoveFromWishlistMutation();
	const { commit: addToCart, pending: addingToCart } = useAddToCartMutation();

	const [selectSizeButtonFocus, setSelectSizeButtonFocus] = useState(false);
	const sizeDropdownRef = useRef<HTMLDivElement>(null);
	useClickOutside(sizeDropdownRef, () => {
		if (!selectSizeButtonFocus) {
			setSelectSizeOpen(false);
		}
	});

	const discount = Math.round(((product.originalPrice - product.specialPrice) / product.originalPrice) * 100);

	return (
		<React.Fragment>
			<div style={{ marginBottom: '8px' }}>
				<span style={{ fontWeight: 'bold', borderBottom: '2px solid black' }}>{product.brand}</span>
			</div>
			<h1 style={{ fontSize: '28px', margin: '0', marginBottom: '8px' }}>{product.name}</h1>
			<div style={{ color: 'red', marginBottom: '4px' }}>{discount}% rabatt</div>
			<div style={{ marginBottom: '16px' }}>
				<span style={{ color: 'red' }}>{product.specialPrice.toFixed(2).replace('.', ',')} kr</span>
				<span style={{ marginLeft: '8px', color: 'grey', textDecoration: 'line-through' }}>
					{product.originalPrice.toFixed(2).replace('.', ',')} kr
				</span>
			</div>
			<div style={{ marginBottom: '16px' }}>
				<button
					style={{
						width: '100%',
						background: 'white',
						position: 'relative',
						cursor: 'pointer',
						padding: '0',
						border: 'none',
						outline: 'none',
					}}
					onClick={() => setSelectSizeOpen(open => !open)}
				>
					<div
						style={{
							padding: '16px',
							display: 'flex',
							justifyContent: 'space-between',
							border: '2px solid black',
							borderRadius: '5px',
						}}
						onMouseEnter={() => setSelectSizeButtonFocus(true)}
						onMouseLeave={() => setSelectSizeButtonFocus(false)}
					>
						{selectedConfiguration !== null ? (
							<div>
								<span style={{ fontSize: '16px', fontWeight: 'bold' }}>{selectedConfiguration.size}</span>
								{selectedConfiguration.quantity > 0 && selectedConfiguration.quantity < 3 && (
									<span style={{ fontSize: '16px', color: 'red', marginLeft: '8px' }}>
										(Bara {selectedConfiguration.quantity} kvar)
									</span>
								)}
							</div>
						) : (
							<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Välj storlek</span>
						)}
						<div style={{ height: '16px', width: '16px' }}>
							{selectSizeOpen ? <FaAngleUp size="16" /> : <FaAngleDown size="16" />}
						</div>
					</div>
					{selectSizeOpen && (
						<div
							ref={sizeDropdownRef}
							onClick={e => e.stopPropagation()}
							style={{
								maxHeight: '500',
								background: 'white',
								borderRadius: '5px',
								boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
								position: 'absolute',
								width: '100%',
								marginTop: '8px',
								overflowY: 'auto',
								border: '1px solid rgba(0, 0, 0, 0.1)',
							}}
						>
							<ul style={{ padding: '8px 0', margin: '0' }}>
								{product.virtualProducts.map(virtualProduct => {
									const isSelected = virtualProduct.id === selectedConfiguration?.id;
									const soldOut = virtualProduct.quantity === 0;

									return (
										<li
											key={virtualProduct.id}
											style={{
												padding: '16px',
												display: 'flex',
												justifyContent: 'space-between',
												background: isSelected ? '#f5f5f5' : 'white',
												textAlign: 'left',
												fontSize: '15px',
												cursor: soldOut ? 'not-allowed' : 'pointer',
											}}
											onClick={() => {
												setSelectedConfiguration(virtualProduct);
												setSelectSizeOpen(false);
											}}
										>
											<span
												style={{
													fontWeight: 'bold',
													flexGrow: 1,
													color: soldOut ? '#ccc' : 'black',
												}}
											>
												{virtualProduct.size}
											</span>
											{virtualProduct.quantity > 0 && virtualProduct.quantity < 3 && (
												<span style={{ marginLeft: '24px', color: 'red' }}>Bara {virtualProduct.quantity} kvar</span>
											)}
											{!soldOut && (
												<span style={{ marginLeft: '24px', color: 'red' }}>
													{virtualProduct.specialPrice.toFixed(2)} kr
												</span>
											)}
											{soldOut && <span style={{ marginLeft: '24px', color: '#ccc' }}>Slutsåld</span>}
										</li>
									);
								})}
							</ul>
						</div>
					)}
				</button>
			</div>
			<div style={{ marginBottom: '16px', display: 'flex' }}>
				<button
					style={{
						padding: '16px',
						border: '2px solid black',
						background: 'black',
						borderRadius: '5px',
						flexGrow: 1,
						display: 'flex',
						justifyContent: 'space-between',
						cursor: 'pointer',
					}}
					disabled={addingToCart}
					onClick={() => {
						if (selectedConfiguration === null) {
							setSelectSizeOpen(true);
						} else {
							addToCart(selectedConfiguration.id);
						}
					}}
				>
					<span
						style={{
							fontSize: '16px',
							fontWeight: 'bold',
							color: 'white',
						}}
					>
						Handla
					</span>
					<div style={{ height: '16px', width: '16px' }}>
						<BiShoppingBag size="16" color="white" />
					</div>
				</button>
				<button
					style={{
						padding: '16px',
						border: '2px solid black',
						background: 'white',
						borderRadius: '5px',
						marginLeft: '16px',
						cursor: 'pointer',
					}}
					onClick={() => {
						if (!(addingToWishlist || removingFromWishlist)) {
							if (product.inWishlist) {
								removeFromWishlist(product.id);
							} else {
								addToWishlist(product.id);
							}
						}
					}}
				>
					<div style={{ height: '16px', width: '16px' }}>
						{product.inWishlist ? <FaHeart size="16" color="red" /> : <FaRegHeart size="16" />}
					</div>
				</button>
			</div>
			<CollapseTitle onClick={() => setDescriptionOpen(open => !open)}>
				<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Beskrivning</span>
				<div style={{ width: '16px', height: '16px', marginTop: '2px' }}>
					{descriptionOpen ? <FaAngleUp size="16" /> : <FaAngleDown size="16" />}
				</div>
			</CollapseTitle>
			<Collapse isOpened={descriptionOpen}>
				<CollapseContentWrapper>
					<ReactMarkdown source={product.fullDescription} />
				</CollapseContentWrapper>
			</Collapse>
			<CollapseTitle onClick={() => setMaterialOpen(open => !open)}>
				<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Material och skötsel</span>
				<div style={{ width: '16px', height: '16px', marginTop: '2px' }}>
					{materialOpen ? <FaAngleUp size="16" /> : <FaAngleDown size="16" />}
				</div>
			</CollapseTitle>
			<Collapse isOpened={materialOpen}>
				<CollapseContentWrapper>
					<h3 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '0' }}>Material</h3>
					<ReactMarkdown source={product.fullDescription} />
					<h3 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '0' }}>Skötselråd</h3>
					<ReactMarkdown source={product.washingDescription} />
				</CollapseContentWrapper>
			</Collapse>
			<div style={{ borderTop: '1px solid #ddd' }}></div>
		</React.Fragment>
	);
};

export default createFragmentContainer(ProductDetailsView, {
	product: graphql`
		fragment ProductDetails_product on Product {
			id
			name
			brand
			originalPrice
			specialPrice
			fullDescription
			washingDescription
			inWishlist
			virtualProducts {
				id
				size
				quantity
				specialPrice
			}
		}
	`,
});
