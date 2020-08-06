import { ProductModuleResolversType } from '..';
import { GQLProductFilter, GQLProductFilterInput } from '../../../__generated__/types';
import { Product } from '../../../magento-sync';
import { connectionFromArray } from '../../../utils/relay';
import { CategoryProvider } from '../../category/category.provider';
import { ProductProvider } from '../product.provider';

type Dictionary<K extends string, T> = { [P in K]?: T };

interface FilterType {
	position: number;
	field: string;
	label: string;
	valueType: 'string' | 'number';
	filterType: 'in' | 'range';
}

const registeredFilters: FilterType[] = [
	// {
	// 	position: 0,
	// 	field: 'size',
	// 	label: 'Storlek',
	// 	valueType: 'string',
	// 	filterType: 'in',
	// },
	// {
	// 	position: 1,
	// 	field: 'brand',
	// 	label: 'Märke',
	// 	valueType: 'string',
	// 	filterType: 'in',
	// },
	// {
	// 	position: 2,
	// 	field: 'colour',
	// 	label: 'Färg',
	// 	valueType: 'string',
	// 	filterType: 'in',
	// },
	{
		position: 3,
		field: 'price',
		label: 'Pris',
		valueType: 'number',
		filterType: 'range',
	},
];

interface FilteredProducts {
	field: string;
	productIds: Set<string>;
}

function applyFiltersIndividually(products: Product[], filters: GQLProductFilterInput[]): FilteredProducts[] {
	return filters.map(filter => {
		const registeredFilter = registeredFilters.find(registeredFilter => registeredFilter.field === filter.field);
		if (!registeredFilter) {
			throw new Error('Cannot filter on field ' + filter.field);
		}

		if (filter.between) {
			if (registeredFilter.valueType !== 'number') {
				throw new Error('Cannot use range filter on ' + filter.field + ' must be a numeric field');
			}

			return {
				field: filter.field,
				productIds: new Set(
					products
						.filter(product => {
							const value = (product as any)[registeredFilter.field] as number;
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							return value >= filter.between!.from && value <= filter.between!.to;
						})
						.map(({ id }) => id),
				),
			};
		} else if (filter.in) {
			if (registeredFilter.valueType !== 'string') {
				throw new Error('Cannot use in filter on ' + filter.field + ', must be a string-like field');
			}

			return {
				field: filter.field,
				productIds: new Set(
					products
						.filter(product => {
							const value = (product as any)[registeredFilter.field] as string | number;
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							return filter.in!.includes(String(value));
						})
						.map(({ id }) => id),
				),
			};
		} else {
			throw new Error('A filter must be selected for ' + filter.field);
		}
	});
}

function setIntersection(first: Set<string>, second: Set<string>) {
	return new Set([...first].filter(x => second.has(x)));
}

// Source: https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array
function notNull<TValue>(value: TValue | null): value is TValue {
	return value !== null;
}

function combineFilters(listOfFilteredProductsLists: FilteredProducts[]): FilteredProducts[] {
	if (listOfFilteredProductsLists.length < 2) {
		return listOfFilteredProductsLists;
	}

	return listOfFilteredProductsLists
		.map((filteredProducts, _index, listOfFilteredProductsListsInner) => {
			return listOfFilteredProductsListsInner
				.filter(({ field }) => field !== filteredProducts.field)
				.sort((left, right) => left.productIds.size - right.productIds.size)
				.reduce<FilteredProducts | null>((prev, current) => {
					if (prev === null) {
						return current;
					}

					return {
						field: filteredProducts.field,
						productIds: setIntersection(prev.productIds, current.productIds),
					};
				}, null);
		})
		.filter(notNull);
}

function extractFilterInformation(productsMap: Map<string, Product>, filters: FilteredProducts[]): GQLProductFilter[] {
	return filters.map(filter => {
		const registeredFilter = registeredFilters.find(({ field }) => field === filter.field);
		if (!registeredFilter) {
			throw new Error('Invalid filter has infiltrated the filters');
		}

		const products = Array.from(filter.productIds).map(id => {
			const p = productsMap.get(id);
			if (!p) {
				throw new Error('Product id has been modified');
			}

			return p;
		});

		switch (registeredFilter.filterType) {
			case 'in': {
				const valuesDictionary = products.reduce<Dictionary<string, number>>((prev, current) => {
					const value = (current as any)[registeredFilter.field] as number | string;

					const count = prev[value];
					if (count) {
						return {
							...prev,
							[value]: count + 1,
						};
					}

					return {
						...prev,
						[value]: 1,
					};
				}, {});
				const values = Object.entries(valuesDictionary).map(([name, amount]) => {
					return {
						name,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						amount: amount!,
					};
				});

				return {
					__typename: 'ProductFilterSelect',
					field: registeredFilter.field,
					label: registeredFilter.label,
					values,
				};
			}
			case 'range': {
				const { min, max } = products.reduce(
					(prev, current) => {
						const value = (current as any)[registeredFilter.field] as number;
						return {
							min: Math.min(value, prev.min),
							max: Math.max(value, prev.max),
						};
					},
					{ min: 1000000000, max: -1000000000 },
				);
				return {
					__typename: 'ProductFilterRange',
					field: registeredFilter.field,
					label: registeredFilter.label,
					unit: 'kr',
					min,
					max,
				};
			}
			default:
				throw new Error('Some option has not been defined');
		}
	});
}

const resolvers: ProductModuleResolversType = {
	Category: {
		products: async ({ id }, args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);
			const products = await Promise.all(category.productIds.map(id => injector.get(ProductProvider).getProduct(id)));
			if (products.length === 0) {
				return {
					...connectionFromArray(products, args),
					availableFilters: [],
				};
			}

			const { orderBy, filters } = args;

			let appliedFilters: FilteredProducts[] = [];
			if (filters) {
				appliedFilters = combineFilters(applyFiltersIndividually(products, filters));
			}

			const productsMap = new Map(products.map(product => [product.id, product]));
			const filteredProductsIds =
				appliedFilters.length === 0
					? products.map(({ id }) => id)
					: Array.from(
							appliedFilters.reduce((prev, current, index) => {
								if (index === 0) {
									return current.productIds;
								}
								return setIntersection(prev, current.productIds);
							}, new Set<string>()),
					  );
			const filteredProducts = filteredProductsIds.map(id => {
				const p = productsMap.get(id);
				if (!p) {
					throw new Error('Product id has been modified');
				}

				return p;
			});

			registeredFilters.forEach(registeredFilter => {
				if (!appliedFilters.find(({ field }) => field === registeredFilter.field)) {
					appliedFilters.push({
						field: registeredFilter.field,
						productIds: new Set(filteredProductsIds),
					});
				}
			});

			let filteredAndOrderedProducts = filteredProducts;
			if (orderBy) {
				if (orderBy === 'price_ASC') {
					filteredAndOrderedProducts = filteredProducts.sort((left, right) => left.price - right.price);
				}

				if (orderBy === 'price_DESC') {
					filteredAndOrderedProducts = filteredProducts.sort((left, right) => right.price - left.price);
				}
			}

			return {
				...connectionFromArray(
					filteredAndOrderedProducts.map(({ id }) => ({ id })),
					args,
				),
				availableFilters: extractFilterInformation(productsMap, appliedFilters).sort((left, right) => {
					const leftRegisteredFilter = registeredFilters.find(({ field }) => field === left.field);
					if (!leftRegisteredFilter) {
						throw new Error('Invalid filter has infiltrated the filters');
					}

					const rightRegisteredFilter = registeredFilters.find(({ field }) => field === right.field);
					if (!rightRegisteredFilter) {
						throw new Error('Invalid filter has infiltrated the filters');
					}

					return leftRegisteredFilter.position - rightRegisteredFilter.position;
				}),
			};
		},
	},
};

export default resolvers;
