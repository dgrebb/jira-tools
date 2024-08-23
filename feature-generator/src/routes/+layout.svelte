<script>
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';

	const year = new Date().getFullYear();
</script>

<ModeWatcher />
<header>
	<h1>Feature Complete</h1>
	<p>Tell a story.</p>
	<Navigation />
</header>
<main>
	<slot></slot>
</main>
<footer>
	cc dgrebb {year}
</footer>
