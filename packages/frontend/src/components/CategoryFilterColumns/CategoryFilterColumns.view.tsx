import React, { useRef } from 'react';

import { useElementDimensions } from '../../hooks/use-element-dimensions';

import { CloseButton, LeftColumn, MiddleColumn, RightColumn } from './CategoryFilterColumns.styles';

interface Props {
	columns: React.ReactNode[];
	onCloseRequest?: () => void;
}

export const CategoryFilterColumnsView: React.FC<Props> = ({ columns, onCloseRequest }) => {
	const leftColumnRef = useRef<HTMLUListElement>(null);
	const leftColumnDimensions = useElementDimensions(leftColumnRef);

	if (columns.length === 1) {
		return (
			<MiddleColumn>
				{columns[0]}
				<CloseButton onClick={onCloseRequest}>Stäng</CloseButton>
			</MiddleColumn>
		);
	}

	if (columns.length === 2) {
		return (
			<React.Fragment>
				<MiddleColumn>{columns[0]}</MiddleColumn>
				<RightColumn>
					{columns[1]}
					<CloseButton onClick={onCloseRequest}>Stäng</CloseButton>
				</RightColumn>
			</React.Fragment>
		);
	}

	if (columns.length === 3) {
		return (
			<React.Fragment>
				<LeftColumn extractedWidth={leftColumnDimensions.width} ref={leftColumnRef}>
					{columns[0]}
				</LeftColumn>
				<MiddleColumn>{columns[1]}</MiddleColumn>
				<RightColumn>
					{columns[2]}
					<CloseButton onClick={onCloseRequest}>Stäng</CloseButton>
				</RightColumn>
			</React.Fragment>
		);
	}

	throw new Error('Number of columns must be between 1 and 3');
};
