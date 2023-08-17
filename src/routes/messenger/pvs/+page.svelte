<script>
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	let pvs = []

	onMount(async () => {
		const resultList = await pb.collection('pvs').getList(1, 50, {
			sort: 'created',
			expand: 'user1,user2,last_message',
			filter: `(user1.id="${$currentUser?.id}") || (user2.id="${$currentUser?.id}")`,
		})
		pvs = resultList.items
	})

	let users = []
	onMount(async () => {
		const resultList = await pb.collection('users').getList(1, 50)
		users = resultList.items
	})
</script>

<div class="card max-w-2xl mx-auto m-2 p-2 bg-violet-100 dark:bg-sky-900" style="min-height: 20vh;">
	<h1 class="text-center">Private Chats</h1>
	{#each pvs as pv (pv.id)}
		<a href="/messenger/pvs/{pv?.expand?.user2.id}" class="block card m-2 p-2 bg-violet-200 dark:bg-sky-800">
			<span class="text-gray-600 dark:text-white font-bold">{pv?.expand?.user2?.username}</span>
			<p class="text-gray-600 dark:text-white" dir="auto">{pv?.expand?.last_message?.text}</p>
		</a>
	{/each}
</div>

<div class="card max-w-2xl mx-auto m-2 p-2 bg-violet-100 dark:bg-sky-900" style="min-height: 10vh;">
	<h1 class="text-center">Users</h1>
	{#each users as user (user.id)}
		<a href="/messenger/pvs/{user?.id}" class="block card m-2 p-2 bg-violet-200 dark:bg-sky-800">
			<span class="text-gray-600 dark:text-white">{user?.username}</span>
		</a>
	{/each}
</div>