<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	let chats = []
	let unsubscribe = () => {}

	onMount(async () => {
		const resultList = await pb.collection('chats').getList(1, 50, {
			sort: 'created',
			expand: 'members',
		})
		chats = resultList.items
		unsubscribe = await pb.collection('chats').subscribe('*', async ({action, record}) => {
			if(action === 'create'){
				// const user = await pb.collection('users').getOne(record.user)
				// record.expand ={ user }
				chats = [...chats, record]
			}
			if(action === 'delete'){
				chats = chats.filter(chat => chat.id !== record.id)
			}
		})
	})

	onDestroy(()  => {
		unsubscribe()
	})
</script>

<div class="card max-w-2xl mx-auto m-2 p-2 bg-violet-100 dark:bg-sky-900" style="min-height: 80vh;">
	{#each chats as chat (chat.id)}
		<a href="chats/{chat?.id}" class="block card m-2 p-2 bg-violet-200 dark:bg-sky-800">
			<span class="text-gray-600 dark:text-white">{chat?.name}</span>
		</a>
	{/each}
</div>