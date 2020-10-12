import React from 'react';

import { HideOnMinSize, ShowOnMinSize } from '../../../styles/responsive';

import { FooterEmailSignupDesktop } from './FooterEmailSignupDesktop';
import { FooterEmailSignupMobile } from './FooterEmailSignupMobile';

export const FooterEmailSignupView = () => {
	return (
		<React.Fragment>
			<HideOnMinSize size="l">
				<FooterEmailSignupMobile />
			</HideOnMinSize>
			<ShowOnMinSize size="l">
				<FooterEmailSignupDesktop />
			</ShowOnMinSize>
		</React.Fragment>
	);
	// <div style={{ background: 'url(/images/email-signup.jpg)' }}>
	// 	<CenterWrapper>
	// 		<div style={{ padding: '36px 0' }}>
	// 			<div style={{ maxWidth: '500px', padding: '24px', background: 'white' }}>
	// 				<h1 style={{ margin: '0 0 16px 0', fontSize: '24px', lineHeight: '40px' }}>
	// 					Vad sägs om 10% rabatt på nästa beställning?
	// 				</h1>
	// 				<p style={{ color: 'grey', fontSize: '16px', lineHeight: '24px' }}>
	// 					Bli en del av Green Ladies! Anmäl dig till vårt nyhetsbrev och få 10% rabatt på din nästa beställning,
	// 					stilinpiration plus exklusiva medlemsinbjudningar
	// 				</p>
	// 				<div style={{ marginBottom: '2px' }}>
	// 					<label style={{ color: 'grey', fontSize: '14px', fontWeight: 'bold' }} htmlFor="newsletter">
	// 						Din e-mail
	// 					</label>
	// 				</div>
	// 				<div style={{ marginBottom: '8px' }}>
	// 					<input
	// 						style={{
	// 							width: '100%',
	// 							outline: 'none',
	// 							border: '1px solid black',
	// 							borderRadius: '0',
	// 							padding: '12px',
	// 						}}
	// 						id="newsletter"
	// 						name="newsletter"
	// 						type="text"
	// 						value={email}
	// 						onChange={e => {
	// 							setEmail(e.target.value);
	// 							setMessage(null);
	// 						}}
	// 					/>
	// 				</div>
	// 				{message !== null && <div style={{ marginTop: '4px 0', fontSize: '0.75em' }}>{message}</div>}
	// 				<button
	// 					disabled={!emailIsValid}
	// 					style={{
	// 						width: '200px',
	// 						padding: '12px',
	// 						background: emailIsValid ? 'black' : 'grey',
	// 						border: 'none',
	// 						outline: 'none',
	// 						color: 'white',
	// 						fontSize: '14px',
	// 						fontWeight: 'bold',
	// 						marginBottom: '16px',
	// 						marginTop: '8px',
	// 						cursor: emailIsValid ? 'pointer' : 'not-allowed',
	// 					}}
	// 					onClick={() => {
	// 						if (emailIsValid) {
	// 							addEmailToSubList({
	// 								variables: {
	// 									input: {
	// 										email,
	// 									},
	// 								},
	// 								onCompleted: () => {
	// 									setMessage('Prenumerationen gick igenom!');
	// 								},
	// 								onError: () => {
	// 									setMessage('Något gick fel');
	// 								},
	// 							});
	// 						}
	// 					}}
	// 				>
	// 					Prenumerera
	// 				</button>
	// 				<Link href="/kundservice" passHref>
	// 					<a style={{ display: 'block', color: 'grey', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
	// 						I vår integritetspolicy kan du läsa mer om hur vi hanterar dina personuppgifter.
	// 					</a>
	// 				</Link>
	// 			</div>
	// 		</div>
	// 	</CenterWrapper>
	// </div>
};
