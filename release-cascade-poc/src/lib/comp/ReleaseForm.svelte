<script>
	export let projects = ['UIE', 'INF', 'DAN', 'APE', 'PROJ', 'THIS', 'THAT', 'THEOTHER'];
	$: selectedProjects = [];
	let releaseName = '';
	let payload = {};

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

	const submit = function submit(e) {
		console.log(selectedProjects, releaseName);
	};
</script>

<h1 class="pb-9 text-3xl">Create a Cascading Release</h1>
<form id="release-form" on:submit={submit}>
	<h2>Projects</h2>
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
	<h2 class="pt-9">Release/Version Name</h2>
	<fieldset>
		<input
			name="release-name"
			type="text"
			placeholder="KEY-R24.04.10.0 or KEY-R24.Q1.1.0 etc."
			class="input input-bordered w-full"
			bind:value={releaseName}
		/>
		<div class="label">
			<span class="label-text-alt"
				>Check out the <a href="">Release and Version Naming documentation</a>.
			</span>
		</div>
	</fieldset>
	<button class="btn btn-primary float-right">Go!</button>
</form>

<style>
	/* your styles go here */
</style>
