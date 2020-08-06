import styled from 'styled-components';

export const ProductDetails = styled.div`
	padding-top: 20px;
`;

export const ProductImageWrapper = styled.div`
	position: relative;
	background: #eaeaea;
`;

export const ProductImage = styled.img`
	display: block;
	height: 280px;
`;

export const ProductTagsContainer = styled.ul`
	top: 0;
	position: absolute;
	padding: 0;
	margin: 0;
	list-style: none;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

const ProductTag = styled.li`
	margin-top: 6px;
	padding: 2px 6px;
	font-size: 12px;
	text-transform: uppercase;
`;

export const ProductTagCondition = styled(ProductTag)`
	background: #65c800;
	color: white;
`;

export const ProductTagDiscount = styled(ProductTag)`
	background: white;
	color: red;
`;

export const ProductName = styled.h1`
	font-size: 20px;
	font-weight: bold;
	margin: 0 0 8px 0;
`;

export const ProductPrice = styled.span`
	color: #999999;
	text-decoration: line-through;
`;

export const ProductSpecialPrice = styled.span`
	margin-left: 16px;
`;

export const ProductBrand = styled.span`
	color: #777777;
`;
