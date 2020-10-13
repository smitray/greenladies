import React from 'react';

import { useRouter } from 'next/router';

import { useAuth } from '../contexts/auth-context';
import { MyNextPage } from '../lib/types';

const Home: MyNextPage = () => {
	const { isAuthenticated } = useAuth();

	const router = useRouter();

	// if (!isAuthenticated) {
	// 	router.replace('/login');
	// 	return null;
	// }

	return (
		<React.Fragment>
			<div style={{ textAlign: 'center', padding: '2em', color: 'grey' }}>Något gick fel med din order</div>
		</React.Fragment>
	);
};

export default Home;
