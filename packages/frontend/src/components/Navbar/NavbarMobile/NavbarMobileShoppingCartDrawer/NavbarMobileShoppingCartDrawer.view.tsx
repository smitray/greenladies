import React from 'react';

import Drawer from 'rc-drawer';
import { FaTimes } from 'react-icons/fa';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { useShoppingCartModal } from '../../../../contexts/shopping-cart-model-context';
import { useWindowDimensions } from '../../../../hooks/use-window-dimensions';
import { IconWrapper } from '../../../../styles/icon-wrapper';
import { NORMAL_TABLET_SIZE } from '../../../../utils/device-size';
import { ShoppingCart } from '../../../ShoppingCart';

import { NavbarMobileShoppingCartDrawer_cart } from './__generated__/NavbarMobileShoppingCartDrawer_cart.graphql';

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

interface NavbarMobileShoppingCartDrawerViewProps {
	cart: NavbarMobileShoppingCartDrawer_cart;
	open: boolean;
}

const NavbarMobileShoppingCartModalView = ({ cart, open }: NavbarMobileShoppingCartDrawerViewProps) => {
	const { width: windowWidth } = useWindowDimensions();

	const { close } = useShoppingCartModal();

	return (
		<Drawer
			level={null}
			open={open}
			placement="right"
			handler={null}
			width={windowWidth > NORMAL_TABLET_SIZE ? NORMAL_TABLET_SIZE + 'px' : '100%'}
			onClose={close}
		>
			<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
				<Header>
					Varukorg
					<CloseButton onClick={close}>
						<IconWrapper size="1em">
							<FaTimes size="1em" />
						</IconWrapper>
					</CloseButton>
				</Header>
				<ShoppingCart cart={cart} isMobile />
			</div>
		</Drawer>
	);
};

export default createFragmentContainer(NavbarMobileShoppingCartModalView, {
	cart: graphql`
		fragment NavbarMobileShoppingCartDrawer_cart on ShoppingCart {
			...ShoppingCart_cart
		}
	`,
});
