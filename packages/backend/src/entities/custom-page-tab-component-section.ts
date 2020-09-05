import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base-entity';
import { CustomPageTabComponent } from './custom-page-tab-component';

@Entity()
export class CustomPageTabComponentSection extends BaseEntity {
	@Column()
	key: string;

	@Column()
	title: string;

	@Column('text')
	body: string;

	@Column()
	position: number;

	@ManyToOne(() => CustomPageTabComponent, tab => tab.sections)
	tab: CustomPageTabComponent;
}
