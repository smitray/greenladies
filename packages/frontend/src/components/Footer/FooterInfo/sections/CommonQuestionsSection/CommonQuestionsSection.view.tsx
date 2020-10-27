import React from 'react';

import Link from 'next/link';

import { List, ListItem, ListLink } from '../shared/list';

export const CommonQuestionsSectionView = () => {
	return (
		<List>
			<ListItem>
				<Link href="/[[...slug]]?tab=fullstandiga-kopvillkor" as="/kundservice?tab=fullstandiga-kopvillkor" passHref>
					<ListLink>Köpvillkor</ListLink>
				</Link>
			</ListItem>
			<ListItem>
				<Link href="/[[...slug]]?tab=betalning" as="/kundservice?tab=betalning" passHref>
					<ListLink>Betalning</ListLink>
				</Link>
			</ListItem>
			<ListItem>
				<Link href="/[[...slug]]?tab=frakt" as="/kundservice?tab=frakt" passHref>
					<ListLink>Leverans</ListLink>
				</Link>
			</ListItem>
		</List>
	);
};
