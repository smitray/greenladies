import { AuthModuleResolversType } from '..';

const resolvers: AuthModuleResolversType = {
	Query: {
		viewer: () => ({}),
	},
};

export default resolvers;
