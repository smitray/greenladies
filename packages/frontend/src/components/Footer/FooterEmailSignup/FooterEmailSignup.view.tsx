import React from 'react';

import Link from 'next/link';
import styled from 'styled-components';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 40px;
	margin: 0 auto;
`;

export const FooterEmailSignupView = () => {
	return (
		<div style={{ background: 'url(/images/email-signup.jpg)' }}>
			<CenterWrapper>
				<div style={{ maxWidth: '500px', padding: '24px', background: 'white' }}>
					<h1 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>Vad sägs om 10% rabatt på nästa beställning?</h1>
					<p style={{ color: 'grey', fontSize: '16px', lineHeight: '20px' }}>
						Bli en del av Green Ladies! Anmäl dig till vårt nyhetsbrev och få 10% rabatt på din nästa besällning,
						stilinpiration plus exklusiva medlemsinbjudningar
					</p>
					<div>
						<label style={{ color: 'grey', fontSize: '14px', fontWeight: 'bold' }} htmlFor="newsletter">
							Din e-mail
						</label>
					</div>
					<div style={{ marginBottom: '12px' }}>
						<input
							style={{ width: '100%', outline: 'none', border: '1px solid black', borderRadius: '0', padding: '12px' }}
							id="newsletter"
							name="newsletter"
							type="text"
						/>
					</div>
					<button
						disabled
						style={{
							width: '200px',
							padding: '12px',
							background: 'grey',
							border: 'none',
							outline: 'none',
							color: 'white',
							fontSize: '14px',
							fontWeight: 'bold',
							cursor: 'not-allowed',
							marginBottom: '16px',
						}}
					>
						Prenumerera
					</button>
					<Link href="/kundservice" passHref>
						<a style={{ display: 'block', color: 'grey', fontSize: '12px', fontWeight: 'bold' }}>
							I vår integritetspolicy kan du läsa mer om hur vi hanterar dina personuppgifter.
						</a>
					</Link>
				</div>
			</CenterWrapper>
		</div>
	);
};
