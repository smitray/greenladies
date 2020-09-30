import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from './base-entity';
import { Link } from './link';

@Entity()
export class CustomPageTripleImageComponent extends BaseEntity {
	@Column()
	smallTitle: string;

	@Column()
	bigTitle: string;

	@OneToOne(() => Link, { nullable: false, onDelete: 'CASCADE', eager: true })
	@JoinColumn()
	link: Link;

	@Column()
	firstImagePath: string;

	@Column()
	secondImagePath: string;

	@Column()
	thirdImagePath: string;

	@Column()
	color: string;
}
