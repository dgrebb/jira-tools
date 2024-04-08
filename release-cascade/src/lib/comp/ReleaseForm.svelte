<script>
	import { deserialize } from '$app/forms';
	import { createRelease } from '$lib/api/createRelease';
	export let projects;
	$: selectedProjects = [];
	$: releaseName = '';
	$: releaseDescription = '';
	$: success = false;

	const selectAllProjects = function toggleAllFieldsetCheckboxes(e) {
		selectedProjects = e.target.checked ? [...projects] : [];
	};

	const toggleProject = function toggleProject(node) {
		const value = node.value;

		if (node.checked && !selectedProjects.includes(value)) {
			selectedProjects.push(value);
		} else if (!node.checked && selectedProjects.includes(value)) {
			selectedProjects = selectedProjects.filter((item) => item !== value);
		}
	};

	const submitHandler = async function submitHandler(e) {
		e.preventDefault();
		success = 'pending';
		try {
			// Generate an array of promises for each selected item
			const postPromises = selectedProjects.map((project) =>
				createRelease(releaseName, releaseDescription, project)
			);

			// Execute all promises concurrently and wait for them to settle
			const results = await Promise.all(postPromises);

			// Log "success" to the console for each successful API call
			// NOTE: This is a great place for reporting middleware
			results.forEach((result) => {
				console.log(result);
			});
			success = true;
			setTimeout(function () {
				success = false;
			}, 2000);
		} catch (error) {
			console.error('Error:', error);
			success = 'failed';
		}
	};
</script>

<h1 class="pb-9 text-3xl">Create a Cascading Release</h1>
<form id="release-form" on:submit={submitHandler} class="text-center">
	<h2 class="text-xl">Projects</h2>
	<fieldset class="grid grid-cols-2 justify-items-start md:grid-cols-3 lg:grid-cols-4">
		<label class="label col-span-full cursor-pointer">
			<input type="checkbox" class="checkbox" on:change={selectAllProjects} />
			<span class="label-text">Select All</span>
		</label>
		{#each projects as project}
			<label class="label cursor-pointer">
				<input
					type="checkbox"
					class="checkbox"
					bind:group={selectedProjects}
					on:change={toggleProject}
					name={project}
					value={project}
				/>
				<span class="label-text">{project}</span>
			</label>
		{/each}
	</fieldset>
	<fieldset>
		<h2 class="pb-1 pt-9">Release/Version Name</h2>
		<input
			name="release-name"
			type="text"
			placeholder="KEY-R24.04.10.0 or KEY-R24.Q1.1.0 etc."
			class="input input-bordered w-full"
			bind:value={releaseName}
			required
		/>
		<div class="label">
			<span class="label-text-alt"
				>Check out the <a href="/">Release and Version Naming documentation</a>.
			</span>
		</div>
		<h2 class="pb-1 pt-5">Release/Version Description</h2>
		<input
			name="release-description"
			type="text"
			placeholder="Add a description, if you'd like."
			class="input input-bordered w-full"
			bind:value={releaseDescription}
		/>
	</fieldset>
	<button
		class="btn btn-primary align-self mt-4 w-[333px] transition-colors {success
			? `btn-success`
			: null} {success === 'pending' ? `btn-info` : success === 'failed' ? `btn-error` : null}"
	>
		{#if success === true}
			Success!
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
				/></svg
			>
		{:else if success === 'pending'}
			Creating Releases
			<span class="loading loading-spinner"></span>
		{:else if success === 'failed'}
			Something went wrong.
		{:else}
			Go
		{/if}
	</button>
</form>
