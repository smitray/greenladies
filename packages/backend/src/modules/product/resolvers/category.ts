import { ProductModuleResolversType } from '..';
import { Product } from '../../../magento-sync';
import { connectionFromArray } from '../../../utils/relay';
import { CategoryProvider } from '../../category/category.provider';
import { ProductProvider } from '../product.provider';

function setIntersection(first: Set<string>, second: Set<string>) {
	return new Set([...first].filter(x => second.has(x)));
}

function setIntersections(sets: Set<string>[]) {
	const sortedSets = sets.sort((left, right) => left.size - right.size);
	const [firstSet, ...restOfSets] = sortedSets;

	return restOfSets.reduce((prev, current) => {
		return setIntersection(prev, current);
	}, firstSet);
}

const resolvers: ProductModuleResolversType = {
	Category: {
		products: async ({ id }, args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);
			const products = await Promise.all(
				category.productIds.map(id => injector.get(ProductProvider).getProduct({ id })),
			);
			if (products.length === 0) {
				return {
					...connectionFromArray(products, args),
					availableFilters: {
						brands: [],
						colors: [],
						price: {
							from: 0,
							to: 0,
						},
						sizes: [],
					},
				};
			}

			let availableProductsByBrands: Product[] | null = null;
			let availableProductsByPrice: Product[] | null = null;
			let availableProductsByColors: Product[] | null = null;
			let availableProductsBySizes: Product[] | null = null;
			let filteredProducts: Product[] | null = null;
			const { orderBy, filters } = args;
			if (filters) {
				const productsFilteredByBrands = filters.brand_in
					? products.filter(product => {
							if (product.__type === 'ConfigurableProduct') {
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								return filters.brand_in!.includes(product.brand);
							}

							return false;
					  })
					: products;
				const productsFilteredByColors = filters.color_in
					? products.filter(product => {
							if (product.__type === 'ConfigurableProduct') {
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								return setIntersection(new Set(filters.color_in!), new Set(product.colors)).size > 0;
							}

							return false;
					  })
					: products;
				const productsFilteredByPrice = filters.price_between
					? products.filter(product => {
							if (product.__type === 'ConfigurableProduct') {
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								const { from, to } = filters.price_between!;
								return product.price >= from && product.price <= to;
							}

							return false;
					  })
					: products;
				const productsFilteredBySizes = filters.size_in
					? products.filter(product => {
							if (product.__type === 'ConfigurableProduct') {
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								return setIntersection(new Set(filters.size_in!), new Set(product.sizes)).size > 0;
							}

							return false;
					  })
					: products;

				const productIdsFilteredByBrands = new Set(productsFilteredByBrands.map(({ id }) => id));
				const productIdsFilteredByPrice = new Set(productsFilteredByPrice.map(({ id }) => id));
				const productIdsFilteredByColors = new Set(productsFilteredByColors.map(({ id }) => id));
				const productIdsFilteredBySizes = new Set(productsFilteredBySizes.map(({ id }) => id));

				const productsMap = new Map(products.map(product => [product.id, product]));
				const filteredProductIds = setIntersections([
					productIdsFilteredByBrands,
					productIdsFilteredByPrice,
					productIdsFilteredByColors,
					productIdsFilteredBySizes,
				]);
				filteredProducts = [...filteredProductIds].map(productId => {
					const product = productsMap.get(productId);
					if (!product) {
						throw new Error('This should not happen');
					}

					return product;
				});

				const availableProductIdsByBrands = setIntersections([
					productIdsFilteredByPrice,
					productIdsFilteredByColors,
					productIdsFilteredBySizes,
				]);
				const availableProductIdsByPrice = setIntersections([
					productIdsFilteredByBrands,
					productIdsFilteredByColors,
					productIdsFilteredBySizes,
				]);
				const availableProductIdsByColors = setIntersections([
					productIdsFilteredByBrands,
					productIdsFilteredByPrice,
					productIdsFilteredBySizes,
				]);
				const availableProductIdsBySizes = setIntersections([
					productIdsFilteredByBrands,
					productIdsFilteredByPrice,
					productIdsFilteredByColors,
				]);

				availableProductsByBrands = [...availableProductIdsByBrands].map(productId => {
					const product = productsMap.get(productId);
					if (!product) {
						throw new Error('This should not happen');
					}

					return product;
				});
				availableProductsByPrice = [...availableProductIdsByPrice].map(productId => {
					const product = productsMap.get(productId);
					if (!product) {
						throw new Error('This should not happen');
					}

					return product;
				});
				availableProductsByColors = [...availableProductIdsByColors].map(productId => {
					const product = productsMap.get(productId);
					if (!product) {
						throw new Error('This should not happen');
					}

					return product;
				});
				availableProductsBySizes = [...availableProductIdsBySizes].map(productId => {
					const product = productsMap.get(productId);
					if (!product) {
						throw new Error('This should not happen');
					}

					return product;
				});
			}

			if (filteredProducts === null) {
				filteredProducts = products;
			}

			if (availableProductsByBrands === null) {
				availableProductsByBrands = filteredProducts;
			}

			if (availableProductsByPrice === null) {
				availableProductsByPrice = filteredProducts;
			}

			if (availableProductsByColors === null) {
				availableProductsByColors = filteredProducts;
			}

			if (availableProductsBySizes === null) {
				availableProductsBySizes = filteredProducts;
			}

			let filteredAndOrderedProducts = filteredProducts;
			if (orderBy) {
				switch (orderBy) {
					case 'popularity_DESC':
						break;
					case 'created_DESC':
						break;
					case 'price_ASC':
						filteredAndOrderedProducts = filteredProducts.sort((left, right) => {
							if (left.__type === 'ConfigurableProduct' && right.__type === 'ConfigurableProduct') {
								return left.price - right.price;
							}

							throw new Error('This should not happen');
						});
						break;
					case 'price_DESC':
						filteredAndOrderedProducts = filteredProducts.sort((left, right) => {
							if (left.__type === 'ConfigurableProduct' && right.__type === 'ConfigurableProduct') {
								return right.price - left.price;
							}

							throw new Error('This should not happen');
						});
						break;
					case 'discount_DESC':
						filteredAndOrderedProducts = filteredProducts.sort((left, right) => {
							if (left.__type === 'ConfigurableProduct' && right.__type === 'ConfigurableProduct') {
								return left.specialPrice / left.price - right.specialPrice / right.price;
							}

							throw new Error('This should not happen');
						});
						break;
				}
			}

			return {
				...connectionFromArray(filteredAndOrderedProducts, args),
				availableFilters: {
					brands: [
						...new Set(
							availableProductsByBrands.map(product => {
								if (product.__type === 'ConfigurableProduct') {
									return product.brand;
								}

								throw new Error('This should not happen');
							}),
						),
					],
					colors: [
						...new Set(
							availableProductsByColors.flatMap(product => {
								if (product.__type === 'ConfigurableProduct') {
									return product.colors;
								}

								throw new Error('This should not happen');
							}),
						),
					],
					price:
						availableProductsByPrice.length === 0
							? { from: 0, to: 0 }
							: availableProductsByPrice.reduce(
									(prev, product) => {
										if (product.__type === 'ConfigurableProduct') {
											return {
												from: Math.min(prev.from, product.price),
												to: Math.max(prev.to, product.price),
											};
										}

										throw new Error('This should not happen');
									},
									{ from: 1000000000, to: -1000000000 },
							  ),
					sizes: [
						...new Set(
							availableProductsBySizes.flatMap(product => {
								if (product.__type === 'ConfigurableProduct') {
									return product.sizes;
								}

								throw new Error('This should not happen');
							}),
						),
					],
				},
			};
		},
	},
};

export default resolvers;
