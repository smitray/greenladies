import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';

import { MyNextPage } from '../lib/types';

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

interface TabProps {
	active: boolean;
}

const Tab = styled.div<TabProps>`
	display: ${({ active }) => (active ? 'block' : 'none')};
	font-size: 16px;
	line-height: 24px;
`;

const Title = styled.h1`
	text-align: center;
`;

const CustomerService: MyNextPage = () => {
	const { query, pathname } = useRouter();

	return (
		<CenterWrapper>
			{query.tab === 'contact' && <Title>Kontakta oss</Title>}
			{query.tab === 'payment' && <Title>Betalning</Title>}
			{query.tab === 'shipping' && <Title>Frakt</Title>}
			{query.tab === 'return' && <Title>Ångerrätt & Retur</Title>}
			{query.tab === 'integrity' && <Title>Integritetspolicy</Title>}
			{query.tab === 'complete' && <Title>Fullständiga köpvillkor</Title>}
			<div style={{ display: 'flex' }}>
				<div style={{ flexBasis: '200px', flexShrink: 0, borderRight: '1px solid black', marginRight: '48px' }}>
					<Link href={{ pathname, query: { tab: 'contact' } }} replace>
						<SidebarLink active={query.tab === 'contact'}>Kontakta oss</SidebarLink>
					</Link>
					<Link href={{ pathname, query: { tab: 'payment' } }} replace>
						<SidebarLink active={query.tab === 'payment'}>Betalning</SidebarLink>
					</Link>
					<Link href={{ pathname, query: { tab: 'shipping' } }} replace>
						<SidebarLink active={query.tab === 'shipping'}>Frakt</SidebarLink>
					</Link>
					<Link href={{ pathname, query: { tab: 'return' } }} replace>
						<SidebarLink active={query.tab === 'return'}>Ångerrätt & Retur</SidebarLink>
					</Link>
					<Link href={{ pathname, query: { tab: 'integrity' } }} replace>
						<SidebarLink active={query.tab === 'integrity'}>Integritetspolicy</SidebarLink>
					</Link>
					<Link href={{ pathname, query: { tab: 'complete' } }} replace>
						<SidebarLink active={query.tab === 'complete'}>Fullständiga köpvillkor</SidebarLink>
					</Link>
				</div>
				<div style={{ flexGrow: 1 }}>
					<Tab active={query.tab === 'contact'}></Tab>
					<Tab active={query.tab === 'payment'}></Tab>
					<Tab active={query.tab === 'shipping'}></Tab>
					<Tab active={query.tab === 'return'}></Tab>
					<Tab active={query.tab === 'integrity'}></Tab>
					<Tab active={query.tab === 'complete'}></Tab>
				</div>
			</div>
		</CenterWrapper>
	);
};

export default CustomerService;
