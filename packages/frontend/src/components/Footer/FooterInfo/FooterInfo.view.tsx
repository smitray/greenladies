import React from 'react';

import Link from 'next/link';
import { BiCalendar } from 'react-icons/bi';
import { FaTruck } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';
import styled from 'styled-components';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 40px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: 1fr;
	gap: 32px;

	@media (min-width: 320px) {
		grid-template-columns: 1fr;
	}

	@media (min-width: 961px) {
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
	}
`;

const GridBox = styled.div``;

const GridBoxTitle = styled.div`
	text-transform: uppercase;
	font-weight: bold;
	font-size: 12px;
	margin-bottom: 24px;
	color: #3a3a3a;
`;

const List = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`;

const ListItem = styled.li`
	padding: 4px 0;
	color: #444444;
	text-decoration: none;
	font-size: 14px;
`;

const ListItemLink = styled.a`
	color: #444444;
	text-decoration: none;
	font-size: 14px;
`;

const ImageContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

const Image = styled.img`
	flex-basis: 70px;
	width: 70px;
	margin-right: 8px;
	margin-bottom: 8px;
`;

export const FooterInfoView = () => {
	return (
		<div style={{ background: '#eceaeb' }}>
			<CenterWrapper>
				<GridBox>
					<GridBoxTitle>Vanliga frågor</GridBoxTitle>
					<List>
						<ListItem>
							<Link
								href="/[[...slug]]?tab=fullstandiga-kopvillkor"
								as="/kundservice?tab=fullstandiga-kopvillkor"
								passHref
							>
								<ListItemLink>Köpvillkor</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/[[...slug]]?tab=betalning" as="/kundservice?tab=betalning" passHref>
								<ListItemLink>Betalning</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/[[...slug]]?tab=frakt" as="/kundservice?tab=frakt" passHref>
								<ListItemLink>Leverans</ListItemLink>
							</Link>
						</ListItem>
					</List>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Betalningsalternativ</GridBoxTitle>
					<ImageContainer>
						<Image src="/images/klarna.jpg" />
						<Image src="/images/visa.png" />
						<Image src="/images/mastercard.png" />
						<Image src="/images/amex.png" />
						<Image src="/images/faktura.png" />
					</ImageContainer>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Vi skickar med</GridBoxTitle>
					<ImageContainer>
						<Image src="/images/dhl.jpg" />
					</ImageContainer>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Enkel onlineshopping</GridBoxTitle>
					<List>
						<ListItem style={{ display: 'flex', alignItems: 'center' }}>
							<FaTruck size="20" />
							<span style={{ marginLeft: '8px' }}>Klimatkompenserad frakt</span>
						</ListItem>
						<ListItem style={{ display: 'flex', alignItems: 'center' }}>
							<RiArrowGoBackFill size="20" />
							<span style={{ marginLeft: '8px' }}>Snabb och fri frakt över 999kr</span>
						</ListItem>
						<ListItem style={{ display: 'flex', alignItems: 'center' }}>
							<BiCalendar size="20" />
							<span style={{ marginLeft: '8px' }}>14 dagar öppet köp</span>
						</ListItem>
					</List>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Trygg e-handel</GridBoxTitle>
					<ImageContainer>
						<Image src="/images/verified-by-visa.jpg" />
						<Image src="/images/mastercard-securecode.png" />
					</ImageContainer>
				</GridBox>
			</CenterWrapper>
		</div>
	);
};
