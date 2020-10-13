import React from 'react';

import { Button, Card, Form, Input } from 'antd';

import { MyNextPage } from '../lib/types';

const Login: MyNextPage = () => {
	const [form] = Form.useForm();

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
			<Card title="Default size card" style={{ width: 360 }}>
				<Form form={form} name="login" labelCol={{ span: 10 }} wrapperCol={{ span: 16 }}>
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
