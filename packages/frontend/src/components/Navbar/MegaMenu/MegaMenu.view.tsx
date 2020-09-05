import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { Link } from '../../Link';

import { MegaMenu_item } from './__generated__/MegaMenu_item.graphql';
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

function chunkArray<T>(array: readonly T[], chunkSize = 5): T[][] {
	const chunkedArray: T[][] = [];
	for (let i = 0, j = array.length; i < j; i += chunkSize) {
		chunkedArray.push(array.slice(i, i + chunkSize));
	}

	return chunkedArray;
}

interface MegaMenuViewProps {
	item: MegaMenu_item;
}

const MegaMenuView = ({ item }: MegaMenuViewProps) => {
	return (
		<MegaMenuOuterList>
			{item.sections.map((section, index) => {
				const chunks = chunkArray(section.items);

				return (
					<MegaMenuOuterListItem
						key={index}
						style={{ flexGrow: 0, flexShrink: 0, flexBasis: 25 * chunks.length + '%' }}
					>
						<MegaMenuTitle>
							<MegaMenuLink>{section.name}</MegaMenuLink>
						</MegaMenuTitle>
						<MegaMenuChunkList>
							{chunks.map((chunk, chunkIndex) => (
								<MegaMenuChunkListItem key={chunkIndex}>
									<MegaMenuInnerList>
										{chunk.map((item, itemIndex) => (
											<MegaMenuInnerListItem key={itemIndex}>
												<Link link={item.link}>
													<MegaMenuLink>{item.name}</MegaMenuLink>
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

export default createFragmentContainer(MegaMenuView, {
	item: graphql`
		fragment MegaMenu_item on MegamenuToplevelItem {
			sections {
				name
				items {
					name
					link {
						...Link_link
					}
				}
			}
		}
	`,
});
