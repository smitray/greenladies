import { AuthModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';

const resolvers: AuthModuleResolversType = {
	Viewer: {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		id: (_parent, _args, { request }) => toGlobalId('Viewer', request.session!.id),
		user: (_parent, _args, { request }) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const userId = request.session!.auth?.userId;
			if (!userId) {
				return null;
			}

			return { id: userId };
		},
	},
};

export default resolvers;
