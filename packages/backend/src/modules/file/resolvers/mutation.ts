import { FileModuleResolversType } from '..';

const resolvers: FileModuleResolversType = {
	Mutation: {
		uploadImage: (_parent, { file }) => {
			return {
				success: true,
			};
		},
	},
};

export default resolvers;
