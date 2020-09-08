import React, { useState } from 'react';

import Link from 'next/link';
import Drawer from 'rc-drawer';
import { Collapse } from 'react-collapse';
import { FaAngleDown, FaAngleUp, FaTimes } from 'react-icons/fa';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { useWindowDimensions } from '../../hooks/use-window-dimensions';
import { IconWrapper } from '../../styles/icon-wrapper';
import { NORMAL_TABLET_SIZE } from '../../utils/device-size';

import { DrawerMenu_query } from './__generated__/DrawerMenu_query.graphql';

const Header = styled.div`
	position: relative;
	padding: 0.5em 0;
	text-align: center;
	font-size: 1.5em;
	line-height: 1.5em;
`;

const CloseButton = styled.button`
	position: absolute;
	right: 0.5em;
	top: 0.25em;
	background: white;
	border: none;
	outline: none;
	padding: 0.5em;
	font-size: 1em;
	cursor: pointer;
`;

const Banner = styled.div`
	height: 128px;
	background-image: url(/images/tennis-banner.jpg);
	background-position: right;
`;
const OuterCategoryList = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`;

const OuterCategoryListItem = styled.li`
	padding: 1em 0.5em;

	&:not(:last-child) {
		border-bottom: 1px solid black;
	}
`;

const OuterCategoryListItemHeaderWrapper = styled.div`
	display: flex;
`;

const OuterCategoryListItemHeader = styled.a`
	color: black;
	text-decoration: none;
	flex-grow: 1;
	padding: 1em;
	font-weight: bold;
`;

const OuterCategoryListItemCaretWrapper = styled.button`
	padding: 0.5em 1em;
	background: none;
	outline: none;
	border: none;
	font-size: 1em;
	cursor: pointer;
`;

const InnerCategoryList = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`;

const InnerCategoryListItem = styled.li`
	border-top: 1px solid black;
`;

const CategoryLink = styled.a`
	color: black;
	text-decoration: none;
	padding: 1em 1em 1em 1.5em;
	display: block;
`;

interface DrawerMenuViewProps {
	query: DrawerMenu_query;
	open: boolean;
	onCloseRequest: () => void;
}

const DrawerMenuView = ({ query, open, onCloseRequest }: DrawerMenuViewProps) => {
	const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

	const { width: windowWidth } = useWindowDimensions();

	return (
		<Drawer
			level={null}
			open={open}
			placement="left"
			handler={false}
			width={windowWidth > NORMAL_TABLET_SIZE ? NORMAL_TABLET_SIZE + 'px' : '100%'}
			onClose={onCloseRequest}
		>
			<Header>
				Meny
				<CloseButton onClick={onCloseRequest}>
					<IconWrapper size="1em">
						<FaTimes size="1em" />
					</IconWrapper>
				</CloseButton>
			</Header>
			<Banner />
			<OuterCategoryList>
				{query.rootCategories.map(category => {
					const isOpened = expandedCategories.includes(category.id);

					return (
						<OuterCategoryListItem key={category.id}>
							<OuterCategoryListItemHeaderWrapper>
								<Link href="/categories/[key]" as={`/categories/${category.urlKey}`} passHref>
									<OuterCategoryListItemHeader onClick={onCloseRequest}>{category.name}</OuterCategoryListItemHeader>
								</Link>
								<OuterCategoryListItemCaretWrapper
									onClick={() => {
										if (isOpened) {
											setExpandedCategories(expandedCategories =>
												expandedCategories.filter(expandedCategory => expandedCategory !== category.id),
											);
										} else {
											setExpandedCategories(expandedCategories => [...expandedCategories, category.id]);
										}
									}}
								>
									<IconWrapper size="24px">
										{isOpened ? <FaAngleUp size="24px" /> : <FaAngleDown size="24px" />}
									</IconWrapper>
								</OuterCategoryListItemCaretWrapper>
							</OuterCategoryListItemHeaderWrapper>
							<Collapse isOpened={isOpened}>
								<InnerCategoryList>
									{category.children.map(innerCategory => (
										<InnerCategoryListItem key={innerCategory.id}>
											<Link href="/categories/[key]" as={`/categories/${innerCategory.urlKey}`} passHref>
												<CategoryLink onClick={onCloseRequest}>{innerCategory.name}</CategoryLink>
											</Link>
										</InnerCategoryListItem>
									))}
								</InnerCategoryList>
							</Collapse>
						</OuterCategoryListItem>
					);
				})}
			</OuterCategoryList>
		</Drawer>
	);
};

export default createFragmentContainer(DrawerMenuView, {
	query: graphql`
		fragment DrawerMenu_query on Query {
			rootCategories {
				id
				name
				urlKey
				children {
					id
					name
					urlKey
				}
			}
		}
	`,
});
