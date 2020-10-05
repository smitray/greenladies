import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import { createFragmentContainer, graphql } from 'react-relay';

import { NavbarDesktop_megamenu } from './__generated__/NavbarDesktop_megamenu.graphql';
import { NavbarDesktopView } from './NavbarDesktop.view';

const TIMEOUT_MS = 100;

interface NavbarLogicProps {
	megamenu: NavbarDesktop_megamenu;
}

const NavbarDesktopLogic = ({ megamenu }: NavbarLogicProps) => {
	const [currentlySelectedTopLevelItemIndex, setCurrentlySelectedTopLevelItemIndex] = useState<number | null>(null);
	const [megaMenuFocus, setMegaMenuFocus] = useState(false);
	// Needed to avoid stale state in setTimeout callback
	const megaMenuFocusRef = useRef(false);

	const currentlySelectedTopLevelItemIndexTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const megaMenuFocusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const { asPath } = useRouter();

	// Close menu when navigating
	useEffect(() => {
		setCurrentlySelectedTopLevelItemIndex(null);
		setMegaMenuFocus(false);
	}, [asPath]);

	// Update reference whenever state changes
	useEffect(() => {
		megaMenuFocusRef.current = megaMenuFocus;
	}, [megaMenuFocus]);

	const handleTopLevelItemFocus = (index: number) => {
		// Clear unfocus timeout
		if (currentlySelectedTopLevelItemIndexTimeoutRef.current) {
			clearTimeout(currentlySelectedTopLevelItemIndexTimeoutRef.current);
		}

		currentlySelectedTopLevelItemIndexTimeoutRef.current = setTimeout(() => {
			// If mega menu is open, clear the mega menu unfocus timeout in order
			// to not clear current category, just setting its unfocus to false
			if (megaMenuFocus) {
				if (megaMenuFocusTimeoutRef.current) {
					clearTimeout(megaMenuFocusTimeoutRef.current);
				}

				setMegaMenuFocus(false);
			}

			setCurrentlySelectedTopLevelItemIndex(index);
			currentlySelectedTopLevelItemIndexTimeoutRef.current = null;
		}, TIMEOUT_MS);
	};

	const handleTopLevelItemUnfocus = () => {
		// Clear previous unfocus timer, if any
		if (currentlySelectedTopLevelItemIndexTimeoutRef.current) {
			clearTimeout(currentlySelectedTopLevelItemIndexTimeoutRef.current);
		}

		currentlySelectedTopLevelItemIndexTimeoutRef.current = setTimeout(() => {
			// Don't unset current category if mega menu is in focus
			if (!megaMenuFocusRef.current) {
				setCurrentlySelectedTopLevelItemIndex(null);
			}

			currentlySelectedTopLevelItemIndexTimeoutRef.current = null;
		}, TIMEOUT_MS);
	};

	const handleMegaMenuFocus = () => {
		// Clear unfocus timeout
		if (megaMenuFocusTimeoutRef.current) {
			clearTimeout(megaMenuFocusTimeoutRef.current);
		}

		setMegaMenuFocus(true);
	};

	const handleMegaMenuUnfocus = () => {
		// Clear previous unfocus timer, if any
		if (megaMenuFocusTimeoutRef.current) {
			clearTimeout(megaMenuFocusTimeoutRef.current);
		}

		megaMenuFocusTimeoutRef.current = setTimeout(() => {
			setMegaMenuFocus(false);
			setCurrentlySelectedTopLevelItemIndex(null);
			megaMenuFocusTimeoutRef.current = null;
		}, TIMEOUT_MS);
	};

	return (
		<NavbarDesktopView
			megamenu={megamenu}
			currentlySelectedTopLevelItemIndex={currentlySelectedTopLevelItemIndex}
			handleTopLevelItemFocus={handleTopLevelItemFocus}
			handleTopLevelItemUnfocus={handleTopLevelItemUnfocus}
			handleMegaMenuFocus={handleMegaMenuFocus}
			handleMegaMenuUnfocus={handleMegaMenuUnfocus}
		/>
	);
};

export default createFragmentContainer(NavbarDesktopLogic, {
	megamenu: graphql`
		fragment NavbarDesktop_megamenu on Megamenu {
			items {
				name
				link {
					...Link_link
				}
				...MegaMenu_item
			}
		}
	`,
});
