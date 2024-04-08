<script>
	// your script goes here
	const projects = ['UIR', 'PIN', 'ANA', 'APE', 'DEVO', 'RM'];
	import ReleaseForm from '$lib/comp/ReleaseForm.svelte';
</script>

<svelte:head>
	<title>Jira Release Cascade</title>
</svelte:head>
<ReleaseForm {projects} />
