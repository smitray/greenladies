import React, { useState } from 'react';

import { Collapse } from 'react-collapse';
import { FaAngleDown, FaAngleUp, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { ProductDetails_product } from './__generated__/ProductDetails_product.graphql';

const CollapseTitle = styled.div`
	border-top: 1px solid #ddd;
	padding: 24px 8px;
	display: flex;
	justify-content: space-between;
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

	const discount = Math.round(((product.originalPrice - product.specialPrice) / product.originalPrice) * 100);

	return (
		<React.Fragment>
			<div style={{ marginBottom: '8px' }}>
				<span style={{ fontWeight: 'bold', borderBottom: '2px solid black' }}>{product.brand}</span>
			</div>
			<h1 style={{ fontSize: '28px', margin: '0', marginBottom: '8px' }}>{product.name}</h1>
			<div style={{ color: 'red', marginBottom: '4px' }}>{discount}% rabatt</div>
			<div>
				<span style={{ color: 'red' }}>{product.specialPrice.toFixed(2).replace('.', ',')} kr</span>
				<span style={{ marginLeft: '8px', color: 'grey', textDecoration: 'line-through' }}>
					{product.originalPrice.toFixed(2).replace('.', ',')} kr
				</span>
			</div>
			<div>
				<select>
					{product.virtualProducts.map(virtualProduct => (
						<option key={virtualProduct.id}>{virtualProduct.size}</option>
					))}
				</select>
			</div>
			<div>
				<button>Handla</button>
				<button>Heart</button>
			</div>
			<CollapseTitle onClick={() => setDescriptionOpen(open => !open)}>
				<div>Beskrivning</div>
				{descriptionOpen ? <FaAngleUp /> : <FaAngleDown />}
			</CollapseTitle>
			<Collapse isOpened={descriptionOpen}>
				<CollapseContentWrapper>
					<ReactMarkdown source={product.fullDescription} />
				</CollapseContentWrapper>
			</Collapse>
			<CollapseTitle onClick={() => setMaterialOpen(open => !open)}>
				<div>Material och skötsel</div>
				{materialOpen ? <FaAngleUp /> : <FaAngleDown />}
			</CollapseTitle>
			<Collapse isOpened={materialOpen}>
				<CollapseContentWrapper>
					<h2>Material</h2>
					<ReactMarkdown source={product.fullDescription} />
					<h2>Skötselråd</h2>
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
			name
			brand
			originalPrice
			specialPrice
			fullDescription
			washingDescription
			virtualProducts {
				id
				size
				quantity
			}
		}
	`,
});
