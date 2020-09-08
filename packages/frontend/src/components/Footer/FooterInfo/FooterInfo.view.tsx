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
	grid-template-columns: 1fr 1fr 1fr 1fr;
	gap: 32px;

	@media (min-width: 320px) {
		grid-template-columns: 1fr;
	}

	@media (min-width: 641px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 961px) {
		grid-template-columns: 1fr 1fr 1fr 1fr;
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

const GridImageContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 8px;

	@media (min-width: 320px) {
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	}

	@media (min-width: 640px) {
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}

	@media (min-width: 961px) {
		grid-template-columns: 1fr 1fr 1fr;
	}
`;

const GridImage = styled.img`
	width: 100%;
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
								href="/[[...lug]]?tab=fullstandiga-kopvillkor"
								as="/kundservice?tab=fullstandiga-kopvillkor"
								passHref
							>
								<ListItemLink>Köpvillkor</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/[[...lug]]?tab=betalning" as="/kundservice?tab=betalning" passHref>
								<ListItemLink>Betalning</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/[[...lug]]?tab=frakt" as="/kundservice?tab=frakt" passHref>
								<ListItemLink>Leveranstid</ListItemLink>
							</Link>
						</ListItem>
					</List>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Populära kategorier</GridBoxTitle>
					<List>
						<ListItem>
							<Link href="/categories/[key]" as="/categories/jeans" passHref>
								<ListItemLink>Jeans</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/categories/[key]" as="/categories/klanningar" passHref>
								<ListItemLink>Klänningar</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/categories/[key]" as="/categories/sjalar" passHref>
								<ListItemLink>Sjalar</ListItemLink>
							</Link>
						</ListItem>
					</List>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Utvalda märken och designers</GridBoxTitle>
					<List>
						<ListItem>
							<Link href="/categories/all?brands=Baum And Pferdgarten" passHref>
								<ListItemLink>Baum Und Pferdgarten</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/categories/all?brands=Stefanel" passHref>
								<ListItemLink>Stefanel</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/categories/all?brands=ESPRIT" passHref>
								<ListItemLink>ESPRIT</ListItemLink>
							</Link>
						</ListItem>
					</List>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Inspiration</GridBoxTitle>
					<List>
						<ListItem>
							<Link href="#" passHref>
								<ListItemLink>Höstnyheter</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="#" passHref>
								<ListItemLink>Vardagsfavoriter</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="#" passHref>
								<ListItemLink>Stilinspiration</ListItemLink>
							</Link>
						</ListItem>
					</List>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Betalningsalternativ</GridBoxTitle>
					<GridImageContainer>
						<GridImage src="/images/klarna.jpg" />
						<GridImage src="/images/visa.png" />
						<GridImage src="/images/mastercard.png" />
						<GridImage src="/images/amex.png" />
						<GridImage src="/images/faktura.png" />
					</GridImageContainer>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Vi skickar med</GridBoxTitle>
					<GridImageContainer>
						<GridImage src="/images/dhl.jpg" />
					</GridImageContainer>
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
					<GridImageContainer>
						<GridImage src="/images/verified-by-visa.jpg" />
						<GridImage src="/images/mastercard-securecode.png" />
					</GridImageContainer>
				</GridBox>
			</CenterWrapper>
		</div>
	);
};
