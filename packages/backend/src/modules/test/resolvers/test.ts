import { TestModuleResolversType } from '..';

const resolvers: TestModuleResolversType = {
	Test: {
		name: ({ id }) => {
			return id + '-name';
		},
	},
};

export default resolvers;
