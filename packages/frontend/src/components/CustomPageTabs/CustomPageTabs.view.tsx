import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { createFragmentContainer, graphql } from 'react-relay';
import styled, { css } from 'styled-components';

import { CustomPageTabs_tabs } from './__generated__/CustomPageTabs_tabs.graphql';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 24px 40px;
	margin: 0 auto;
`;

interface SidebarLinkProps {
	active: boolean;
}

const Tab = styled.div`
	font-size: 16px;
	line-height: 24px;
`;

const Title = styled.h1`
	text-align: center;
`;

const TabWrapper = styled.div`
	display: flex;
	flex-direction: column;

	@media (min-width: 961px) {
		align-items: start;
		flex-direction: row;
	}
`;

const TabsContainer = styled.div`
	display: flex;
	overflow-x: scroll;
	border-bottom: 1px solid black;

	&::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 961px) {
		display: block;
		flex-shrink: 0;
		border-bottom: none;
		border-right: 1px solid black;
		margin-right: 2em;
	}
`;

const TabLink = styled.a<SidebarLinkProps>`
	&:hover {
		text-decoration: underline;
	}

	white-space: nowrap;
	display: block;
	color: black;
	text-decoration: none;
	cursor: pointer;
	position: relative;
	padding: 8px 16px;
	font-size: 16px;
	font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
	${({ active }) =>
		active
			? css`
					&:after {
						content: '';
						width: 100%;
						height: 3px;
						background: #000;
						position: absolute;
						bottom: 0;
						left: 0;
					}
			  `
			: ''}

	@media (min-width: 961px) {
		text-align: right;
		padding: 8px 16px 8px 0;

		${({ active }) =>
			active
				? css`
						&:after {
							content: '';
							height: 100%;
							width: 3px;
							background: #000;
							position: absolute;
							right: 0;
							top: 0;
						}
				  `
				: ''}
	}
`;

interface CustomPageTabsViewProps {
	tabs: CustomPageTabs_tabs;
}

const CustomPageTabsView = ({ tabs }: CustomPageTabsViewProps) => {
	const { query, pathname, asPath } = useRouter();

	const currentTab = tabs.tabs.find(tab => tab.key === query.tab);

	if (!currentTab) {
		return <div>404</div>;
	}

	return (
		<CenterWrapper>
			<Title>{currentTab.title}</Title>
			<TabWrapper>
				<TabsContainer>
					{tabs.tabs.map(tab => (
						<Link
							key={tab.key}
							href={{ pathname, query: { tab: tab.key } }}
							as={{ pathname: asPath.split('?')[0], query: { tab: tab.key } }}
						>
							<TabLink active={query.tab === tab.key}>{tab.title}</TabLink>
						</Link>
					))}
				</TabsContainer>
				<div style={{ flexGrow: 1 }}>
					<Tab>
						<ReactMarkdown source={currentTab.body} />
					</Tab>
				</div>
			</TabWrapper>
		</CenterWrapper>
	);
};

export default createFragmentContainer(CustomPageTabsView, {
	tabs: graphql`
		fragment CustomPageTabs_tabs on CustomPageTab {
			tabs {
				key
				title
				body
			}
		}
	`,
});
