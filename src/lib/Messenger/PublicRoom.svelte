<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	let messages = []
	let newMessage = ''
	let unsubscribe = () => {}

	onMount(async () => {
		const resultList = await pb.collection('messages').getList(1, 50, {
			sort: 'created',
			expand: 'user',
			filter: 'to.id="" && chat.id=""'
		})
		messages = resultList.items
		unsubscribe = await pb.collection('messages').subscribe('*', async ({action, record}) => {
			if(action === 'create'){
				const user = await pb.collection('users').getOne(record.user)
				record.expand = { user }
				messages = [...messages, record]
			}
			if(action === 'delete'){
				messages = messages.filter(m => m.id !== record.id)
			}
		})
	})

	onDestroy(()  => {
		unsubscribe()
	})

	async function sendMessage(){
		const data = { text: newMessage, user: $currentUser.id, }
		const createdMessage = await pb.collection('messages').create(data)
		newMessage = ''
	}
</script>
<div class="card max-w-2xl m-2 p-2 mx-auto max-sm:rounded-none max-sm:m-0 text-sm bg-violet-200 dark:bg-sky-900">
	{#each messages as message (message.id)}
		<div class="">
			<div 
			class="card m-2 mb-4 p-3 w-11/12 rounded-lg
			{message.expand?.user?.username==$currentUser?.username? 
			'bg-primary-300 dark:bg-cyan-700 rounded-tr-sm':'bg-secondary-300 dark:bg-sky-800 rounded-tl-sm'}
			{message.expand?.user?.username==$currentUser?.username && 'mr-2 ml-auto'}">
				<div class="font-bold">{message.expand?.user?.username}</div>
				<p>{message.text}</p>
			</div>
		</div>
	{/each}
	<form on:submit|preventDefault={sendMessage} class="m-2 p-4">
		<input placeholder="Message" type="text" bind:value={newMessage} 
		class="input px-4 bg-secondary-100 dark:bg-sky-800">
		<input type="submit" name="Send" class="btn btn-sm">
	</form>
</div>
