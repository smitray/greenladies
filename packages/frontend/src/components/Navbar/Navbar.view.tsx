import React from 'react';

import Link from 'next/link';

import { MegaMenu } from './MegaMenu';
import {
	CenterWrapper,
	Group,
	Item,
	ItemText,
	ItemWrapper,
	MegaMenu as MegaMenuWrapper,
	Row,
	Wrapper,
} from './Navbar.styles';

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

interface NavbarViewProps {
	currentlySelectedTopLevelItemIndex: number | null;
	handleTopLevelItemFocus: (index: number) => void;
	handleTopLevelItemUnfocus: () => void;
	handleMegaMenuFocus: () => void;
	handleMegaMenuUnfocus: () => void;
}

export const NavbarView = ({
	currentlySelectedTopLevelItemIndex,
	handleTopLevelItemFocus,
	handleTopLevelItemUnfocus,
	handleMegaMenuFocus,
	handleMegaMenuUnfocus,
}: NavbarViewProps) => {
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
											onMouseEnter={() => handleTopLevelItemFocus(index)}
											onMouseLeave={handleTopLevelItemUnfocus}
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
			<MegaMenuWrapper
				open={currentlySelectedTopLevelItemIndex !== null}
				onMouseEnter={handleMegaMenuFocus}
				onMouseLeave={handleMegaMenuUnfocus}
			>
				<CenterWrapper style={{ padding: '20px 0' }}>
					{currentlySelectedTopLevelItemIndex != null && (
						<MegaMenu category={categories[currentlySelectedTopLevelItemIndex].category} />
					)}
				</CenterWrapper>
			</MegaMenuWrapper>
		</Wrapper>
	);
};
