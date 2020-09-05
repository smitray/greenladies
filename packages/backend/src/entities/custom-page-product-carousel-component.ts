import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base-entity';

@Entity()
export class CustomPageProductCarouselComponent extends BaseEntity {
	@Column()
	title: string;

	@Column()
	subtitle: string;

	@Column()
	categoryId: string;
}
