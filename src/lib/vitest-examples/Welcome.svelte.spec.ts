// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import Welcome from './Welcome.svelte';

const componentIt = typeof Welcome === 'string' ? it.skip : it;

describe('Welcome.svelte', () => {
	componentIt('renders greetings for host and guest', () => {
		const component = mount(Welcome, {
			target: document.body,
			props: { host: 'SvelteKit', guest: 'Vitest' }
		});

		flushSync();

		expect(document.querySelector('h1')?.textContent).toBe('Hello, SvelteKit!');
		expect(document.querySelector('p')?.textContent).toBe('Hello, Vitest!');

		unmount(component);
		document.body.innerHTML = '';
	});
});
