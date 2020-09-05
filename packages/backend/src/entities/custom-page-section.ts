import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base-entity';
import { CustomPage } from './custom-page';

@Entity()
export class CustomPageSection extends BaseEntity {
	@Column()
	type: string;

	@Column('uuid')
	componentId: string;

	@Column()
	position: number;

	@ManyToOne(() => CustomPage, page => page.sections)
	page: CustomPage;
}
