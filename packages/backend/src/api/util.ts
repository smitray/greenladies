import 'dotenv/config';

import axios from 'axios';

export const instance = axios.create({
	baseURL: 'http://magento2',
	timeout: 1000,
	headers: {
		Authorization: 'Bearer ' + process.env.MAGENTO_INTEGRATION_ACCESS_TOKEN,
	},
});
