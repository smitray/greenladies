import bcrypt from 'bcrypt';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { BaseEntity } from './base-entity';

@Entity()
export class User extends BaseEntity {
	@Column()
	username: string;

	@Column()
	password: string;

	private tempPassword: string | null;

	@AfterLoad()
	// eslint-disable-next-line
	// @ts-ignore
	private loadTempPassword() {
		this.tempPassword = this.password;
	}

	@BeforeInsert()
	@BeforeUpdate()
	// eslint-disable-next-line
	// @ts-ignore
	private async encryptPassword() {
		if (this.password && this.tempPassword !== this.password) {
			this.password = await bcrypt.hash(this.password, 12);
		}
	}
}
