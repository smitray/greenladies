import React, { useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Collapse, message, Spin, Table, Upload } from 'antd';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { useRouter } from 'next/router';
import Papa from 'papaparse';
import { fetchQuery, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';
import { UploadableMap } from 'relay-runtime';

import { Template } from '../components/Template';
import { useAuth } from '../contexts/auth-context';
import { MyNextPage } from '../lib/types';
import { useCreateProductsMutation } from '../mutations/create-products';

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

	const relayEnvironment = useRelayEnvironment();

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
					<Button icon={<UploadOutlined />}>Click to Upload</Button>
				</Upload>
			</HorizontalAndVerticalCenterWrapper>
		</Template>
	);
};

export default ImageUpload;
