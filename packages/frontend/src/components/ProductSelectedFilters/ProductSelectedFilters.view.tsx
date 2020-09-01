import React from 'react';

import { FaTimes, FaTrashAlt } from 'react-icons/fa';
import styled from 'styled-components';

const FiltersContainer = styled.ul`
	display: flex;
	margin: 0 0 12px 0;
	padding: 0;
	list-style: none;
`;

const RemoveFilterButton = styled.button`
	outline: none;
	padding: 8px 24px 8px 8px;
	background: white;
	border: 1px solid #e6e6e6;
	cursor: pointer;
	margin-right: 4px;
	position: relative;

	&:hover {
		background: #e6e6e6;
	}
`;

interface ProductSelectedFiltersViewProps {
	selectedFilters: {
		filter: string;
		code: string;
		display: string;
	}[];
	onFilterRemove: (filter: string, code: string) => void;
	onClearFilters: () => void;
}

export const ProductSelectedFiltersView = ({
	selectedFilters,
	onFilterRemove,
	onClearFilters,
}: ProductSelectedFiltersViewProps) => {
	return (
		<div>
			{selectedFilters.length > 0 && (
				<FiltersContainer>
					<RemoveFilterButton onClick={() => onClearFilters()}>
						Ta bort filter
						<div
							style={{
								position: 'absolute',
								top: '0',
								bottom: '0',
								right: '4px',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<div style={{ width: '16px', height: '16px' }}>
								<FaTrashAlt size="16" />
							</div>
						</div>
					</RemoveFilterButton>
					{selectedFilters.map((selectedFilter, index) => (
						<RemoveFilterButton key={index} onClick={() => onFilterRemove(selectedFilter.filter, selectedFilter.code)}>
							{selectedFilter.display}
							<div
								style={{
									position: 'absolute',
									top: '0',
									bottom: '0',
									right: '4px',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<div style={{ width: '16px', height: '16px' }}>
									<FaTimes size="16" />
								</div>
							</div>
						</RemoveFilterButton>
					))}
				</FiltersContainer>
			)}
		</div>
	);
};
