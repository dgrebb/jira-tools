<script>
	import '../app.pcss';

	const year = new Date().getFullYear();
</script>

<header>
	<h1>Feature Complete</h1>
	<p>Tell a story.</p>
	<nav></nav>
</header>
<main>
	<slot />
</main>
<footer>
	cc dgrebb {year}
</footer>
