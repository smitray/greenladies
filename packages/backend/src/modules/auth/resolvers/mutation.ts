import bcrypt from 'bcrypt';

import { AuthModuleResolversType } from '..';
import { UserProvider } from '../../user/user.provider';

const resolvers: AuthModuleResolversType = {
	Mutation: {
		login: async (_parent, { input }, { injector, request }) => {
			const user = await injector.get(UserProvider).getUserByUsername(input.username);

			if (!(await bcrypt.compare(input.password, user.password))) {
				throw new Error('Incorrect password');
			}

			if (request.session) {
				request.session.auth = {
					userId: user.id,
				};
			}

			return { user: { id: user.id } };
		},
		logout: (_parent, _args, { request }) => {
			if (request.session) {
				request.session.auth = undefined;
			}

			return { success: true };
		},
	},
};

export default resolvers;
