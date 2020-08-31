import React, { useEffect, useState } from 'react';

import { PhotoSwipe } from 'react-photoswipe';
import { createFragmentContainer, graphql } from 'react-relay';

import { ProductImageGallery_product } from './__generated__/ProductImageGallery_product.graphql';

interface ProductImageGalleryViewProps {
	product: ProductImageGallery_product;
}

const ProductImageGalleryView = ({ product }: ProductImageGalleryViewProps) => {
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
							setCurrentImageIndex(index);
							setGalleryIsOpen(true);
						}}
					/>
				))}
			</div>
			<div style={{ flexBasis: '86%' }}>
				<img
					src={selectedImage.src}
					alt=""
					style={{ width: '100%', cursor: 'pointer' }}
					onClick={() => {
						setCurrentImageIndex(selectedImage.index);
						setGalleryIsOpen(true);
					}}
				/>
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

export default createFragmentContainer(ProductImageGalleryView, {
	product: graphql`
		fragment ProductImageGallery_product on Product {
			image
			images
		}
	`,
});
