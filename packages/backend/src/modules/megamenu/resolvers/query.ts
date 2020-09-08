import { getRepository } from 'typeorm';

import { MegamenuModuleResolversType } from '..';
import { MegamenuToplevelItem } from '../../../entities/megamenu-toplevel-item';
import { transformLink } from '../../link/utils/transform-link';

const resolvers: MegamenuModuleResolversType = {
	Query: {
		megamenu: async () => {
			const toplevelItemRepo = getRepository(MegamenuToplevelItem);
			const toplevelItems = await toplevelItemRepo.find({
				relations: ['sections', 'sections.items'],
			});
			return {
				items: toplevelItems
					.sort((left, right) => left.position - right.position)
					.map(toplevelItem => {
						return {
							name: toplevelItem.name,
							link: transformLink(toplevelItem.link) as any,
							sections: toplevelItem.sections
								.sort((left, right) => left.position - right.position)
								.map(section => {
									return {
										name: section.name,
										link: section.link !== null ? (transformLink(section.link) as any) : null,
										items: section.items
											.sort((left, right) => left.position - right.position)
											.map(item => {
												return {
													name: item.name,
													link: transformLink(item.link) as any,
												};
											}),
									};
								}),
						};
					}),
			};
		},
	},
};

export default resolvers;
