<script>
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	let users = []

	onMount(async () => {
		const resultList = await pb.collection('users').getList(1, 50)
		users = resultList.items
	})
</script>

<div class="card max-w-2xl mx-auto m-2 p-2 bg-violet-100 dark:bg-sky-900" style="min-height: 80vh;">
	<h1 class="text-center">Users</h1>
	{#each users as user (user.id)}
		<a href="users/{user?.id}" class="block card m-2 p-2 bg-violet-200 dark:bg-sky-800">
			<span class="text-gray-600 dark:text-white">{user?.username}</span>
		</a>
	{/each}
</div>