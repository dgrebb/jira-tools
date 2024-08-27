<script>
	// your script goes here
	import ReleaseForm from '$lib/comp/ReleaseForm.svelte';
	import { projects } from '$lib/apiConfig.js';
</script>

<svelte:head>
	<title>Jira Release Cascade</title>
</svelte:head>
<ReleaseForm {projects} />
