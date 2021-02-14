import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { createFragmentContainer, graphql } from 'react-relay';

import { HideOnMinSize, ShowOnMinSize } from '../../../styles/responsive';

import { CustomPageTabs_tabs } from './__generated__/CustomPageTabs_tabs.graphql';
import {
	TabComponentWrapper,
	TabContentWrapper,
	TabLink,
	TabLinksAndContentWrapper,
	TabLinksContainer,
	TabTitle,
} from './CustomPageTabs.styles';

interface CustomPageTabsViewProps {
	tabs: CustomPageTabs_tabs;
}

const CustomPageTabsView = ({ tabs }: CustomPageTabsViewProps) => {
	const { query, pathname, asPath, replace } = useRouter();

	const currentTab = tabs.tabs.find(tab => tab.key === query.tab);

	if (!currentTab) {
		if (typeof window !== 'undefined') {
			replace(asPath.split('?')[0] + '?tab=' + tabs.tabs[0].key);
		}

		return null;
	}

	return (
		<TabComponentWrapper>
			<TabTitle>{currentTab.title}</TabTitle>
			<TabLinksAndContentWrapper>
				<HideOnMinSize size="l">
					<p>Information om</p>
					<ul>
						{tabs.tabs.map(tab => (
							<li key={tab.key}>
								<Link
									href={{ pathname, query: { tab: tab.key } }}
									as={{ pathname: asPath.split('?')[0], query: { tab: tab.key } }}
								>
									<a style={{ color: 'black', textDecoration: 'none', lineHeight: '24px' }}>{tab.title}</a>
								</Link>
							</li>
						))}
					</ul>
				</HideOnMinSize>
				<ShowOnMinSize size="l">
					<TabLinksContainer>
						{tabs.tabs.map(tab => (
							<Link
								key={tab.key}
								href={{ pathname, query: { tab: tab.key } }}
								as={{ pathname: asPath.split('?')[0], query: { tab: tab.key } }}
							>
								<TabLink active={query.tab === tab.key}>{tab.title}</TabLink>
							</Link>
						))}
					</TabLinksContainer>
				</ShowOnMinSize>
				<TabContentWrapper>
					<ReactMarkdown source={currentTab.body} />
				</TabContentWrapper>
			</TabLinksAndContentWrapper>
		</TabComponentWrapper>
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
