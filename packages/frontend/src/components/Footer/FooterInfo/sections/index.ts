import { CommonQuestionsSection } from './CommonQuestionsSection';
import { EasyShoppingSection } from './EasyShoppingSection';
import { PaymentAlternativesSection } from './PaymentAlternativesSection';
import { SafeOnlineShoppingSection } from './SafeOnlineShoppingSection';
import { ShippingAlternativesSection } from './ShippingAlternativesSection';

export const sections = [
	{ id: 'common-questions', title: 'Vanliga frågor', component: CommonQuestionsSection },
	{ id: 'payment-alternatives', title: 'Betalningsalternativ', component: PaymentAlternativesSection },
	{ id: 'shipping-alternatives', title: 'Vi skickar med', component: ShippingAlternativesSection },
	{ id: 'easy-shopping', title: 'Enkel onlineshopping', component: EasyShoppingSection },
	{ id: 'safe-online-shopping', title: 'Trygg e-handel', component: SafeOnlineShoppingSection },
];
