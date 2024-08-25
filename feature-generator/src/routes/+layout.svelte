<script>
	import { ModeWatcher } from 'mode-watcher';
	import Footer from '@components/Footer.svelte';
	import Header from '@components/Header.svelte';
	import '../app.css';
</script>

<div class="app">
	<ModeWatcher />
	<Header />
	<main class=" p-4 sm:px-6 sm:py-0">
		<slot></slot>
	</main>
	<Footer />
</div>
