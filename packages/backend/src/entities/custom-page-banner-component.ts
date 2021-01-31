import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from './base-entity';
import { Link } from './link';

@Entity()
export class CustomPageBannerComponent extends BaseEntity {
	@Column()
	title: string;

	@Column()
	subtitle: string;

	@OneToOne(() => Link, { nullable: false, onDelete: 'CASCADE', eager: true })
	@JoinColumn()
	link: Link;

	@Column()
	imagePath: string;

	@Column()
	mobileImagePath: string;

	@Column()
	textColor: string;
}
