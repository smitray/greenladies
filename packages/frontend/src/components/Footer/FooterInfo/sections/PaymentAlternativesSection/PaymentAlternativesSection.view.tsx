import React from 'react';

import { ImageList, ImageListItem } from '../shared/image-list';

export const PaymentAlternativesSectionView = () => {
	return (
		<ImageList>
			<ImageListItem>
				<img src="/images/klarna.jpg" />
			</ImageListItem>
			<ImageListItem>
				<img src="/images/visa.png" />
			</ImageListItem>
			<ImageListItem>
				<img src="/images/mastercard.png" />
			</ImageListItem>
			<ImageListItem>
				<img src="/images/amex.png" />
			</ImageListItem>
			<ImageListItem>
				<img src="/images/faktura.png" />
			</ImageListItem>
		</ImageList>
	);
};
