import React, { useEffect, useReducer, useState } from 'react';

import { createFragmentContainer, fetchQuery, graphql } from 'react-relay';
import styled from 'styled-components';

import { useRelayEnvironment } from '../../lib/relay-environment';
import { CategoryFilterMultiSelect } from '../CategoryFilterMultiSelect';
import { CategoryFilterRangeSelect } from '../CategoryFilterRangeSelect';
import { CategoryFilterSingleSelect } from '../CategoryFilterSingleSelect';
import { ProductCard } from '../ProductCard';

import { ProductList_category } from './__generated__/ProductList_category.graphql';
import {
	ProductFilterInput,
	ProductListProductsQuery,
	ProductListProductsQueryResponse,
} from './__generated__/ProductListProductsQuery.graphql';

const PRODUCT_LIST_PRODUCTS_QUERY = graphql`
	query ProductListProductsQuery(
		$where: CategoryWhereUniqueInput!
		$orderBy: OrderProductsInput
		$filters: [ProductFilterInput!]
	) {
		category(where: $where) {
			id
			products(orderBy: $orderBy, filters: $filters) {
				edges {
					node {
						id
						...ProductCard_product
					}
				}
				availableFilters {
					__typename
					... on ProductFilterRange {
						field
						label
						min
						max
						unit
					}
					... on ProductFilterSelect {
						field
						label
						values {
							name
							amount
						}
					}
				}
			}
		}
	}
`;

const FiltersContainer = styled.ul`
	display: flex;
	margin: 0;
	padding: 0;
	list-style: none;
`;

type Dictionary<K extends string, T> = { [P in K]?: T };

interface FilterReducerStateRange {
	type: 'range';
	min: number;
	max: number;
	lowerValue: number;
	upperValue: number;
}

interface FilterReducerStateSelect {
	type: 'in';
	values: {
		name: string;
		amount: number;
	}[];
	selectedValues: string[];
}

type FilterReducerState = Dictionary<string, FilterReducerStateRange | FilterReducerStateSelect>;

type FilterReducerAction =
	| {
			type: 'range-update-lower-value';
			payload: {
				field: string;
				value: number;
			};
	  }
	| {
			type: 'range-update-upper-value';
			payload: {
				field: string;
				value: number;
			};
	  }
	| {
			type: 'in-select-item';
			payload: {
				field: string;
				value: string;
			};
	  }
	| {
			type: 'in-deselect-item';
			payload: {
				field: string;
				value: string;
			};
	  };

const filterReducer: React.Reducer<FilterReducerState, FilterReducerAction> = (state, action) => {
	switch (action.type) {
		case 'range-update-lower-value': {
			const filterState = state[action.payload.field];
			if (filterState?.type !== 'range') {
				return state;
			}

			return {
				...state,
				[action.payload.field]: {
					...filterState,
					lowerValue: action.payload.value,
				},
			};
		}
		case 'range-update-upper-value': {
			const filterState = state[action.payload.field];
			if (filterState?.type !== 'range') {
				return state;
			}

			return {
				...state,
				[action.payload.field]: {
					...filterState,
					upperValue: action.payload.value,
				},
			};
		}
		case 'in-select-item': {
			const filterState = state[action.payload.field];
			if (filterState?.type !== 'in') {
				return state;
			}

			return {
				...state,
				[action.payload.field]: {
					...filterState,
					selectedValues: [...filterState.selectedValues, action.payload.value],
				},
			};
		}
		case 'in-deselect-item': {
			const filterState = state[action.payload.field];
			if (filterState?.type !== 'in') {
				return state;
			}

			return {
				...state,
				[action.payload.field]: {
					...filterState,
					selectedValues: filterState.selectedValues.filter(selectedValue => selectedValue !== action.payload.value),
				},
			};
		}
	}
};

const convertRawFiltersToReducerState = (
	rawFilters: ProductListProductsQueryResponse['category']['products']['availableFilters'],
): FilterReducerState => {
	return rawFilters.reduce<FilterReducerState>((reducerState, rawFilter) => {
		switch (rawFilter.__typename) {
			case 'ProductFilterRange': {
				return {
					...reducerState,
					[rawFilter.field]: {
						type: 'range',
						min: rawFilter.min,
						max: rawFilter.max,
						lowerValue: rawFilter.min,
						upperValue: rawFilter.max,
					},
				};
			}
			case 'ProductFilterSelect': {
				return {
					...reducerState,
					[rawFilter.field]: {
						type: 'in',
						values: rawFilter.values.map(({ name, amount }) => ({ name, amount })),
						selectedValues: [],
					},
				};
			}
			default:
				throw new Error();
		}
	}, {});
};

interface Props {
	category: ProductList_category;
}

const ProductListView: React.FC<Props> = ({ category }) => {
	const [products, setProducts] = useState(category.products.edges.map(edge => edge.node));
	const [currentlyOpenedFilter, setCurrentlyOpenedFilter] = useState<string | null>(null);
	const relayEnviroment = useRelayEnvironment();
	const [filtersState, dispatchFilters] = useReducer(
		filterReducer,
		convertRawFiltersToReducerState(category.products.availableFilters),
	);

	const [orderBy, setOrderBy] = useState('popularity_DESC');

	const handleCategoryFilterOpen = (id: string) => () => {
		setCurrentlyOpenedFilter(id);
	};

	const handleCategoryFilterClose = (id: string) => () => {
		setCurrentlyOpenedFilter(currentlyOpenedFilter => (currentlyOpenedFilter === id ? null : currentlyOpenedFilter));
	};

	useEffect(() => {
		const asyncEffect = async () => {
			if (
				orderBy !== 'popularity_DESC' &&
				orderBy !== 'created_DESC' &&
				orderBy !== 'price_ASC' &&
				orderBy !== 'price_DESC' &&
				orderBy !== 'discount_DESC'
			) {
				return;
			}

			const response = await fetchQuery<ProductListProductsQuery>(relayEnviroment, PRODUCT_LIST_PRODUCTS_QUERY, {
				where: {
					id: category.id,
				},
				orderBy,
				filters: Object.entries(filtersState).map<ProductFilterInput>(([field, filter]) => {
					if (!filter) {
						throw new Error();
					}

					if (filter.type === 'range') {
						return {
							field,
							between: {
								from: filter.lowerValue,
								to: filter.upperValue,
							},
						};
					}

					return {
						field,
						in: filter.values.map(({ name }) => name),
					};
				}),
			});

			setProducts(response.category.products.edges.map(edge => edge.node));
		};

		asyncEffect();
	}, [orderBy, filtersState, category.id, relayEnviroment]);

	return (
		<div>
			<FiltersContainer>
				<CategoryFilterSingleSelect
					title="Sortera på"
					items={[
						{ id: 'popularity_DESC', node: 'Popularitet' },
						{ id: 'created_DESC', node: 'Nyheter' },
						{ id: 'price_ASC', node: 'Lägsta pris' },
						{ id: 'price_DESC', node: 'Hösta pris' },
						{ id: 'discount_DESC', node: 'Högsta rabatt' },
					]}
					selectedItemId={orderBy}
					onItemSelected={itemId => {
						setOrderBy(itemId);
					}}
					open={currentlyOpenedFilter === 'order'}
					onOpenRequest={handleCategoryFilterOpen('order')}
					onCloseRequest={handleCategoryFilterClose('order')}
				/>
				{category.products.availableFilters.map(filter => {
					switch (filter.__typename) {
						case 'ProductFilterRange': {
							const filterState = filtersState[filter.field];
							if (filterState?.type !== 'range') {
								return null;
							}

							return (
								<CategoryFilterRangeSelect
									key={filter.field}
									title={filter.label}
									min={filter.min}
									max={filter.max}
									lowerValue={filterState.lowerValue}
									upperValue={filterState.upperValue}
									onLowerValueChange={newLowerValue => {
										dispatchFilters({
											type: 'range-update-lower-value',
											payload: { field: filter.field, value: newLowerValue },
										});
									}}
									onUpperValueChange={newUpperValue => {
										dispatchFilters({
											type: 'range-update-upper-value',
											payload: { field: filter.field, value: newUpperValue },
										});
									}}
									open={currentlyOpenedFilter === filter.field}
									onOpenRequest={handleCategoryFilterOpen(filter.field)}
									onCloseRequest={handleCategoryFilterClose(filter.field)}
								/>
							);
						}
						case 'ProductFilterSelect': {
							const filterState = filtersState[filter.field];
							if (filterState?.type !== 'in') {
								return null;
							}

							return (
								<CategoryFilterMultiSelect
									key={filter.field}
									title={filter.label}
									items={filter.values.map(value => ({
										id: value.name,
										node: (
											<div>
												{value.name} ({value.amount})
											</div>
										),
									}))}
									selectedItemIds={filterState.selectedValues}
									onItemSelected={itemId => {
										dispatchFilters({
											type: 'in-select-item',
											payload: { field: filter.field, value: itemId },
										});
									}}
									onItemUnselected={itemId => {
										dispatchFilters({
											type: 'in-deselect-item',
											payload: { field: filter.field, value: itemId },
										});
									}}
									open={currentlyOpenedFilter === filter.field}
									onOpenRequest={handleCategoryFilterOpen(filter.field)}
									onCloseRequest={handleCategoryFilterClose(filter.field)}
								/>
							);
						}
						default:
							return null;
					}
				})}
			</FiltersContainer>
			{products.length > 0 && (
				<div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
					{products.map(product => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</div>
	);
};

export default createFragmentContainer(ProductListView, {
	category: graphql`
		fragment ProductList_category on Category {
			id
			products {
				edges {
					node {
						id
						...ProductCard_product
					}
				}
				availableFilters {
					__typename
					... on ProductFilterRange {
						field
						label
						min
						max
						unit
					}
					... on ProductFilterSelect {
						field
						label
						values {
							name
							amount
						}
					}
				}
			}
		}
	`,
});
