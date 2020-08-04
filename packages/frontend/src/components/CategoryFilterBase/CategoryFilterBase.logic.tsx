import React, { useCallback, useRef } from 'react';

import { useClickOutside } from '../../hooks/use-click-outside';

import { CategoryFilterBaseView } from './CategoryFilterBase.view';

interface Props {
	open: boolean;
	onOpenRequest?: () => void;
	onCloseRequest?: () => void;
	title: React.ReactNode;
	content: React.ReactNode;
}

export const CategoryFilterBaseLogic: React.FC<Props> = ({ open, onOpenRequest, onCloseRequest, title, content }) => {
	const wrapperRef = useRef<HTMLLIElement>(null);
	useClickOutside(wrapperRef, () => {
		if (onCloseRequest) {
			onCloseRequest();
		}
	});

	const handleTitleClick = useCallback(() => {
		if (open && onCloseRequest) {
			onCloseRequest();
		}

		if (!open && onOpenRequest) {
			onOpenRequest();
		}
	}, [open, onOpenRequest, onCloseRequest]);

	return (
		<CategoryFilterBaseView
			open={open}
			handleTitleClick={handleTitleClick}
			title={title}
			content={content}
			wrapperRef={wrapperRef}
		/>
	);
};
