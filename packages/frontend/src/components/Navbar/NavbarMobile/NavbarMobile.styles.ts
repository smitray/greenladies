import styled from 'styled-components';

export const NavRow = styled.div`
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #ddd;
	height: 48px;
	position: fixed;
	width: 100%;
	background: white;
	z-index: 10;
`;

export const NavGroup = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	align-items: center;

	> li {
		cursor: pointer;
	}
`;

export const RightNavGroup = styled(NavGroup)`
	margin-right: 8px;

	> li {
		padding-top: 12px;
		padding-bottom: 12px;
		padding-left: 4px;
		padding-right: 4px;
	}

	@media (min-width: 641px) {
		margin-right: 4px;

		> li {
			padding-left: 8px;
			padding-right: 8px;
		}
	}
`;

export const NavGroupHamburgerMenuItem = styled.li`
	border-right: 1px solid #ddd;
	padding: 12px;
`;

export const NavGroupLogoItem = styled.li`
	margin: 4px 12px 0 12px;
`;

export const LogoImage = styled.img`
	height: 24px;
`;

export const NavGroupWishlistItem = styled.li`
	padding-top: 14px;
	padding-bottom: 14px;
`;
