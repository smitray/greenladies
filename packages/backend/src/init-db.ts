import { getRepository } from 'typeorm';

import { CustomPage } from './entities/custom-page';
import { CustomPageBannerComponent } from './entities/custom-page-banner-component';
import { CustomPageProductCarouselComponent } from './entities/custom-page-product-carousel-component';
import { CustomPageSection } from './entities/custom-page-section';
import { CustomPageTabComponent } from './entities/custom-page-tab-component';
import { CustomPageTabComponentSection } from './entities/custom-page-tab-component-section';
import { Link } from './entities/link';
import { MegamenuSection } from './entities/megamenu-section';
import { MegamenuSectionItem } from './entities/megamenu-section-item';
import { MegamenuToplevelItem } from './entities/megamenu-toplevel-item';

export async function initMegamenu() {
	const megamenuToplevelItemRepository = getRepository(MegamenuToplevelItem);
	const megamenuSectionRepository = getRepository(MegamenuSection);
	const megamenuSectionItemRepository = getRepository(MegamenuSectionItem);
	const linkRepository = getRepository(Link);

	const toplevelItems = await megamenuToplevelItemRepository.find();

	const a = [
		{
			name: 'Kläder',
			position: 0,
			link: {
				type: 'category',
				to: '6',
			},
			sections: [
				{
					name: 'Alla kläder',
					position: 0,
					items: [
						{
							name: 'Byxor',
							position: 0,
							link: {
								type: 'category',
								to: '7',
							},
						},
						{
							name: 'Jeans',
							position: 1,
							link: {
								type: 'category',
								to: '8',
							},
						},
						{
							name: 'Mer byxor',
							position: 2,
							link: {
								type: 'category',
								to: '9',
							},
						},
					],
				},
				{
					name: 'Alla 123',
					position: 1,
					items: [
						{
							name: 'Byxor',
							position: 0,
							link: {
								type: 'category',
								to: '7',
							},
						},
						{
							name: 'Jeans',
							position: 1,
							link: {
								type: 'category',
								to: '8',
							},
						},
						{
							name: 'Mer byxor',
							position: 2,
							link: {
								type: 'category',
								to: '9',
							},
						},
						{
							name: 'Byxor',
							position: 3,
							link: {
								type: 'category',
								to: '7',
							},
						},
						{
							name: 'Jeans',
							position: 4,
							link: {
								type: 'category',
								to: '8',
							},
						},
						{
							name: 'Mer byxor',
							position: 5,
							link: {
								type: 'category',
								to: '9',
							},
						},
					],
				},
				{
					name: 'Alla kläder',
					position: 2,
					items: [
						{
							name: 'Byxor',
							position: 0,
							link: {
								type: 'external',
								to: 'http://google.com',
							},
						},
						{
							name: 'Jeans',
							position: 1,
							link: {
								type: 'custom',
								to: '/home/test',
							},
						},
						{
							name: 'Mer byxor',
							position: 2,
							link: {
								type: 'product',
								to: '1058',
							},
						},
					],
				},
				{
					name: 'Alla 123',
					position: 3,
					items: [
						{
							name: 'Byxor',
							position: 0,
							link: {
								type: 'category',
								to: '7',
							},
						},
						{
							name: 'Jeans',
							position: 1,
							link: {
								type: 'category',
								to: '8',
							},
						},
						{
							name: 'Mer byxor',
							position: 2,
							link: {
								type: 'category',
								to: '9',
							},
						},
						{
							name: 'Byxor',
							position: 3,
							link: {
								type: 'category',
								to: '7',
							},
						},
						{
							name: 'Jeans',
							position: 4,
							link: {
								type: 'category',
								to: '8',
							},
						},
						{
							name: 'Mer byxor',
							position: 5,
							link: {
								type: 'category',
								to: '9',
							},
						},
					],
				},
			],
		},
	];
	if (toplevelItems.length === 0) {
		await Promise.all(
			a.map(async toplevelItem => {
				let link = linkRepository.create(toplevelItem.link);
				link = await linkRepository.save(link);

				const sections = await Promise.all(
					toplevelItem.sections.map(async section => {
						const items = await Promise.all(
							section.items.map(async item => {
								let link = linkRepository.create(item.link);
								link = await linkRepository.save(link);

								const r = megamenuSectionItemRepository.create({
									name: item.name,
									position: item.position,
									link,
								});
								return megamenuSectionItemRepository.save(r);
							}),
						);

						const r = megamenuSectionRepository.create({
							name: section.name,
							position: section.position,
							items,
						});
						return megamenuSectionRepository.save(r);
					}),
				);

				const r = megamenuToplevelItemRepository.create({
					name: toplevelItem.name,
					position: toplevelItem.position,
					link,
					sections,
				});
				return megamenuToplevelItemRepository.save(r);
			}),
		);
	}
}

export async function initCustomPages() {
	const customPageRepository = getRepository(CustomPage);
	const customPageSectionRepository = getRepository(CustomPageSection);

	const cuomstPageProductCarouselComponentRepo = getRepository(CustomPageProductCarouselComponent);

	const linkRepository = getRepository(Link);
	const customPageBannerComponentRepository = getRepository(CustomPageBannerComponent);

	// Index page
	const banner1Link = await linkRepository.save({ type: 'category', to: '6' });
	const banner1 = await customPageBannerComponentRepository.save({
		title: 'DENIM FEVER',
		subtitle: 'SHOPPA',
		link: banner1Link,
		imagePath: '/images/denim-fever-banner.jpg',
		mobileImagePath: '/images/denim-fever-banner.jpg',
	});

	const section1 = await customPageSectionRepository.save({
		type: 'banner',
		componentId: banner1.id,
		position: 0,
	});

	const carousel1 = await cuomstPageProductCarouselComponentRepo.save({
		title: 'DENIM FEVER',
		subtitle: 'Brallor för hela högen',
		categoryId: '6',
	});

	const section2 = await customPageSectionRepository.save({
		type: 'product-carousel',
		componentId: carousel1.id,
		position: 1,
	});

	const banner2Link = await linkRepository.save({ type: 'category', to: '6' });
	const banner2 = await customPageBannerComponentRepository.save({
		title: 'Färgglada höstnyheter',
		subtitle: 'SE MER',
		link: banner2Link,
		imagePath: '/images/tennis-banner.jpg',
		mobileImagePath: '/images/tennis-banner.jpg',
	});

	const section3 = await customPageSectionRepository.save({
		type: 'banner',
		componentId: banner2.id,
		position: 2,
	});

	const carousel2 = await cuomstPageProductCarouselComponentRepo.save({
		title: 'När sommar möter höst',
		subtitle: 'Stiligt och svalt',
		categoryId: '6',
	});

	const section4 = await customPageSectionRepository.save({
		type: 'product-carousel',
		componentId: carousel2.id,
		position: 3,
	});

	const banner3Link = await linkRepository.save({ type: 'category', to: '6' });
	const banner3 = await customPageBannerComponentRepository.save({
		title: 'Naturfärgade & mjuka vardagsfavoriter',
		subtitle: 'UTFORSKA',
		link: banner3Link,
		imagePath: '/images/natural-colors-banner.jpg',
		mobileImagePath: '/images/natural-colors-banner.jpg',
	});

	const section5 = await customPageSectionRepository.save({
		type: 'banner',
		componentId: banner3.id,
		position: 4,
	});

	const carousel3 = await cuomstPageProductCarouselComponentRepo.save({
		title: 'Nedsatta priser',
		subtitle: 'De bästa fynden just nu',
		categoryId: '6',
	});

	const section6 = await customPageSectionRepository.save({
		type: 'product-carousel',
		componentId: carousel3.id,
		position: 5,
	});

	const banner4Link = await linkRepository.save({ type: 'category', to: '6' });
	const banner4 = await customPageBannerComponentRepository.save({
		title: 'Utvalt VECKANS FAVORITER',
		subtitle: 'SE MER',
		link: banner4Link,
		imagePath: '/images/vintage-banner.jpg',
		mobileImagePath: '/images/vintage-banner.jpg',
	});

	const section7 = await customPageSectionRepository.save({
		type: 'banner',
		componentId: banner4.id,
		position: 6,
	});

	const carousel4 = await cuomstPageProductCarouselComponentRepo.save({
		title: '',
		subtitle: '',
		categoryId: '6',
	});

	const section8 = await customPageSectionRepository.save({
		type: 'product-carousel',
		componentId: carousel4.id,
		position: 7,
	});

	await customPageRepository.save({
		path: '/',
		sections: [section1, section2, section3, section4, section5, section6, section7, section8],
	});

	// Customer service page
	const customPageTabComponentRepo = getRepository(CustomPageTabComponent);
	const customPageTabComponentSectionRepo = getRepository(CustomPageTabComponentSection);

	const tab1 = await customPageTabComponentSectionRepo.save({
		key: 'om',
		title: 'Om Green Ladies',
		body: `
Green Ladies är en modebutik för kvinnor som grundades med det bakomliggande syftet att bidra till en hållbar konsumtion inom dammode. Vår vision är att vara ett komplement till den befintliga branschen och den traditionella shoppingen, där vi erbjuder möjligheten att främja en cirkulär ekonomi.

Vårt mål är att samarbeta med varumärken som står för kvalitet och en hållbarhet där varumärket har tänkt igenom sin produktion och klimatavtryck. 

Syftet är att erbjuda möjligheten att hitta kombinationer av nya plagg och vintage för att kunna skapa en individuell stil. Vi strävar alltid efter att ha ett trendigt, varierat sortiment med kvalitetsplagg som skapar en fin balans i garderoben.

Genom olika samarbeten med ledande varumärken och designers har vi samlat plagg från tidigare kollektioner samt en del provkollektioner. Vi strävar efter att ge kunden möjlighet att ta del av de kollektionerna så att de inte går till spillo, till bra priser. 
Vi erbjuder också plagg och accessoarer som har burits av någon ett fåtal gånger som vi genom en noggrann kontroll handplockar. Det kan exempelvis vara ett plagg som kanske hängt kvar i garderoben men inte blivit omodernt eller sämre skick. Därav kan det plagget komma till sin rätt hos en ny ägare. På ett smidigt sätt förlänger vi plaggens livslängd hos en ny ägare.
Välkommen att bli en del av Green Ladies!
      `,
		position: 0,
	});

	const tab2 = await customPageTabComponentSectionRepo.save({
		key: 'kontakt',
		title: 'Kontakt',
		body: `
Vi som tillhandahåller www.greenladies.se är KUDETA eCommerce Group AB, med adress August Barks Gata 25, 421 32 Västra Frölunda, Sverige. Vårt organisationsnummer är 559165-2614.

Har du några frågor eller funderingar är du välkommen att kontakta vår kundrådgivning via mail hej@greenladies.se. Vi besvarar ditt mail inom 24 timmar på vardagar.
      `,
		position: 1,
	});

	const tab3 = await customPageTabComponentSectionRepo.save({
		key: 'betalning',
		title: 'Betalning',
		body: `
Alla priser som anges på www.greenladies.se anges i SEK och är inklusive moms (25 %). Avgifter tillkommer för paket som avbeställs, snabbleverans samt för ej uthämtade paket.

I samarbete med Klarna erbjuder vi fakturabetalning, delbetalning, kontokortsbetalning samt direktbetalning. Denna betallösning kallas för Klarna Checkout. Genom att lämna information i kassan godkänner du Klarnas villkor. Genom att klicka på "Slutför köp" godkänner du våra allmänna villkor. Klarna Checkout presenterar viss information för dig så snart du är identifierad. Vilken information du behöver ange för att uppnå identifiering kan variera mellan olika köptillfällen och kunder. Någon kreditupplysning tas aldrig direkt i Klarna Checkout utan vid behov beroende på det betalningsalternativ du har valt. Kreditupplysningar som tas av Klarna påverkar inte din kreditvärdighet och kan inte ses av andra som begär kreditupplysning om dig, t.ex. banker.

När du har identifierats uppvisar Klarna Checkout vilka alternativ som är tillgängliga för just dig. Faktura är förvalt som betalningsalternativ men du kan givetvis fritt välja något av de andra alternativen såsom direktbetalning via bank eller betalning med kort. Vilka alternativ du erbjuds kan växla från tid till annan. Du kan själv välja om du vill skydda din användning av Klarna Checkout med en PIN-kod.
      `,
		position: 2,
	});

	const tab4 = await customPageTabComponentSectionRepo.save({
		key: 'frakt',
		title: 'Frakt',
		body: `
Vi kompenserar för alla koldioxidutsläpp som uppstår vid leveranser till och från Green Ladies.

Varorna skickas till det DHL Ombud / Utlämningsställe som ligger närmast den leveransadress som angivits vid beställningen. När paketet finns för uthämtning skickas ett mail med information om löpnummer till det mailadress som angivits vid beställningen. Vid uthämtning av försändelse ska giltig ID handling uppvisas. Normal leveranstid är 2 – 3 arbetsdagar från det att beställningen är bekräftad via e-post. När din order är skickad får du ett mail till den angivna e-postadressen. Paketet borde då nå dig inom 2 arbetsdagar, om så mot förmodan inte skulle vara fallet ber vi dig att kontakta kundtjänst.

Paket som inte har hämtats ut inom angiven tid återsänds och kunden debiteras en avgift på 250 SEK för kostnader av administration, frakt, returfrakt och hantering. Outlösta paket omfattas inte av ångerrätten.
      `,
		position: 3,
	});

	const tab5 = await customPageTabComponentSectionRepo.save({
		key: 'angerratt-och-retur',
		title: 'Ångerrätt & retur',
		body: `
#### Digitala returer

För att göra en retur måste du först registrera din retur digitalt via mail. Returkostnaden på 69 SEK står kunden för. Det gör du genom att maila hej@greenladies.se från den mailadressen som användes vid ditt köp samt ditt ordernummer. Ditt ordernummer finns i ditt orderbekräftelse-mail eller på din följesedel.
När ni fullföljt stegen i den digitala returregistreringen så kommer Green Ladies inom 24 timmar att skicka en returetikett till dig via mail. Etiketten behöver du själva skriva ut och fästa på ditt paket. Om ni inte använder er av vår digitala retur-registrering måste vi dessvärre ta ut en administrativ avgift på 99 SEK. Om ni returnerar ert paket utan den returetikett vi tillhandahåller så står Green Ladies inte för några eventuella felaktigheter som kan uppstå på vägen, samt att det kan ta längre tid innan returen kommer fram och hanteras.

#### Ångerrätt och returer

Du har full retur- och bytesrätt inom 14 dagar från det att du mottagit varan, förutsatt att varan är oanvänd och returneras i oskadat skick och i förekommande fall i obruten originalförpackning samt att eventuell plombering och etiketter fortfarande sitter kvar.

Green Ladies ansvarar ej för paket som skickas med en annan returetikett än den som tillhandahålls av oss. Om du väljer att använda en annan transportör så är du själv ansvarig för paketet och dess produkter tills de når vårt lager. Du står då själv för eventuella kostnader för transport

Vi tar ej emot returer av badkläder och underkläder pågrund av hygienfaktorer.
När du returnerar en vara står du för risken, därför är det viktigt att du paketerar varan ordentligt så att den inte kommer till skada under transporten. Varorna ska även vara oanvända och returneras i oskadad originalförpackning, samtliga etiketter ska sitta kvar. Viktigt är att använda ett yttre emballage och att inte tejpa/klistra direkt på originalförpackningen (man kan alltså exempelvis inte använda skolådan som emballage).

*Returadress*: Green Ladies, August Barks Gata 25, 421 32 Göteborg

För att möjliggöra en eventuell retur behöver du kunna påvisa köp därför rekommenderar vi att du sparar orderbekräftelse och betalningsreferens som kvitto på ditt köp.

Återbetalning av en godkänd retur sker inom loppet av 30 dagar och betalas ut av Klarna.
      `,
		position: 4,
	});

	const tab6 = await customPageTabComponentSectionRepo.save({
		key: 'integritetspolicy',
		title: 'Integritetspolicy',
		body: `
Genom att handla hos Green Ladies accepterar du vår dataskyddspolicy och vår behandling av dina personuppgifter. Vi värnar om din personliga integritet och samlar inte in fler uppgifter än nödvändigt för att behandla din beställning. Vi säljer och delar aldrig dina uppgifter till tredjepart utan rättslig grund.

Green Ladies behandlar personuppgifter i enlighet med gällande lag, inklusive EU:s dataskyddsförordning. De uppgifter som behandlas är personuppgifter som du lämnar till oss eller som vi samlat in från dig via www.greenladies.se

KUDETA eCommerce Group AB är ansvarig för behandlingen av personuppgifter som du lämnat till oss som kund. Dina personuppgifter behandlas av oss för att kunna hantera din beställning samt i de tillfällen då du har önskat nyhetsbrev eller kampanjerbjudanden - för att kunna anpassa marknadsföringen åt dina individuella behov.

Nedan information är en summering av hur vi i enlighet med dataskyddsförordningen (GDPR) lagrar och behandlar dina uppgifter.
      `,
		position: 5,
	});

	const tab7 = await customPageTabComponentSectionRepo.save({
		key: 'fullstandiga-kopvillkor',
		title: 'Fullständiga köpvillkor',
		body: `
#### Allmänt

Vi som tillhandahåller www.greenladies.se är KUDETA eCommerce Group AB, med adress August Barks Gata 25, 421 32 Västra Frölunda, Sverige. Vårt organisationsnummer är 559165-2614.
Har du några frågor eller funderingar är du välkommen att kontakta vår kundrådgivning via mail hej@greenladies.se. Vi besvarar ditt mail inom 24 timmar på vardagar.

#### Betalning

Alla priser som anges på www.greenladies.se anges i SEK och är inklusive moms (25 %). Avgifter tillkommer för paket som avbeställs, snabbleverans samt för ej uthämtade paket.

I samarbete med Klarna erbjuder vi fakturabetalning, delbetalning, kontokortsbetalning samt direktbetalning. Denna betallösning kallas för Klarna Checkout. Genom att lämna information i kassan godkänner du Klarnas villkor. Genom att klicka på "Slutför köp" godkänner du våra allmänna villkor. Klarna Checkout presenterar viss information för dig så snart du är identifierad. Vilken information du behöver ange för att uppnå identifiering kan variera mellan olika köptillfällen och kunder. Någon kreditupplysning tas aldrig direkt i Klarna Checkout utan vid behov beroende på det betalningsalternativ du har valt. Kreditupplysningar som tas av Klarna påverkar inte din kreditvärdighet och kan inte ses av andra som begär kreditupplysning om dig, t.ex. banker.
När du har identifierats uppvisar Klarna Checkout vilka alternativ som är tillgängliga för just dig. Faktura är förvalt som betalningsalternativ men du kan givetvis fritt välja något av de andra alternativen såsom direktbetalning via bank eller betalning med kort. Vilka alternativ du erbjuds kan växla från tid till annan. Du kan själv välja om du vill skydda din användning av Klarna Checkout med en PIN-kod.

#### Frakt

Vi kompenserar för alla koldioxidutsläpp som uppstår vid leveranser till och från Green Ladies.

Varorna skickas till det DHL Ombud / Utlämningsställe som ligger närmast den leveransadress som angivits vid beställningen. När paketet finns för uthämtning skickas ett mail med information om löpnummer till det mailadress som angivits vid beställningen. Vid uthämtning av försändelse ska giltig ID handling uppvisas. Normal leveranstid är 2 – 3 arbetsdagar från det att beställningen är bekräftad via e-post. När din order är skickad får du ett mail till den angivna e-postadressen. Paketet borde då nå dig inom 2 arbetsdagar, om så mot förmodan inte skulle vara fallet ber vi dig att kontakta kundtjänst.

Paket som inte har hämtats ut inom angiven tid återsänds och kunden debiteras en avgift på 250 SEK för kostnader av administration, frakt, returfrakt och hantering. Outlösta paket omfattas inte av ångerrätten.

#### Avtal om köp

Avtal om köp upprättas när du har fått bekräftelse på din beställning av Green Ladies via e-post till den vid beställningen angivna e-postadressen. Bekräftelsen sker när vi hanterat er order. Vid beställning accepterar du samtliga av våra villkor. Green Ladies ingår ej avtal med personer som är minderåriga och saknar målsmans godkännande.

#### Digitala returer

För att göra en retur måste du först registrera din retur digitalt via mail. Returkostnaden på 69 SEK står kunden för. Det gör du genom att maila hej@greenladies.se från den mailadressen som användes vid ditt köp samt ditt ordernummer. Ditt ordernummer finns i ditt orderbekräftelse-mail eller på din följesedel.

När ni fullföljt stegen i den digitala returregistreringen så kommer Green Ladies inom 24 timmar att skicka en returetikett till dig via mail. Etiketten behöver du själva skriva ut och fästa på ditt paket. Om ni inte använder er av vår digitala retur-registrering måste vi dessvärre ta ut en administrativ avgift på 99 SEK. Om ni returnerar ert paket utan den returetikett vi tillhandahåller så står Green Ladies inte för några eventuella felaktigheter som kan uppstå på vägen, samt att det kan ta längre tid innan returen kommer fram och hanteras.

#### Ångerrätt och returer

Du har full retur- och bytesrätt inom 14 dagar från det att du mottagit varan, förutsatt att varan är oanvänd och returneras i oskadat skick och i förekommande fall i obruten originalförpackning samt att eventuell plombering och etiketter fortfarande sitter kvar.

Green Ladies ansvarar ej för paket som skickas med en annan returetikett än den som tillhandahålls av oss. Om du väljer att använda en annan transportör så är du själv ansvarig för paketet och dess produkter tills de når vårt lager. Du står då själv för eventuella kostnader för transport

Vi tar ej emot returer av badkläder och underkläder pågrund av hygienfaktorer.

När du returnerar en vara står du för risken, därför är det viktigt att du paketerar varan ordentligt så att den inte kommer till skada under transporten. Varorna ska även vara oanvända och returneras i oskadad originalförpackning, samtliga etiketter ska sitta kvar. Viktigt är att använda ett yttre emballage och att inte tejpa/klistra direkt på originalförpackningen (man kan alltså exempelvis inte använda skolådan som emballage).

*Returadress:* Green Ladies, August Barks Gata 25, 421 32 Göteborg

För att möjliggöra en eventuell retur behöver du kunna påvisa köp därför rekommenderar vi att du sparar orderbekräftelse och betalningsreferens som kvitto på ditt köp.
Återbetalning av en godkänd retur sker inom loppet av 30 dagar och betalas ut av Klarna.

#### Reklamation

Konsumentköplagen ger dig rätt att reklamera en vara under förutsättning att varan var felaktig vid leveranstillfället. Om du tar emot en vara som det är något fel på vill vi att du så snart som möjligt kontaktar oss. Observera att du måste lämna ett meddelande till oss med information om felet inom skälig tid efter det att du upptäckt det. 

#### Bedrägeri

Vi polisanmäler alla bedrägerier och dataintrång samt försök till sådana. Vi förbehåller oss rätten att neka eller häva ditt köp i det fall vi har skäl att misstänka bedrägeri.

#### Tvister

Vi är måna om att lösa eventuella frågor med dig som handlar hos Green Ladies. Vi håller en god ton och försöker nå en fredlig lösning. Vid tvister som vi inte lyckas lösa, rekommenderar vi att du vänder dig till Allmänna reklamationsnämnden, www.arn.se eller Box 174, 101 23 Stockholm. Du kan även använda den onlineplattform för klagomål som finns tillgänglig på EU-kommissionens webbplats: http://ec.europa.eu/odr.

För information om vilka rättigheter du som har som konsument rekommenderar vi dig att besöka Konsumentverkets hemsida www.konsumentverket.se.

#### Produktbilder

På grund av att olika skärmar på dator, surfplatta och mobil har olika färgkalibrering kan det förekomma en variation i färgen på bilderna på artikeln och färgen i verkligheten. Vi har gjort vårt bästa för att ge en korrekt färgåtergivning av artiklarna på hemsidan.

#### Force Majeure

Vid eventuella omständigheter som skäligen står utanför Green Ladies kontroll (ex. ändrad lagstiftning, strejk, blockad, sabotage, krig, brand, naturkatastrof eller myndighetsåtgärder) kan Green Ladies förpliktelse att uppfylla köpeavtalet skjutas upp så länge som omständigheterna kräver. Överstiger denna försening 2 månader har både du och Green Ladies rätt till att häva köpeavtalet med omedelbar verkan utan någon skyldighet till skadestånd.

#### Integritetspolicy

Genom att handla hos Green Ladies accepterar du vår dataskyddspolicy och vår behandling av dina personuppgifter. Vi värnar om din personliga integritet och samlar inte in fler uppgifter än nödvändigt för att behandla din beställning. Vi säljer och delar aldrig dina uppgifter till tredjepart utan rättslig grund.

Green Ladies behandlar personuppgifter i enlighet med gällande lag, inklusive EU:s dataskyddsförordning. De uppgifter som behandlas är personuppgifter som du lämnar till oss eller som vi samlat in från dig via www.greenladies.se

KUDETA eCommerce Group AB är ansvarig för behandlingen av personuppgifter som du lämnat till oss som kund. Dina personuppgifter behandlas av oss för att kunna hantera din beställning samt i de tillfällen då du har önskat nyhetsbrev eller kampanjerbjudanden - för att kunna anpassa marknadsföringen åt dina individuella behov.

Nedan information är en summering av hur vi i enlighet med dataskyddsförordningen (GDPR) lagrar och behandlar dina uppgifter. 

#### Vad är en personuppgift?

En personuppgift är all information som direkt eller indirekt kan hänföras till en fysisk person.

#### Vilka uppgifter lagrar vi?

För att kunna hantera din beställning samt svara på frågor relaterat till din order lagrar vi ditt förnamn- och efternamn, adress, telefonnummer, e-postadress, ip-adress och köphistorik. 

Dina uppgifter lagras så länge vi har en rättslig grund att behandla dina uppgifter, exempelvis för att fullfölja avtalet mellan oss eller för att efterleva en rättslig förpliktelse enligt exempelvis bokföringslagen.

#### Rättslig grund

I samband med ett köp behandlas dina personuppgifter för att fullfölja avtalet med dig.
Marknadsföring, kampanjer och liknande utskick sker endast efter samtycke från dig.

#### Vilka uppgifter delas och med vilket syfte?
* Betalning - När du väljer att betala med faktura sparas dina personuppgifter hos Klarna
* Transportör - För att kunna leverera dina beställningar och slutföra vårt avtal måste vi dela specifik information med transportören. Det gäller för- och efternamn samt adress- och kontaktuppgifter för leverans och leveransavisering.
* Nyhetsbrev - Om du har valt att prenumerera på vårt nyhetsbrev använder vi oss utav ditt förnamn, efternamn samt e-postadress.
* Sociala Medier – Om du har valt att följa oss på sociala medier använder vi oss utav ditt användarnamn, förnamn, efternamn samt e-postadress.

#### Rätten till tillgång & rättelse

Du har rätt att få utdrag av all information som finns om dig hos oss. Utdrag levereras elektroniskt i ett läsbart format. Du har rätt att be oss uppdatera felaktig information eller komplettera information som är bristfällig.

Du kan när som helst be att uppgifterna som avser dig raderas. Det finns få undantag till rätten till radering, som till exempel om det ska behållas för att vi måste uppfylla en rättslig förpliktelse (exempelvis enligt bokföringslagen).

#### Ansvarig för dataskydd

KUDETA eCommerce Groip AB är ansvarig för lagring och behandling av personuppgifter i webbutiken och ser till att reglerna efterföljs.

#### Rätt att lämna in klagomål

Om du är missnöjd med hur vi behandlat dina personuppgifter kan du också kontakta oss på våra kontaktuppgifter ovan. Du har även rätt att ge in ett klagomål avseende vår personuppgiftsbehandling till:
Datainspektionen
Box 8114
104 20 Stockholm
datainspektionen@datainspektionen.se

Vid tvister som vi inte lyckas lösa, gällande annat än behandling av dina personuppgifter, kan du även använda den onlineplattform för klagomål som finns tillgänglig på EU-kommissionens webbplats: http://ec.europa.eu/odr.

Vi reserverar oss för eventuella text eller bildfel på webbplatsen såsom felaktig produktbeskrivning, prisinformation. Vi förbehåller oss rätten att avbeställa ordrar med uppenbara felaktiga priser.
      `,
		position: 6,
	});

	const tabs = await customPageTabComponentRepo.save({
		sections: [tab1, tab2, tab3, tab4, tab5, tab6, tab7],
	});

	const tabsSection = await customPageSectionRepository.save({
		type: 'tabs',
		componentId: tabs.id,
		position: 0,
	});

	await customPageRepository.save({
		path: '/kundservice',
		sections: [tabsSection],
	});
}
