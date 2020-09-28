import styled from 'styled-components';

export const NoResult = styled.div`
	padding: 48px 0;
	text-align: center;
`;

export const SectionsWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 2em;

	@media (min-width: 641px) {
		grid-template-columns: 1fr 1fr;
	}
`;

export const Section = styled.div``;

export const ProductSection = styled(Section)`
	@media (min-width: 641px) {
		grid-column: 1 / 3;
	}
`;

export const SectionHeader = styled.div`
	font-weight: bold;
	margin-bottom: 1em;
`;

export const SectionItemsContainer = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

export const SectionItemLink = styled.a`
	display: block;
	color: black;
	text-decoration: none;
	padding: 0.25em 0;
`;

export const SectionProductsContainer = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;

	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1em;

	@media (min-width: 641px) {
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}

	@media (min-width: 961px) {
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		grid-template-rows: 100%;
		grid-auto-rows: 0;
	}
	margin: 0 -0.5em;
	overflow: hidden;
`;

export const SectionProductWrapper = styled.li`
	font-size: 0.9em;
`;

export const SectionProductLink = styled.a`
	display: block;
	color: black;
	text-decoration: none;
`;

export const ProductImageStyleWrapper = styled.div`
	background: #f6f6f6;
	margin-bottom: 0.5em;
`;

export const ProductImagePositionWrapper = styled.div`
	position: relative;
	padding-top: 131.4%;
`;

export const ProductImage = styled.img`
  position: absolute;
  top 0;
  right 5%;
  bottom: 0;
  left: 5%;
  width: 90%;
`;

export const ProductName = styled.div`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-bottom: 0.25em;
`;

export const ProductBrand = styled(ProductName)`
	font-weight: bold;
`;

export const ProductOriginalPrice = styled.span`
	color: grey;
	text-decoration: line-through;
`;

export const ProductSpecialPrice = styled.span`
	color: red;
	margin-left: 0.5em;
`;
