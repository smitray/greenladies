import React from 'react';

import Link from 'next/link';
import styled from 'styled-components';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 40px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	gap: 16px;
`;

interface GridBoxProps {
	firstInRow?: boolean;
}

const GridBox = styled.div<GridBoxProps>`
	height: 180px;
	border-left: ${({ firstInRow }) => (firstInRow ? 'none' : '1px solid grey')};
`;

const GridBoxTitle = styled.div`
	text-transform: uppercase;
	font-weight: bold;
	font-size: 12px;
	margin-bottom: 24px;
`;

const List = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`;

const ListItem = styled.li`
	padding: 4px 0;
`;

const ListItemLink = styled.a`
	color: grey;
	text-decoration: none;
	font-size: 14px;
`;

export const FooterInfoView = () => {
	return (
		<div style={{ background: 'lightgrey' }}>
			<CenterWrapper>
				<GridBox firstInRow>
					<GridBoxTitle>Vanliga frågor</GridBoxTitle>
					<List>
						<ListItem>
							<Link href="/kundservice">
								<ListItemLink>Köpvillkor</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/kundservice">
								<ListItemLink>Beställa</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/kundservice">
								<ListItemLink>Betalning</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/kundservice">
								<ListItemLink>Leveranstid</ListItemLink>
							</Link>
						</ListItem>
					</List>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Populära kategorier</GridBoxTitle>
					<List>
						<ListItem>
							<Link href="/categories/[key]" as="/categories/jeans">
								<ListItemLink>Jeans</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/categories/[key]" as="/categories/klanningar">
								<ListItemLink>Klänningar</ListItemLink>
							</Link>
						</ListItem>
						<ListItem>
							<Link href="/categories/[key]" as="/categories/sjalar">
								<ListItemLink>Sjalar</ListItemLink>
							</Link>
						</ListItem>
					</List>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Utvalda märken och designers</GridBoxTitle>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Inspiration</GridBoxTitle>
				</GridBox>
				<GridBox firstInRow>
					<GridBoxTitle>Betalningsalternativ</GridBoxTitle>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Vi skickar med</GridBoxTitle>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Enkel onlineshopping</GridBoxTitle>
				</GridBox>
				<GridBox>
					<GridBoxTitle>Trygg e-handel</GridBoxTitle>
				</GridBox>
			</CenterWrapper>
		</div>
	);
};
