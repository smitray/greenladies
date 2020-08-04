import React, { useMemo } from 'react';

import { CategoryFilterBase } from '../CategoryFilterBase';
import { CategoryFilterColumnListItem, CategoryFilterColumns } from '../CategoryFilterColumns';

interface Props {
	open: boolean;
	onOpenRequest?: () => void;
	onCloseRequest?: () => void;
	title: string;
	selectedItemId: string;
	items: {
		id: string;
		node: React.ReactNode;
	}[];
	onItemSelected?: (itemId: string) => void;
}

export const CategoryFilterSingleSelectView: React.FC<Props> = ({
	open,
	onOpenRequest,
	onCloseRequest,
	title,
	selectedItemId,
	items,
	onItemSelected,
}) => {
	const itemChunks = useMemo(() => {
		if (items.length <= 10) {
			return [items];
		} else if (items.length <= 20) {
			return [items.slice(0, Math.ceil(items.length / 2)), items.slice(Math.ceil(items.length / 2))];
		} else {
			return [
				items.slice(0, Math.ceil(items.length / 3)),
				items.slice(Math.ceil(items.length / 3), Math.ceil((items.length / 3) * 2)),
				items.slice(Math.ceil((items.length / 3) * 2)),
			];
		}
	}, [items]);
	return (
		<CategoryFilterBase
			open={open}
			onOpenRequest={onOpenRequest}
			onCloseRequest={onCloseRequest}
			title={title}
			content={
				<CategoryFilterColumns
					onCloseRequest={onCloseRequest}
					columns={itemChunks.map((chunk, index) => (
						<React.Fragment key={index}>
							{chunk.map(item => (
								<CategoryFilterColumnListItem
									key={item.id}
									selected={item.id === selectedItemId}
									onClick={() => {
										if (onItemSelected) {
											onItemSelected(item.id);
										}

										if (onCloseRequest) {
											onCloseRequest();
										}
									}}
								>
									{item.node}
								</CategoryFilterColumnListItem>
							))}
						</React.Fragment>
					))}
				/>
			}
		/>
	);
};
