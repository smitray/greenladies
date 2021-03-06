import React, { useEffect, useState } from 'react';

import { PhotoSwipe } from 'react-photoswipe';
import { createFragmentContainer, graphql } from 'react-relay';

import { ProductImageGalleryDesktop_product } from './__generated__/ProductImageGalleryDesktop_product.graphql';

interface ProductImageGalleryDesktopViewProps {
	product: ProductImageGalleryDesktop_product;
}

const ProductImageGalleryDesktopView = ({ product }: ProductImageGalleryDesktopViewProps) => {
	const [selectedImage, setSelectedImage] = useState<{ index: number; src: string }>({ index: 0, src: product.image });
	const [galleryIsOpen, setGalleryIsOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	useEffect(() => {
		setSelectedImage({ index: 0, src: product.image });
	}, [product]);

	return (
		<div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
			<div
				style={{
					flexBasis: '12%',
					marginRight: '2%',
					flexDirection: 'column',
					justifyContent: 'center',
					overflow: 'auto',
				}}
			>
				{product.images.slice(0, 6).map((src, index) => (
					<img
						src={src}
						alt=""
						key={src}
						style={{
							width: '100%',
							borderBottom: src === selectedImage.src ? '4px solid black' : '4px solid white',
							cursor: 'pointer',
						}}
						onMouseEnter={() => setSelectedImage({ index, src })}
						onClick={() => {
							if (currentImageIndex === index) {
								setGalleryIsOpen(true);
							}
							setCurrentImageIndex(index);
						}}
					/>
				))}
			</div>
			<div style={{ flexBasis: '86%', position: 'relative' }}>
				<img
					src={selectedImage.src}
					alt=""
					style={{ width: '100%', cursor: 'pointer' }}
					onClick={() => {
						setCurrentImageIndex(selectedImage.index);
						setGalleryIsOpen(true);
					}}
				/>
				<div
					style={{
						position: 'absolute',
						background: 'white',
						color: 'green',
						fontSize: '14px',
						fontWeight: 'bold',
						top: '8px',
						padding: '2px 4px',
						left: '0',
					}}
				>
					{product.condition === 'new' ? 'NY' : 'VINTAGE'}
				</div>
			</div>
			<PhotoSwipe
				isOpen={galleryIsOpen}
				items={product.images.map(src => ({
					w: 830,
					h: 1200,
					src,
					thumbnail: src,
				}))}
				options={
					{
						arrowKeys: true,
						loop: true,
						index: currentImageIndex,
						shareEl: false,
						captionEl: false,
					} as any
				}
				onClose={() => setGalleryIsOpen(false)}
			/>
		</div>
	);
};

export default createFragmentContainer(ProductImageGalleryDesktopView, {
	product: graphql`
		fragment ProductImageGalleryDesktop_product on Product {
			image
			images
			condition
		}
	`,
});
