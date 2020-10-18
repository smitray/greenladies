import React, { useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Collapse, message, Spin, Table, Upload } from 'antd';
import { useRouter } from 'next/router';
import Papa from 'papaparse';
import { fetchQuery, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';

import { useAuth } from '../contexts/auth-context';
import { MyNextPage } from '../lib/types';
import { useCreateProductsMutation } from '../mutations/create-products';
import { HOME_QUERY, HomeQuery } from '../queries/home';

const HorizontalAndVerticalCenterWrapper = ({ children }: React.PropsWithChildren<any>) => {
	return (
		<div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{children}</div>
	);
};

const REQUIRED_COLUMNS = [
	'sku',
	'category_name',
	'name',
	'description',
	'short_description',
	'price',
	'url_key',
	'meta_title',
	'meta_keywords',
	'meta_description',
	'color',
	'condition',
	'material',
	'brand',
	'size',
	'washing_description',
	'qty',
];

const validateData = (data: Record<string, string>) => {
	const missingColumns: string[] = [];
	REQUIRED_COLUMNS.forEach(column => {
		if (data[column] === undefined) {
			missingColumns.push(column);
		}
	});

	return missingColumns;
};

interface Product {
	name: string;
	baseSku: string;
	categoryName: string;
	description: string;
	shortDescription: string;
	washingDescription: string;
	material: string;
	urlKey: string;
	metaTitle: string;
	metaKeywords: string;
	metaDescription: string;
	color: string;
	brand: string;
	condition: string;
	configurations: {
		size: string;
		price: number;
		quantity: number;
	}[];
}

const Home: MyNextPage = () => {
	const [products, setProducts] = useState<Product[] | null>(null);
	const [duplicateProducts, setDuplicateProducts] = useState<Product[] | null>(null);

	const { isAuthenticated } = useAuth();

	const relayEnvironment = useRelayEnvironment();
	const { commit: createProducts, pending } = useCreateProductsMutation();

	const router = useRouter();

	if (!isAuthenticated) {
		typeof window !== 'undefined' && router.replace('/login');
		return null;
	}

	return (
		<React.Fragment>
			<QueryRenderer<HomeQuery>
				environment={relayEnvironment}
				query={HOME_QUERY}
				variables={{}}
				render={({ props, error }) => {
					if (error) {
						return <div>Error...</div>;
					}

					if (props) {
						const handleFileParsed = (rows: Record<string, string>[]) => {
							if (rows.length === 0) {
								message.error('Inga rader hittades');
								return;
							}
							const missingColumns = validateData(rows[0]);
							if (missingColumns.length > 0) {
								message.error('Kolumner saknas: ' + missingColumns.join(', '));
								return;
							}

							const products = new Map<string, Product>();

							rows.forEach(row => {
								const skuParts = row.sku.split('-');
								const baseSku = skuParts.slice(0, skuParts.length - 1).join('-');
								const product = products.get(baseSku);
								if (product) {
									products.set(baseSku, {
										...product,
										configurations: [
											...product.configurations,
											{
												price: parseInt(row.price, 10),
												quantity: parseInt(row.qty, 10),
												size: row.size,
											},
										].sort((left, right) => left.size.localeCompare(right.size)),
									});
								} else {
									const urlKeyParts = row.url_key.split('-');
									const baseUrlKey = urlKeyParts.slice(0, urlKeyParts.length - 1).join('-');
									products.set(baseSku, {
										name: row.name,
										baseSku,
										categoryName: row.category_name,
										description: row.description,
										shortDescription: row.short_description,
										washingDescription: row.washing_description,
										material: row.material,
										urlKey: baseUrlKey,
										metaTitle: row.meta_title,
										metaKeywords: row.meta_keywords,
										metaDescription: row.meta_description,
										color: row.color,
										brand: row.brand,
										condition: row.condition,
										configurations: [
											{
												price: parseInt(row.price, 10),
												quantity: parseInt(row.qty, 10),
												size: row.size,
											},
										],
									});
								}
							});

							const nonDuplicateProducts: Product[] = [];
							const duplicateProducts: Product[] = [];

							products.forEach(product => {
								if (
									props.products.edges.find(
										({ node: existingProduct }) => existingProduct.sku.replace('-CONF', '') === product.baseSku,
									)
								) {
									duplicateProducts.push(product);
								} else {
									nonDuplicateProducts.push(product);
								}
							});

							setProducts(nonDuplicateProducts);
							setDuplicateProducts(duplicateProducts);
						};

						if (products) {
							const handleSubmit = () => {
								createProducts({
									variables: {
										input: {
											products,
										},
									},
									onCompleted: () => {
										message.success('Artiklar skapade!');
										setProducts(null);
										setDuplicateProducts(null);
									},
									onError: error => {
										const actaulError = (error as any).source.errors[0];
										const errorMessage = actaulError.message;
										const errorCode = actaulError.extensions.code;
										const BASE_MESSAGE = 'Kunde inte skapa artiklar: ';
										switch (errorCode) {
											case 'INVALID_CATEGORY':
												message.error(BASE_MESSAGE + 'Ogiltig kategori ' + errorMessage);
												break;
											case 'INVALID_COLOR':
												message.error(BASE_MESSAGE + 'Ogiltig färg ' + errorMessage);
												break;
											case 'PRODUCT_CREATION_FAILED':
												message.error(BASE_MESSAGE + 'Något hände när ' + errorMessage + ' skulle skapas i Magento');
												break;
											default:
												message.error(BASE_MESSAGE + 'Något okänt förhindrade skapningen av produkterna');
												break;
										}
									},
								});
							};

							return (
								<React.Fragment>
									<h2>Artiklar</h2>
									<Collapse accordion>
										{products.map(product => (
											<Collapse.Panel
												key={product.baseSku}
												header={`${product.name} (${product.configurations.length} konfigurationer)`}
											>
												<Table
													dataSource={product.configurations}
													columns={[
														{
															title: 'Storlek',
															dataIndex: 'size',
															key: 'size',
														},
														{
															title: 'Pris',
															dataIndex: 'price',
															key: 'price',
														},
														{
															title: 'Antal',
															dataIndex: 'quantity',
															key: 'quantity',
														},
													]}
												/>
											</Collapse.Panel>
										))}
									</Collapse>
									{duplicateProducts !== null && duplicateProducts.length > 0 && (
										<React.Fragment>
											<h2>Redan existerande produkter</h2>
											<Collapse accordion>
												{duplicateProducts.map(product => (
													<Collapse.Panel
														key={product.baseSku}
														header={`${product.name} (${product.configurations.length} konfigurationer)`}
													>
														<Table
															dataSource={product.configurations}
															columns={[
																{
																	title: 'Storlek',
																	dataIndex: 'size',
																	key: 'size',
																},
																{
																	title: 'Pris',
																	dataIndex: 'price',
																	key: 'price',
																},
																{
																	title: 'Antal',
																	dataIndex: 'quantity',
																	key: 'quantity',
																},
															]}
														/>
													</Collapse.Panel>
												))}
											</Collapse>
										</React.Fragment>
									)}
									<div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
										<Button type="primary" size="large" onClick={handleSubmit} loading={pending}>
											Lägg till i Magento
										</Button>
									</div>
									<div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
										<Button
											onClick={() => {
												setProducts(null);
												setDuplicateProducts(null);
											}}
										>
											Välj ny import-fil
										</Button>
									</div>
								</React.Fragment>
							);
						}

						return (
							<HorizontalAndVerticalCenterWrapper>
								<Upload
									name="csv"
									accept=".csv"
									beforeUpload={file => {
										Papa.parse(file, {
											header: true,
											complete: results => {
												handleFileParsed(results.data as Record<string, string>[]);
											},
											error: () => {
												message.error('Något gick fel när filen skulle läsas');
											},
										});

										return false;
									}}
									showUploadList={false}
								>
									<Button icon={<UploadOutlined />}>Click to Upload</Button>
								</Upload>
							</HorizontalAndVerticalCenterWrapper>
						);
					}

					return (
						<HorizontalAndVerticalCenterWrapper>
							<Spin size="large" />
						</HorizontalAndVerticalCenterWrapper>
					);
				}}
			/>
		</React.Fragment>
	);
};

Home.getInitialProps = async ({ relayEnvironment }) => {
	await fetchQuery<HomeQuery>(relayEnvironment, HOME_QUERY, {});

	return {};
};

export default Home;
