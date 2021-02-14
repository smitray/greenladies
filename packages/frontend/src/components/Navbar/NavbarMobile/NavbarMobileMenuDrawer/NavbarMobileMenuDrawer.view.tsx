import React, { useState } from 'react';

import Link from 'next/link';
import Drawer from 'rc-drawer';
import { Collapse } from 'react-collapse';
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { useWindowDimensions } from '../../../../hooks/use-window-dimensions';
import { IconWrapper } from '../../../../styles/icon-wrapper';
import { NORMAL_TABLET_SIZE } from '../../../../utils/device-size';

import { NavbarMobileMenuDrawer_query } from './__generated__/NavbarMobileMenuDrawer_query.graphql';

const Header = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 48px;
	flex-shrink: 0;
`;

const CloseButton = styled.button`
	position: absolute;
	background: transparent;
	border: none;
	outline: none;
	cursor: pointer;
	right: 4px;
	padding: 12px;
`;

const OuterCategoryList = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	background: white;
`;

const OuterCategoryListItem = styled.li`
	padding-left: 20px;

	&:not(:last-child) {
		border-bottom: 1px solid #ddd;
	}
`;

const OuterCategoryListItemHeaderWrapper = styled.div`
	display: flex;
`;

const OuterCategoryListItemHeader = styled.a`
	color: black;
	text-decoration: none;
	flex-grow: 1;
	padding: 16px 0;
	font-size: 18px;
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
	padding: 0 0 0 30px;
	list-style: none;
`;

const InnerCategoryListItem = styled.li`
	&:not(:last-child) {
		border-bottom: 1px solid #ddd;
	}
`;

const CategoryLink = styled.a`
	color: black;
	text-decoration: none;
	padding: 16px 0;
	display: block;
	font-size: 18px;
`;

interface NavbarMobileMenuDrawerViewProps {
	query: NavbarMobileMenuDrawer_query;
	open: boolean;
	onCloseRequest: () => void;
}

const NavbarMobileMenuDrawerView = ({ query, open, onCloseRequest }: NavbarMobileMenuDrawerViewProps) => {
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
			<div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
				<Header>
					<img src="/images/greenladies-logo.png" alt="" style={{ height: '24px' }} />
					<CloseButton onClick={onCloseRequest}>
						<IconWrapper size="24px">
							<FiX size="24px" />
						</IconWrapper>
					</CloseButton>
				</Header>
				<div style={{ background: '#f2f2f2', flexGrow: 1, overflowY: 'auto' }}>
					<div
						style={{
							textTransform: 'uppercase',
							color: '#555',
							fontWeight: 'bold',
							fontSize: '14px',
							margin: '12px 0 4px 20px',
						}}
					>
						Kategorier
					</div>
					<OuterCategoryList>
						{query.rootCategories.map(category => {
							const isOpened = expandedCategories.includes(category.id);

							return (
								<OuterCategoryListItem key={category.id}>
									<OuterCategoryListItemHeaderWrapper>
										<Link href="/categories/[key]" as={`/categories/${category.urlKey}`} passHref>
											<OuterCategoryListItemHeader onClick={onCloseRequest}>
												{category.name}
											</OuterCategoryListItemHeader>
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
												{isOpened ? <FiMinus size="24px" /> : <FiPlus size="24px" />}
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
					<div
						style={{
							textTransform: 'uppercase',
							color: '#555',
							fontWeight: 'bold',
							fontSize: '14px',
							margin: '12px 0 4px 20px',
						}}
					>
						Service
					</div>
					<OuterCategoryList>
						<OuterCategoryListItem onClick={onCloseRequest}>
							<OuterCategoryListItemHeaderWrapper>
								<Link href="/[...slug]?tab=om-green-ladies" as="/kundservice?tab=om-green-ladies" passHref>
									<OuterCategoryListItemHeader>Om Green Ladies</OuterCategoryListItemHeader>
								</Link>
							</OuterCategoryListItemHeaderWrapper>
						</OuterCategoryListItem>
						<OuterCategoryListItem onClick={onCloseRequest}>
							<OuterCategoryListItemHeaderWrapper>
								<Link href="/[[...slug]]?tab=frakt" as="/kundservice?tab=frakt" passHref>
									<OuterCategoryListItemHeader>Klimatkompenserad frakt</OuterCategoryListItemHeader>
								</Link>
							</OuterCategoryListItemHeaderWrapper>
						</OuterCategoryListItem>
						<OuterCategoryListItem onClick={onCloseRequest}>
							<OuterCategoryListItemHeaderWrapper>
								<Link href="/[[...slug]]?tab=betalning" as="/kundservice?tab=betalning" passHref>
									<OuterCategoryListItemHeader>Trygg & säker betalning</OuterCategoryListItemHeader>
								</Link>
							</OuterCategoryListItemHeaderWrapper>
						</OuterCategoryListItem>
					</OuterCategoryList>
				</div>
			</div>
		</Drawer>
	);
};

export default createFragmentContainer(NavbarMobileMenuDrawerView, {
	query: graphql`
		fragment NavbarMobileMenuDrawer_query on Query {
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
