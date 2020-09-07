import styled from 'styled-components';

export const ProductCardWrapper = styled.a`
	cursor: pointer;
	color: black;
	text-decoration: none;
	display: block;
`;

export const ProductDetails = styled.div`
	margin-top: 12px;
`;

export const ProductImageWrapper = styled.div`
	display: block;
	position: relative;
	background: #f6f6f6;
	width: 100%;
	padding-top: 131.4%;
`;

export const ProductImage = styled.img`
	width: 100%;
	height: 100%;
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
	background: white;
	font-weight: bold;
`;

export const ProductTagCondition = styled(ProductTag)`
	color: green;
`;

export const ProductTagDiscount = styled(ProductTag)`
	color: red;
`;

export const ProductName = styled.div`
	display: block;
	color: black;
	text-decoration: none;
	font-size: 14px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

export const ProductPrice = styled.div`
	color: #999999;
	text-decoration: line-through;
	font-size: 14px;
	white-space: nowrap;
	margin-bottom: 4px;
`;

export const ProductSpecialPrice = styled.div`
	color: red;
	font-size: 14px;
	font-weight: bold;
	white-space: nowrap;
`;

export const ProductBrand = styled.div`
	font-size: 14px;
	font-weight: bold;
	white-space: nowrap;
	margin-bottom: 4px;
`;

export const ProductWishlist = styled.button`
	position: absolute;
	top: 4px;
	right: 4px;
	outline: none;
	border: none;
	background: white;
	padding: 8px;
	border-radius: 100%;
	height: 36px;
	width: 36px;
	cursor: pointer;
`;
