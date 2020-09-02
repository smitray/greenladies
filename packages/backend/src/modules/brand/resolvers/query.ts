import { BrandModuleResolversType } from '..';
import { BrandProvider } from '../brand.provider';

const resolvers: BrandModuleResolversType = {
	Query: {
		brands: async (_parent, _args, { injector }) => {
			const brands = await injector.get(BrandProvider).getBrands();
			return brands;
		},
		brand: async (_parent, { where }, { injector }) => {
			return injector.get(BrandProvider).getBrand(where);
		},
	},
};

export default resolvers;
