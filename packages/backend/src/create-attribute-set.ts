import {
	addAttributeToAttributeSet,
	createAttribute,
	createAttributeSet,
	createAttributeSetGroup,
} from './api/attribute';

export async function createGreenLadiesAttributeSet() {
	await createAttribute({
		code: 'color',
		required: true,
		options: ['black', 'blue'],
	});
	await createAttribute({
		code: 'size',
		required: false,
		options: [
			'34',
			'36',
			'38',
			'40',
			'42',
			'44',
			'46',
			'W27L30',
			'W28L30',
			'W29L30',
			'W29L32',
			'W30L30',
			'W30L32',
			'W31L30',
			'W31L32',
			'W32L30',
			'W33L32',
		],
	});
	const { attribute_set_id: setId } = await createAttributeSet({ name: 'Green Ladies' });
	const { attribute_group_id: groupId } = await createAttributeSetGroup(parseInt(setId, 10), { name: 'Attributes' });
	await addAttributeToAttributeSet({
		code: 'color',
		setId,
		groupId,
	});
	await addAttributeToAttributeSet({
		code: 'size',
		setId,
		groupId,
	});
}
