import { Injectable, ProviderScope } from '@graphql-modules/di';
import { getRepository, Repository } from 'typeorm';

import { User } from '../../entities/user';

@Injectable({ scope: ProviderScope.Request })
export class UserProvider {
	private userRepository: Repository<User>;
	constructor() {
		this.userRepository = getRepository(User);
	}

	getUser({ id, username }: { id?: string | null; username?: string | null }) {
		if (id) {
			return this.getUserById(id);
		}

		if (username) {
			return this.getUserByUsername(username);
		}

		throw new Error('Must provider id or username');
	}

	async getUserById(id: string) {
		const user = await this.userRepository.findOne(id);
		if (!user) {
			throw new Error('User not found');
		}

		return user;
	}

	async getUserByUsername(username: string) {
		const user = await this.userRepository.findOne({ where: { username } });
		if (!user) {
			throw new Error('User not found');
		}

		return user;
	}
}
