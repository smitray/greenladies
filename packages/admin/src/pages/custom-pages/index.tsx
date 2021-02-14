import React from 'react';

import { Button, Spin, Table, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchQuery, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';

import { Template } from '../../components/Template';
import { useAuth } from '../../contexts/auth-context';
import { MyNextPage } from '../../lib/types';
import { CUSTOM_PAGES, CustomPagesQuery } from '../../queries/custom-page';

const HorizontalAndVerticalCenterWrapper = ({ children }: React.PropsWithChildren<any>) => {
	return (
		<div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{children}</div>
	);
};

const ListCustomPages: MyNextPage = () => {
	const relayEnvironment = useRelayEnvironment();
	const { isAuthenticated } = useAuth();

	const router = useRouter();

	if (!isAuthenticated) {
		typeof window !== 'undefined' && router.replace('/login');
		return null;
	}

	return (
		<Template>
			<Typography.Title>Sidor</Typography.Title>
			<Button onClick={() => router.push('/custom-pages/create')}>Skapa ny sida</Button>
			<QueryRenderer<CustomPagesQuery>
				environment={relayEnvironment}
				query={CUSTOM_PAGES}
				variables={{}}
				render={({ props, error }) => {
					if (error) {
						return <div>Error...</div>;
					}

					if (props) {
						return (
							<Table
								dataSource={props.customPages.map(page => ({
									...page,
								}))}
								pagination={false}
							>
								<Table.Column title="Titel" dataIndex="metaTitle" key="title" />
								<Table.Column title="Plats" dataIndex="path" key="path" />
								<Table.Column
									title="Handling"
									key="operation"
									render={entry => {
										return (
											<Link href={`/custom-pages/${entry.id}`}>
												<a>Ändra</a>
											</Link>
										);
									}}
								/>
							</Table>
						);
					}

					return (
						<HorizontalAndVerticalCenterWrapper>
							<Spin size="large" />
						</HorizontalAndVerticalCenterWrapper>
					);
				}}
			/>
		</Template>
	);
};

ListCustomPages.getInitialProps = async ({ relayEnvironment }) => {
	await fetchQuery<CustomPagesQuery>(relayEnvironment, CUSTOM_PAGES, {});

	return {};
};

export default ListCustomPages;
