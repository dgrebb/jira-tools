<script>
	import { ModeWatcher } from 'mode-watcher';
	import Footer from '@components/Footer.svelte';
	import Header from '@components/Header.svelte';
	import '../app.css';
</script>

<div class="app bg-zinc-900">
	<ModeWatcher />
	<Header />
	<slot></slot>
	<Footer />
</div>
