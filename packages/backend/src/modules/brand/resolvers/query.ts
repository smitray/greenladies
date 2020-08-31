import { BrandModuleResolversType } from '..';
import { BrandProvider } from '../brand.provider';

const resolvers: BrandModuleResolversType = {
	Query: {
		brands: async (_parent, _args, { injector }) => {
			const result = await injector.get(BrandProvider).getBrands();
			console.log(result);
			return result;
		},
	},
};

export default resolvers;
