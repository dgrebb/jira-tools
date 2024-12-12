<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		userMessage: string;
	}

	let { userMessage }: Props = $props();
	let messageSet: boolean = $state(false);

	$effect(() => {
		messageSet = userMessage?.length > 0;
	});
</script>

{#if !messageSet}
	<p class="introduction" transition:fade>
		Welcome! Use this tool to map out features for Jira. Start by outlining the high-level ideas as
		Epics—detailing everything down to Sub-tasks is optional. You can always add more details later,
		so feel free to begin with the big picture and refine it over time. Let's get started!
	</p>
{:else}
	<p class="introduction" transition:fade>{userMessage}</p>
{/if}
