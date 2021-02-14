import React from 'react';

import { Button, Card, Form, Input } from 'antd';
import { useRouter } from 'next/router';

import { useAuth } from '../contexts/auth-context';
import { MyNextPage } from '../lib/types';

const Login: MyNextPage = () => {
	const [form] = Form.useForm();

	const { login, isAuthenticated } = useAuth();

	const router = useRouter();

	if (isAuthenticated) {
		typeof window !== 'undefined' && router.replace('/');
		return null;
	}

	const handleSubmit = (values: any) => {
		login(values.username, values.password);
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
			<Card title="Logga in" style={{ width: 360 }}>
				<Form form={form} name="login" labelCol={{ span: 10 }} wrapperCol={{ span: 16 }} onFinish={handleSubmit}>
					<Form.Item
						label="Användarnamn"
						name="username"
						rules={[{ required: true, message: 'Ange ditt användarnamn' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item label="Lösenord" name="password" rules={[{ required: true, message: 'Ange ditt lösenord' }]}>
						<Input.Password />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">
							Logga in
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default Login;
