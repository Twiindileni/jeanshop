export function formatNAD(cents: number): string {
	// Some environments/locales render NAD as $ or NAD. Force the N$ prefix for consistency.
	const amount = ((cents || 0) / 100).toFixed(2);
	return `N$${amount}`;
}

