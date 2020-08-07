import React from 'react';

import { FilterBoxTitle, FilterBoxWrapper, FilterColumnWrapper } from './CategoryFilterBase.styles';

interface Props {
	open: boolean;
	title: React.ReactNode;
	content: React.ReactNode;
	wrapperRef: React.RefObject<HTMLLIElement>;
	handleTitleClick: () => void;
}

export const CategoryFilterBaseView: React.FC<Props> = ({ open, title, content, wrapperRef, handleTitleClick }) => {
	return (
		<FilterBoxWrapper open={open} ref={wrapperRef}>
			<FilterBoxTitle
				href="#"
				onClick={e => {
					e.preventDefault();
					handleTitleClick();
				}}
			>
				{title}
			</FilterBoxTitle>
			{open && <FilterColumnWrapper>{content}</FilterColumnWrapper>}
		</FilterBoxWrapper>
	);
};
