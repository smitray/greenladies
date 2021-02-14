import React, { useRef } from 'react';

import Drawer from 'rc-drawer';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

import { IconWrapper } from '../../../../styles/icon-wrapper';
import { SearchResults } from '../../../SearchResults';

const Header = styled.div`
	position: relative;
	padding: 0.5em 0;
	text-align: center;
	font-size: 1.5em;
	line-height: 1.5em;
`;

const CloseButton = styled.button`
	position: absolute;
	right: 0.5em;
	top: 0.25em;
	background: white;
	border: none;
	outline: none;
	padding: 0.5em;
	font-size: 1em;
	cursor: pointer;
`;

interface NavbarMobileSearchDrawerViewProps {
	searchQuery: string;
	onSearchQueryChange: (newSearchQuery: string) => void;
	open: boolean;
	onCloseRequest: () => void;
}

export const NavbarMobileSearchDrawerView = ({
	searchQuery,
	onSearchQueryChange,
	open,
	onCloseRequest,
}: NavbarMobileSearchDrawerViewProps) => {
	const inputEl = useRef<HTMLInputElement>(null);

	return (
		<Drawer
			level={null}
			open={open}
			placement="bottom"
			handler={null}
			height="100%"
			onClose={onCloseRequest}
			afterVisibleChange={open => {
				if (open && inputEl.current) {
					inputEl.current.focus();
				}
			}}
		>
			<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				<div>
					<Header>
						Sök
						<CloseButton onClick={onCloseRequest}>
							<IconWrapper size="1em">
								<FaTimes size="1em" />
							</IconWrapper>
						</CloseButton>
					</Header>
					<div style={{ padding: '0.5em 1em' }}>
						<input
							autoFocus
							ref={inputEl}
							style={{
								border: 'none',
								borderBottom: '1px solid black',
								padding: '0.5em 0',
								fontSize: '1em',
								lineHeight: '1em',
								width: '100%',
								outline: 'none',
							}}
							type="text"
							placeholder="Sök efter produkter, kategorier och märken"
							value={searchQuery}
							onChange={e => onSearchQueryChange(e.target.value)}
						/>
					</div>
				</div>
				<div style={{ padding: '0.5em 1em', flexGrow: 1, overflowY: 'auto' }}>
					<SearchResults query={searchQuery} />
				</div>
			</div>
		</Drawer>
	);
};
