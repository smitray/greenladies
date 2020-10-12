import React, { useState } from 'react';

import Link from 'next/link';
import { FaAngleRight } from 'react-icons/fa';
import { graphql, useMutation } from 'react-relay/hooks';

import { FooterEmailSignupCardMailchimpMutation } from './__generated__/FooterEmailSignupCardMailchimpMutation.graphql';
import {
	CardWrapper,
	SignupDisclaimer,
	SignupDisclaimerLink,
	SignupErrorMessage,
	SignupIconWrapper,
	SignupSubmitButton,
	SignupSuccessMessage,
	SignupText,
	SignupTextInput,
	SignupTitle,
} from './FooterEmailSignupCard.styles';

function validateEmail(email: string) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
}

const MAILCHIMP_MUTATION = graphql`
	mutation FooterEmailSignupCardMailchimpMutation($input: AddEmailToSubscriberListInput!) {
		addEmailToSubscriberList(input: $input) {
			success
		}
	}
`;

export const FooterEmailSignupCardView = () => {
	const [email, setEmail] = useState('');
	const [addEmailToSubList] = useMutation<FooterEmailSignupCardMailchimpMutation>(MAILCHIMP_MUTATION);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (validateEmail(email)) {
			addEmailToSubList({
				variables: {
					input: {
						email,
					},
				},
				onCompleted: () => {
					setSuccessMessage('Du är nu prenumererad!');
					setErrorMessage(null);
				},
				onError: () => {
					setSuccessMessage(null);
					setErrorMessage('Något gick fel...');
				},
			});
		} else {
			setSuccessMessage(null);
			setErrorMessage('Ange en giltig e-postadress');
		}
	};

	return (
		<CardWrapper>
			<SignupTitle>Bli en del av Green Ladies</SignupTitle>
			<SignupText>
				Anmäl dig till vårt nyhetsbrev och få 10% rabatt på din nästa order, stilinspiration och erbjudanden.
			</SignupText>
			<form onSubmit={handleSubmit}>
				<SignupTextInput
					type="text"
					placeholder="E-postadress"
					value={email}
					onChange={e => {
						setEmail(e.target.value);
						setSuccessMessage(null);
						setErrorMessage(null);
					}}
				/>
				{errorMessage && <SignupErrorMessage>{errorMessage}</SignupErrorMessage>}
				<SignupSubmitButton type="submit">
					<span>Registrera nu</span>
					<SignupIconWrapper size="24px">
						<FaAngleRight size="24px" />
					</SignupIconWrapper>
				</SignupSubmitButton>
			</form>
			{successMessage && <SignupSuccessMessage>{successMessage}</SignupSuccessMessage>}
			<SignupDisclaimer>
				Genom att registrera dig godkänner du våra{' '}
				<Link href="/" passHref>
					<SignupDisclaimerLink>Villkor</SignupDisclaimerLink>
				</Link>{' '}
				och vår{' '}
				<Link href="/" passHref>
					<SignupDisclaimerLink>Integritetspolicy</SignupDisclaimerLink>
				</Link>
				. Klicka på Avregistrera i våra mejl för att säga upp prenumerationen.
			</SignupDisclaimer>
		</CardWrapper>
	);
};
