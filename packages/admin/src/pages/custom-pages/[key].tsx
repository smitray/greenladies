import React from 'react';

import { Typography } from 'antd';
import { useRouter } from 'next/router';

import { Template } from '../../components/Template';
import { useAuth } from '../../contexts/auth-context';
import { MyNextPage } from '../../lib/types';

const EditCustomPage: MyNextPage = () => {
	const { isAuthenticated } = useAuth();

	const router = useRouter();

	if (!isAuthenticated) {
		typeof window !== 'undefined' && router.replace('/login');
		return null;
	}

	return (
		<Template>
			<Typography.Title>Ändra sida</Typography.Title>
		</Template>
	);
};

export default EditCustomPage;
