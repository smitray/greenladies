import { FileModuleResolversType } from '..';

const resolvers: FileModuleResolversType = {
	Query: {
		images: () => {
			return [];
		},
	},
};

export default resolvers;
