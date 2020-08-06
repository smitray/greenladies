import React from 'react';

import {
	MegaMenuInnerList,
	MegaMenuInnerListItem,
	MegaMenuOuterList,
	MegaMenuOuterListItem,
	MegaMenuTitle,
} from './MegaMenu.styles';

// interface PromoBanner {
// 	image: string | null;
// 	title: string;
// 	subtitle: string;
// }

interface Category {
	name: string;
	href: string | null;
	categories: Category[];
}

function chunkArray<T>(array: T[], chunkSize = 5): T[][] {
	const chunkedArray: T[][] = [];
	for (let i = 0, j = array.length; i < j; i += chunkSize) {
		chunkedArray.push(array.slice(i, i + chunkSize));
	}

	return chunkedArray;
}

interface MegaMenuViewProps {
	category: Category;
	// promoBanner: PromoBanner;
}

export const MegaMenuView = ({ category }: MegaMenuViewProps) => {
	return (
		<MegaMenuOuterList>
			{category.categories.map((category, index) => {
				return (
					<MegaMenuOuterListItem key={index}>
						<MegaMenuTitle style={{ fontSize: '30px' }}>{category.name}</MegaMenuTitle>
						{chunkArray(category.categories).map((chunk, index) => (
							<MegaMenuInnerList key={index}>
								{chunk.map((category, index) => (
									<MegaMenuInnerListItem key={index}>{category.name}</MegaMenuInnerListItem>
								))}
							</MegaMenuInnerList>
						))}
					</MegaMenuOuterListItem>
				);
			})}
		</MegaMenuOuterList>
	);
};
