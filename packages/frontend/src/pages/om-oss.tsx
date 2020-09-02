import React from 'react';

import styled from 'styled-components';

import { MyNextPage } from '../lib/types';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 24px 40px;
	margin: 0 auto;
	align-items: flex-start;
`;

const Paragraph = styled.p`
	color: #777;
	font-size: 16px;
	line-height: 24px;
	margin-bottom: 24px;
`;

const AboutUs: MyNextPage = () => {
	return (
		<CenterWrapper>
			<h1 style={{ textAlign: 'center', fontSize: '48px', marginBottom: '48px' }}>Om Green Ladies</h1>
			<Paragraph>
				Green Ladies är en modebutik för kvinnor som grundades med det bakomliggande syftet att bidra till en hållbar
				konsumtion inom dammode. Vår vision är att vara ett komplement till den befintliga branschen och den
				traditionella shoppingen, där vi erbjuder möjligheten att främja en cirkulär ekonomi.
			</Paragraph>
			<Paragraph>
				Vårt mål är att samarbeta med varumärken som står för kvalitet och en hållbarhet där varumärket har tänkt igenom
				sin produktion och klimatavtryck.
			</Paragraph>
			<Paragraph>
				Syftet är att erbjuda möjligheten att hitta kombinationer av nya plagg och vintage för att kunna skapa en
				individuell stil. Vi strävar alltid efter att ha ett trendigt, varierat sortiment med kvalitetsplagg som skapar
				en fin balans i garderoben.
			</Paragraph>
			<Paragraph>
				Genom olika samarbeten med ledande varumärken och designers har vi samlat plagg från tidigare kollektioner samt
				en del provkollektioner. Vi strävar efter att ge kunden möjlighet att ta del av de kollektionerna så att de inte
				går till spillo, till bra priser. Vi erbjuder också plagg och accessoarer som har burits av någon ett fåtal
				gånger som vi genom en noggrann kontroll handplockar. Det kan exempelvis vara ett plagg som kanske hängt kvar i
				garderoben men inte blivit omodernt eller sämre skick. Därav kan det plagget komma till sin rätt hos en ny
				ägare. På ett smidigt sätt förlänger vi plaggens livslängd hos en ny ägare. Välkommen att bli en del av Green
				Ladies!
			</Paragraph>
		</CenterWrapper>
	);
};

export default AboutUs;
