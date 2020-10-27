import React from 'react';

import { List } from '../shared/list';

import { ListItemImageText, ListItemImageWrapper, ListItemWithImage } from './EasyShoppingSection.styles';

export const EasyShoppingSectionView = () => {
	return (
		<List>
			<ListItemWithImage>
				<ListItemImageWrapper>
					<img src="/images/car.png" />
				</ListItemImageWrapper>
				<ListItemImageText>Klimatkompenserad frakt</ListItemImageText>
			</ListItemWithImage>
			<ListItemWithImage>
				<ListItemImageWrapper>
					<img src="/images/check.png" />
				</ListItemImageWrapper>
				<ListItemImageText>Snabb och fri frakt över 999kr</ListItemImageText>
			</ListItemWithImage>
			<ListItemWithImage>
				<ListItemImageWrapper>
					<img src="/images/tree.png" />
				</ListItemImageWrapper>
				<ListItemImageText>14 dagar öppet köp</ListItemImageText>
			</ListItemWithImage>
		</List>
	);
};
