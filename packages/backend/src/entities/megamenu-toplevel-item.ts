import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from './base-entity';
import { Link } from './link';
import { MegamenuSection } from './megamenu-section';

@Entity()
export class MegamenuToplevelItem extends BaseEntity {
	@Column()
	name: string;

	@Column()
	position: number;

	@OneToOne(() => Link, { nullable: false, onDelete: 'CASCADE', eager: true })
	@JoinColumn()
	link: Link;

	@OneToMany(() => MegamenuSection, sectionItem => sectionItem.parent, { onDelete: 'CASCADE' })
	sections: MegamenuSection[];

	// banner
}
