import { UserModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { UserProvider } from '../user.provider';

const resolvers: UserModuleResolversType = {
	User: {
		id: ({ id }) => toGlobalId('User', id),
		username: async ({ id }, _args, { injector }) => {
			const user = await injector.get(UserProvider).getUserById(id);

			return user.username;
		},
	},
};

export default resolvers;
