import { ProductModuleResolversType } from '..';
import { ConfigurableProduct } from '../../../magento-sync';
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
				category.productIds.map(id => injector.get(ProductProvider).getConfigurableProduct({ id })),
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

			let availableProductsByBrands: ConfigurableProduct[] | null = null;
			let availableProductsByPrice: ConfigurableProduct[] | null = null;
			let availableProductsByColors: ConfigurableProduct[] | null = null;
			let availableProductsBySizes: ConfigurableProduct[] | null = null;
			let filteredProducts: ConfigurableProduct[] | null = null;
			const { orderBy, filters } = args;
			if (filters) {
				const productsFilteredByBrands =
					filters.brand_in && filters.brand_in.length > 0
						? products.filter(product => {
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								return filters.brand_in!.includes(product.brand);
						  })
						: products;
				const productsFilteredByColors =
					filters.color_in && filters.color_in.length > 0
						? products.filter(product => {
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								return setIntersection(new Set(filters.color_in!), new Set(product.colors)).size > 0;
						  })
						: products;
				const productsFilteredByPrice = filters.price_between
					? products.filter(product => {
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							const { from, to } = filters.price_between!;
							if (from && product.price < from) {
								return false;
							}

							if (to && product.price > to) {
								return false;
							}

							return true;
					  })
					: products;
				const productsFilteredBySizes =
					filters.size_in && filters.size_in.length > 0
						? products.filter(product => {
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								return setIntersection(new Set(filters.size_in!), new Set(product.sizes)).size > 0;
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
						filteredAndOrderedProducts = filteredProducts.sort((left, right) => left.price - right.price);
						break;
					case 'price_DESC':
						filteredAndOrderedProducts = filteredProducts.sort((left, right) => right.price - left.price);
						break;
					case 'discount_DESC':
						filteredAndOrderedProducts = filteredProducts.sort((left, right) => {
							return left.specialPrice / left.price - right.specialPrice / right.price;
						});
						break;
				}
			}

			return {
				...connectionFromArray(filteredAndOrderedProducts, args),
				availableFilters: {
					brands: [...new Set(availableProductsByBrands.map(product => product.brand))],
					colors: [...new Set(availableProductsByColors.flatMap(product => product.colors))],
					price:
						availableProductsByPrice.length === 0
							? { from: 0, to: 0 }
							: availableProductsByPrice.reduce(
									(prev, product) => {
										return {
											from: Math.min(prev.from, product.price),
											to: Math.max(prev.to, product.price),
										};
									},
									{ from: 1000000000, to: -1000000000 },
							  ),
					sizes: [...new Set(availableProductsBySizes.flatMap(product => product.sizes))],
				},
			};
		},
	},
};

export default resolvers;
