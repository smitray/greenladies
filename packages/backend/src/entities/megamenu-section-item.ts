import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from './base-entity';
import { Link } from './link';
import { MegamenuSection } from './megamenu-section';

@Entity()
export class MegamenuSectionItem extends BaseEntity {
	@Column()
	name: string;

	@Column()
	position: number;

	@OneToOne(() => Link, { nullable: false, onDelete: 'CASCADE', eager: true })
	@JoinColumn()
	link: Link;

	@ManyToOne(() => MegamenuSection, section => section.items)
	section: MegamenuSection;
}
