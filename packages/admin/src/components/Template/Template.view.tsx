import React, { useEffect, useState } from 'react';

import { FileOutlined, ImportOutlined, UploadOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Content, Sider } = Layout;

export const TemplateView = ({ children }: React.PropsWithChildren<any>) => {
	const router = useRouter();
	const [selectedKey, setSelectedKey] = useState(router.pathname.split('/')[1]);
	useEffect(() => {
		setSelectedKey(router.pathname.split('/')[1]);
	}, [router.pathname]);
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider>
				<Menu theme="dark" selectedKeys={[selectedKey]} mode="inline">
					<Menu.Item key="product-import" icon={<ImportOutlined />}>
						<Link href="/product-import">
							<a>Importera produkter</a>
						</Link>
					</Menu.Item>
					<Menu.Item key="image-upload" icon={<UploadOutlined />}>
						<Link href="/image-upload">
							<a>Ladda upp bilder</a>
						</Link>
					</Menu.Item>
					<Menu.Item key="custom-pages" icon={<FileOutlined />}>
						<Link href="/custom-pages">
							<a>Hantera sidor</a>
						</Link>
					</Menu.Item>
				</Menu>
			</Sider>
			<Layout className="site-layout">
				<Content style={{ margin: '0 16px' }}>{children}</Content>
			</Layout>
		</Layout>
	);
};
