import React, { useCallback, useEffect, useRef } from 'react';

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
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (onCloseRequest && wrapperRef.current && !(wrapperRef.current as any).contains(event.target)) {
				onCloseRequest();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onCloseRequest]);

	const handleTitleClick = useCallback(() => {
		if (onOpenRequest) {
			onOpenRequest();
		}
	}, [onOpenRequest]);

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
