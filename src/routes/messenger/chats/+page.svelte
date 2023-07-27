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

<div class="m-2 p-4">
	{#each chats as chat (chat.id)}
		<div class="m-2">
			<div class="msg-text">
<!-- <div>{JSON.stringify(chat?.expand?.members.filter(m => m.id !== $currentUser?.id)[0])}</div> -->
				<p>
					<a href="/messenger/chats/{chat?.id}" class="dark:text-white">
						{(chat?.expand?.members.filter(m => m.id !== $currentUser?.id)[0])?.username}
					</a>
				</p>
			</div>
		</div>
	{/each}
</div>