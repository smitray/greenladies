import React, { useEffect, useRef } from 'react';

import { CategoryFilterButton, CategoryFilterDropdown, CategoryFilterWrapper } from './CategoryFilter.styles';

interface Props {
	active?: boolean;
	open?: boolean;
	title: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onClickOutside?: () => void;
}

const CategoryFilterView: React.FC<Props> = ({
	children,
	active = false,
	open = false,
	title,
	onClick,
	onClickOutside,
}) => {
	const wrapperElement = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (onClickOutside && wrapperElement.current && !(wrapperElement.current as any).contains(event.target)) {
				onClickOutside();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClickOutside]);

	return (
		<CategoryFilterWrapper active={active} ref={wrapperElement}>
			<CategoryFilterButton onClick={onClick}>{title}</CategoryFilterButton>
			<CategoryFilterDropdown open={open}>{children}</CategoryFilterDropdown>
		</CategoryFilterWrapper>
	);
};

export default CategoryFilterView;
