import { TestModuleResolversType } from '..';

const resolvers: TestModuleResolversType = {
	Query: {
		test: () => {
			return {
				id: 'testid',
			};
		},
	},
};

export default resolvers;
