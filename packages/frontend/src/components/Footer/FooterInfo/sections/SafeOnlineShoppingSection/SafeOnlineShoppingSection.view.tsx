import React from 'react';

import { ImageList, ImageListItem } from '../shared/image-list';

export const SafeOnlineShoppingSectionView = () => {
	return (
		<ImageList>
			<ImageListItem>
				<img src="/images/verified-by-visa.jpg" />
			</ImageListItem>
			<ImageListItem>
				<img src="/images/mastercard-securecode.png" />
			</ImageListItem>
		</ImageList>
	);
};
