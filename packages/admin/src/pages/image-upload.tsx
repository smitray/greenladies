import React from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { useRouter } from 'next/router';

import { Template } from '../components/Template';
import { useAuth } from '../contexts/auth-context';
import { MyNextPage } from '../lib/types';

const HorizontalAndVerticalCenterWrapper = ({ children }: React.PropsWithChildren<any>) => {
	return (
		<div
			style={{
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			{children}
		</div>
	);
};

const ImageUpload: MyNextPage = () => {
	const { isAuthenticated } = useAuth();

	const router = useRouter();

	if (!isAuthenticated) {
		typeof window !== 'undefined' && router.replace('/login');
		return null;
	}

	return (
		<Template>
			<HorizontalAndVerticalCenterWrapper>
				<Upload
					name="image"
					accept=".jpg, .jpeg, .png"
					action={`${window.location.protocol}//api.${window.location.hostname}/upload-image`}
					multiple
					withCredentials
					beforeUpload={file => {
						if (file.type === 'image/jpeg' || file.type === 'image/png') {
							return true;
						}

						return false;
					}}
				>
					<Button icon={<UploadOutlined />}>Välj bilder att ladda upp</Button>
				</Upload>
			</HorizontalAndVerticalCenterWrapper>
		</Template>
	);
};

export default ImageUpload;
