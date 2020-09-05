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

const SidebarLink = styled.a<SidebarLinkProps>`
	display: block;
	color: black;
	text-decoration: none;
	padding: 8px 16px 8px 0;
	cursor: pointer;
	text-align: right;
	position: relative;
	font-size: 16px;

	&:hover {
		text-decoration: underline;
	}

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
`;

const Tab = styled.div`
	font-size: 16px;
	line-height: 24px;
`;

const Title = styled.h1`
	text-align: center;
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
			<div style={{ display: 'flex' }}>
				<div style={{ flexBasis: '200px', flexShrink: 0, borderRight: '1px solid black', marginRight: '48px' }}>
					{tabs.tabs.map(tab => (
						<Link
							key={tab.key}
							href={{ pathname, query: { tab: tab.key } }}
							as={{ pathname: asPath.split('?')[0], query: { tab: tab.key } }}
						>
							<SidebarLink active={query.tab === tab.key}>{tab.title}</SidebarLink>
						</Link>
					))}
				</div>
				<div style={{ flexGrow: 1 }}>
					<Tab>
						<ReactMarkdown source={currentTab.body} />
					</Tab>
				</div>
			</div>
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
