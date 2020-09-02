import { BrandModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { BrandProvider } from '../brand.provider';

const resolvers: BrandModuleResolversType = {
	Brand: {
		id: ({ id }) => toGlobalId('Brand', id),
		name: async ({ id }, _args, { injector }) => {
			const brand = await injector.get(BrandProvider).getBrand({ id });

			return brand.name;
		},
	},
};

export default resolvers;
