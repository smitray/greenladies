import React from 'react';

import Link from 'next/link';

import {
	MegaMenuChunkList,
	MegaMenuChunkListItem,
	MegaMenuInnerList,
	MegaMenuInnerListItem,
	MegaMenuLink,
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
				const chunks = chunkArray(category.categories);

				return (
					<MegaMenuOuterListItem key={index} style={{ flexGrow: chunks.length }}>
						<MegaMenuTitle>
							<Link href={category.href || '#'}>
								<MegaMenuLink href={category.href || '#'}>{category.name}</MegaMenuLink>
							</Link>
						</MegaMenuTitle>
						<MegaMenuChunkList>
							{chunks.map((chunk, index) => (
								<MegaMenuChunkListItem key={index}>
									<MegaMenuInnerList>
										{chunk.map((category, index) => (
											<MegaMenuInnerListItem key={index}>
												<Link href={category.href || '#'}>
													<MegaMenuLink href={category.href || '#'}>{category.name}</MegaMenuLink>
												</Link>
											</MegaMenuInnerListItem>
										))}
									</MegaMenuInnerList>
								</MegaMenuChunkListItem>
							))}
						</MegaMenuChunkList>
					</MegaMenuOuterListItem>
				);
			})}
		</MegaMenuOuterList>
	);
};
