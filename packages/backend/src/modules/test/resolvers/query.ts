import { TestModuleResolversType } from '..';

const resolvers: TestModuleResolversType = {
	Query: {
		test: () => {
			return {
				id: 'testid',
			};
		},
		test2: () => 'hahaa',
	},
};

export default resolvers;
