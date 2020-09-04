import { getRepository } from 'typeorm';

import { MegamenuModuleResolversType } from '..';
import { GQLResolversTypes } from '../../../__generated__/types';
import { Link } from '../../../entities/link';
import { MegamenuToplevelItem } from '../../../entities/megamenu-toplevel-item';

const transformLink = ({ type, to }: Link): GQLResolversTypes['Link'] => {
	switch (type) {
		case 'brand':
			return {
				__typename: 'BrandLink',
				brand: { id: to },
			};
		case 'category':
			return {
				__typename: 'CategoryLink',
				category: { id: to },
			};
		case 'product':
			return {
				__typename: 'ProductLink',
				product: { id: to },
			};
		case 'external':
		case 'custom':
			return {
				__typename: 'CustomPageLink',
				path: to,
			};
		default:
			throw new Error('Invalid link type: ' + type);
	}
};

const resolvers: MegamenuModuleResolversType = {
	Query: {
		megamenu: async () => {
			const toplevelItemRepo = getRepository(MegamenuToplevelItem);
			const toplevelItems = await toplevelItemRepo.find({
				relations: ['sections', 'sections.items'],
			});
			return toplevelItems.map(toplevelItem => {
				return {
					name: toplevelItem.name,
					link: transformLink(toplevelItem.link),
					sections: toplevelItem.sections.map(section => {
						return {
							name: section.name,
							items: section.items.map(item => {
								return {
									name: item.name,
									link: transformLink(item.link) as any,
								};
							}),
						};
					}),
				};
			});
		},
	},
};

export default resolvers;
