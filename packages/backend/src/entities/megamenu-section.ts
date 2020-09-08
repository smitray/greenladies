import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from './base-entity';
import { Link } from './link';
import { MegamenuSectionItem } from './megamenu-section-item';
import { MegamenuToplevelItem } from './megamenu-toplevel-item';

@Entity()
export class MegamenuSection extends BaseEntity {
	@Column()
	name: string;

	@Column()
	position: number;

	@OneToOne(() => Link, { onDelete: 'CASCADE', eager: true })
	link: Link | null;

	@OneToMany(() => MegamenuSectionItem, sectionItem => sectionItem.section, { onDelete: 'CASCADE' })
	items: MegamenuSectionItem[];

	@ManyToOne(() => MegamenuToplevelItem, toplevelItem => toplevelItem.sections)
	parent: MegamenuSectionItem;
}
