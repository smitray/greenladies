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
			'W27 L30',
			'W27 L31',
			'W28 L28',
			'W28 L30',
			'W29 L30',
			'W29 L32',
			'W30 L30',
			'W30 L32',
			'W30 L33',
			'W31 L28',
			'W31 L30',
			'W31 L31',
			'W31 L32',
			'W31 L33',
			'W32 L30',
			'W32 L33',
			'W33 L32',
			'W33 L33',
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
