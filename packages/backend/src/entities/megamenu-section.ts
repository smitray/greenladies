import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from './base-entity';
import { MegamenuSectionItem } from './megamenu-section-item';
import { MegamenuToplevelItem } from './megamenu-toplevel-item';

@Entity()
export class MegamenuSection extends BaseEntity {
	@Column()
	name: string;

	@Column()
	position: number;

	@OneToMany(() => MegamenuSectionItem, sectionItem => sectionItem.section, { onDelete: 'CASCADE' })
	items: MegamenuSectionItem[];

	@ManyToOne(() => MegamenuToplevelItem, toplevelItem => toplevelItem.sections)
	parent: MegamenuSectionItem;
}
