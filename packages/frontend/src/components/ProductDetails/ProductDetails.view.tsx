import React, { useState } from 'react';

import { Collapse } from 'react-collapse';
import ReactMarkdown from 'react-markdown';
import { createFragmentContainer, graphql } from 'react-relay';

import { ProductDetails_product } from './__generated__/ProductDetails_product.graphql';

interface ProductDetailsViewProps {
	product: ProductDetails_product;
}

const ProductDetailsView = ({ product }: ProductDetailsViewProps) => {
	const [open, setOpen] = useState(false);

	const discount = Math.round((product.originalPrice - product.specialPrice) / product.originalPrice);
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
			<div onClick={() => setOpen(open => !open)}>Beskrivning</div>
			<Collapse isOpened={open}>
				<ReactMarkdown source={product.fullDescription} />
			</Collapse>
			<div onClick={() => setOpen(open => !open)}>Material och skötsel</div>
			<Collapse isOpened={open}>
				<h2>Material</h2>
				<ReactMarkdown source={product.fullDescription} />
				<h2>Skötselråd</h2>
				<ReactMarkdown source={product.washingDescription} />
			</Collapse>
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
