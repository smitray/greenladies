import {
	addAttributeToAttributeSet,
	createAttribute,
	createAttributeSet,
	createAttributeSetGroup,
} from './api/attribute';

export async function createGreenLadiesAttributeSet() {
	await createAttribute({
		type: 'dropdown',
		code: 'color',
		required: true,
		options: [
			'beige',
			'black',
			'blue',
			'brown',
			'darkgreen',
			'gold',
			'green',
			'grey',
			'multi',
			'orange',
			'pink',
			'purple',
			'red',
			'silver',
			'white',
			'yellow',
		],
	});
	await createAttribute({
		type: 'dropdown',
		code: 'mgs_brand',
		required: true,
		options: ['Alice Bizous', 'Lee', 'ESPRIT', 'Rosebud'],
	});
	await createAttribute({
		type: 'dropdown',
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
	await createAttribute({
		type: 'text',
		code: 'washing_description',
		required: false,
	});
	await createAttribute({
		type: 'text',
		code: 'material',
		required: false,
	});
	await createAttribute({
		type: 'dropdown',
		code: 'condition',
		options: ['new', 'vintage'],
		required: true,
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
	await addAttributeToAttributeSet({
		code: 'condition',
		setId,
		groupId,
	});
	await addAttributeToAttributeSet({
		code: 'washing_description',
		setId,
		groupId,
	});
	await addAttributeToAttributeSet({
		code: 'material',
		setId,
		groupId,
	});
	await addAttributeToAttributeSet({
		code: 'mgs_brand',
		setId,
		groupId,
	});
}
