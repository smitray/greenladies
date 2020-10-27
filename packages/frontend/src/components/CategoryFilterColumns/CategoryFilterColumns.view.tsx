import React, { useRef } from 'react';

import { useElementDimensions } from '../../hooks/use-element-dimensions';

import {
	CloseButton,
	CloseButtonWrapper,
	Column,
	ColumnContainer,
	ColumnWrapper,
} from './CategoryFilterColumns.styles';

interface Props {
	columns: React.ReactNode[];
	onCloseRequest?: () => void;
}

export const CategoryFilterColumnsView: React.FC<Props> = ({ columns, onCloseRequest }) => {
	const leftColumnRef = useRef<HTMLUListElement>(null);
	const leftColumnDimensions = useElementDimensions(leftColumnRef);

	if (columns.length === 1) {
		return (
			<ColumnWrapper extractedWidth={0}>
				<ColumnContainer>
					<Column>{columns[0]}</Column>
				</ColumnContainer>
				<CloseButtonWrapper>
					<CloseButton onClick={onCloseRequest}>Stäng</CloseButton>
				</CloseButtonWrapper>
			</ColumnWrapper>
		);
	}

	if (columns.length === 2) {
		return (
			<ColumnWrapper extractedWidth={0}>
				<ColumnContainer>
					<Column>{columns[0]}</Column>
					<Column>{columns[1]}</Column>
				</ColumnContainer>
				<CloseButtonWrapper>
					<CloseButton onClick={onCloseRequest}>Stäng</CloseButton>
				</CloseButtonWrapper>
			</ColumnWrapper>
		);
	}

	if (columns.length === 3) {
		return (
			<ColumnWrapper extractedWidth={leftColumnDimensions.width}>
				<ColumnContainer>
					<Column ref={leftColumnRef}>{columns[0]}</Column>
					<Column>{columns[1]}</Column>
					<Column>{columns[2]}</Column>
				</ColumnContainer>
				<CloseButtonWrapper>
					<CloseButton onClick={onCloseRequest}>Stäng</CloseButton>
				</CloseButtonWrapper>
			</ColumnWrapper>
		);
	}

	throw new Error('Number of columns must be between 1 and 3');
};
