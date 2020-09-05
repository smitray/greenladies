import { Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base-entity';
import { CustomPageTabComponentSection } from './custom-page-tab-component-section';

@Entity()
export class CustomPageTabComponent extends BaseEntity {
	@OneToMany(() => CustomPageTabComponentSection, section => section.tab)
	sections: CustomPageTabComponentSection[];
}
