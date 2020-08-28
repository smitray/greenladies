import axios from 'axios';

export const magentoAdminRequester = axios.create({
	baseURL: 'http://magento2',
	timeout: 10000,
	headers: {
		Authorization: 'Bearer ' + process.env.MAGENTO_INTEGRATION_ACCESS_TOKEN,
	},
});

export const magentoGuestRequester = axios.create({
	baseURL: 'http://magento2',
	timeout: 10000,
});
