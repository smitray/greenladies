import { magentoAdminRequester } from './util';

export async function createAttributeSet({ name, skeletonId = 4 }: { name: string; skeletonId?: number }) {
	const { data } = await magentoAdminRequester.post<{ attribute_set_id: string }>(
		'/rest/default/V1/products/attribute-sets',
		{
			attributeSet: {
				attribute_set_name: name,
				sort_order: 0,
			},
			skeletonId,
		},
	);

	return data;
}

export async function createAttribute({
	code,
	required,
	options,
}: {
	code: string;
	required: boolean;
	options: string[];
}) {
	const { data } = await magentoAdminRequester.post('/rest/default/V1/products/attributes', {
		attribute: {
			attribute_code: code,
			entity_type_id: '4',
			is_required: required,
			scope: 'global',
			frontend_labels: null,
			frontend_input: 'select',
			default_frontend_label: code,
			options: options.map(option => ({ label: option })),
		},
	});

	return data;
}

export async function deleteAttribute(code: string) {
	const { data } = await magentoAdminRequester.delete('/rest/default/V1/products/attributes/' + code);

	return data;
}

export async function createAttributeSetGroup(attributeSetId: number, { name }: { name: string }) {
	const { data } = await magentoAdminRequester.put<{ attribute_group_id: string }>(
		`/rest/default/V1/products/attribute-sets/${attributeSetId}/groups`,
		{
			group: {
				attribute_group_name: name,
			},
		},
	);

	return data;
}

export async function addAttributeToAttributeSet({
	code,
	groupId,
	setId,
}: {
	code: string;
	groupId: string;
	setId: string;
}) {
	const { data } = await magentoAdminRequester.post<string>('/rest/default/V1/products/attribute-sets/attributes', {
		attributeCode: code,
		attributeGroupId: groupId,
		attributeSetId: setId,
		sortOrder: 0,
	});

	return data;
}
