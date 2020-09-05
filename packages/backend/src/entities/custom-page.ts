import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base-entity';
import { CustomPageSection } from './custom-page-section';

@Entity()
export class CustomPage extends BaseEntity {
	@Column({ unique: true })
	path: string;

	@OneToMany(() => CustomPageSection, section => section.page)
	sections: CustomPageSection[];
}
