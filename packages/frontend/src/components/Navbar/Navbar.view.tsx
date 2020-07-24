import React, { useState } from 'react';

import Link from 'next/link';
import styled from 'styled-components';

const Wrapper = styled.nav`
	padding: 15px 0;
`;

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
`;

const Row = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Group = styled.ul`
	display: flex;
	list-style: none;
	margin: 0;
	padding: 0;
`;

const Item = styled.div`
	padding: 20px 0;
	position: relative;
	font-size: 15px;

	&::after {
		content: '';
		position: absolute;
		display: block;
		left: 0;
		right: 0;

		margin-top: 5px;
		background: black;
		height: 2px;
		opacity: 0;
		transform: scaleX(0);

		transition: all 300ms;
	}
`;

const ItemText = styled.span`
	font-family: 'Cerebri Sans', sans-serif;
	display: block;
`;

const ItemWrapper = styled.a`
	display: block;
	padding: 0 20px;
	cursor: pointer;

	&:hover ${Item}::after {
		transform: scaleX(1);
		opacity: 1;
	}
`;

const MegaMenu = styled.div`
	width: 100%;
	background: green;
	height: 0;
	position: absolute;
`;

interface PromoBanner {
	image: string | null;
	title: string;
	subtitle: string;
}

interface NavbarProps {
	categories: {
		category: Category;
		promoBanner: PromoBanner;
	}[];
}

interface Category {
	name: string;
	href: string | null;
	categories: Category[];
}

function chunkArray<T>(array: T[], chunkSize = 5): T[][] {
	const chunkedArray: T[][] = [];
	for (let i = 0, j = array.length; i < j; i += chunkSize) {
		chunkedArray.push(array.slice(i, i + chunkSize));
	}

	return chunkedArray;
}

const NavbarView = () => {
	const { categories }: NavbarProps = {
		categories: [
			{
				promoBanner: {
					image: null,
					title: 'Grönare Garderob',
					subtitle: 'Upptäck mer',
				},
				category: {
					href: null,
					name: 'Kläder',
					categories: [
						{
							href: null,
							name: 'Alla kläder',
							categories: [
								{
									href: null,
									name: 'Klänningar & Tunikor',
									categories: [],
								},
								{
									href: null,
									name: 'Toppar & Linnen',
									categories: [],
								},
								{
									href: null,
									name: 'Blusar & Skjortor',
									categories: [],
								},
								{
									href: null,
									name: 'Tröjor & Stickat',
									categories: [],
								},
								{
									href: null,
									name: 'Kavaj & Kostym',
									categories: [],
								},
								{
									href: null,
									name: 'Jackor & Kappor',
									categories: [],
								},
								{
									href: null,
									name: 'Byxor',
									categories: [],
								},
								{
									href: null,
									name: 'Jeans',
									categories: [],
								},
								{
									href: null,
									name: 'Kjolar & Shorts',
									categories: [],
								},
								{
									href: null,
									name: 'Basplagg & Underkläder',
									categories: [],
								},
							],
						},
						{
							href: null,
							name: 'Utvalt',
							categories: [
								{
									href: null,
									name: 'Nyheter',
									categories: [],
								},
								{
									href: null,
									name: 'Hållbara regnjackor',
									categories: [],
								},
								{
									href: null,
									name: 'Nordiska designers',
									categories: [],
								},
								{
									href: null,
									name: 'Stilinspiration: Grön garderob',
									categories: [],
								},
								{
									href: null,
									name: 'Vintage',
									categories: [],
								},
							],
						},
					],
				},
			},
			{
				promoBanner: {
					image: null,
					title: 'Grönare Garderob',
					subtitle: 'Upptäck mer',
				},
				category: {
					href: null,
					name: 'Skor',
					categories: [
						{
							href: null,
							name: 'Alla damskor',
							categories: [
								{
									href: null,
									name: 'Sneakers & Lågskor',
									categories: [],
								},
								{
									href: null,
									name: 'Högklackade skor',
									categories: [],
								},
								{
									href: null,
									name: 'Pumps',
									categories: [],
								},
								{
									href: null,
									name: 'Sandaler& Sandletter',
									categories: [],
								},
								{
									href: null,
									name: 'Ballerina',
									categories: [],
								},
								{
									href: null,
									name: 'Ankelboots',
									categories: [],
								},
								{
									href: null,
									name: 'Stövlar',
									categories: [],
								},
							],
						},
					],
				},
			},
		],
	};
	const [currentCategory, setCurrentCategory] = useState<number | null>(0);

	return (
		<Wrapper>
			<CenterWrapper>
				<Row>
					<Group style={{ marginLeft: '-20px' }}>
						{categories.map((category, index) => {
							return (
								<li key={index}>
									<Link href="/">
										<ItemWrapper
											onMouseEnter={() => setCurrentCategory(index)}
											onMouseLeave={() => setCurrentCategory(null)}
										>
											<Item>
												<ItemText>{category.category.name}</ItemText>
											</Item>
										</ItemWrapper>
									</Link>
								</li>
							);
						})}
					</Group>
				</Row>
			</CenterWrapper>
			<MegaMenu>
				<CenterWrapper>
					{currentCategory != null && (
						<div style={{ display: 'flex' }}>
							{categories[currentCategory].category.categories.map((category, index) => {
								return (
									<div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
										<div style={{ fontSize: '30px' }}>{category.name}</div>
										<div style={{ display: 'flex' }}>
											{chunkArray(category.categories).map((chunk, index) => {
												return (
													<div key={index}>
														{chunk.map((category, index) => (
															<div key={index}>{category.name}</div>
														))}
													</div>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</CenterWrapper>
			</MegaMenu>
		</Wrapper>
	);
};

export default NavbarView;
