import axios from 'axios';

import { MailchimpModuleResolversType } from '..';

const resolvers: MailchimpModuleResolversType = {
	Mutation: {
		addEmailToSubscriberList: async (_parent, { input }) => {
			const MAILCHIMP_LIST = String(process.env.MAILCHIMP_LIST);
			const MAILCHIMP_SERVER = String(process.env.MAILCHIMP_SERVER);
			await axios.post(`https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST}/members`, {
				email_address: input.email,
				status: 'subscribed',
			});

			return {
				success: true,
			};
		},
	},
};

export default resolvers;
