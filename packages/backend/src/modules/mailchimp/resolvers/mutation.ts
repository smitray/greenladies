import axios from 'axios';

import { MailchimpModuleResolversType } from '..';
import { base64 } from '../../../utils/base64';

const resolvers: MailchimpModuleResolversType = {
	Mutation: {
		addEmailToSubscriberList: async (_parent, { input }) => {
			const MAILCHIMP_LIST = String(process.env.MAILCHIMP_LIST);
			const MAILCHIMP_SERVER = String(process.env.MAILCHIMP_SERVER);
			const MAILCHIMP_API_TOKEN = String(process.env.MAILCHIMP_API_TOKEN);

			await axios.post(
				`https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST}/members`,
				{
					email_address: input.email,
					status: 'subscribed',
				},
				{
					headers: {
						Authorization: `Basic ${base64('placeholder:' + MAILCHIMP_API_TOKEN)}`,
					},
				},
			);

			return {
				success: true,
			};
		},
	},
};

export default resolvers;
