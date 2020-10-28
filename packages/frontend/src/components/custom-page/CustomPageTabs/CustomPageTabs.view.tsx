import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { createFragmentContainer, graphql } from 'react-relay';

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
	const { query, pathname, asPath } = useRouter();

	const currentTab = tabs.tabs.find(tab => tab.key === query.tab);

	if (!currentTab) {
		return <div>404</div>;
	}

	return (
		<TabComponentWrapper>
			<TabTitle>{currentTab.title}</TabTitle>
			<TabLinksAndContentWrapper>
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
