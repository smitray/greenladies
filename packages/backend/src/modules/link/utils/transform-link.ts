import { GQLResolversTypes } from '../../../__generated__/types';
import { Link } from '../../../entities/link';

export function transformLink({ type, to }: Link): GQLResolversTypes['Link'] {
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
		case 'special-category':
			return {
				__typename: 'SpecialCategoryLink',
				category: { id: to },
			};
		case 'product':
			return {
				__typename: 'ProductLink',
				product: { id: to },
			};
		case 'custom':
			return {
				__typename: 'CustomPageLink',
				path: to,
			};
		default:
			throw new Error('Invalid link type: ' + type);
	}
}
