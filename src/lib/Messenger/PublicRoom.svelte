<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	let messages = []
	let newMessage = ''
	let unsubscribe = () => {}

	onMount(async () => {
		const resultList = await pb.collection('public_messages').getList(1, 50, {
			sort: 'created',
			expand: 'user',
		})
		messages = resultList.items
		unsubscribe = await pb.collection('public_messages').subscribe('*', async ({action, record}) => {
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
		const createdMessage = await pb.collection('public_messages').create(data)
		newMessage = ''
	}
</script>

<div class="messages m-2 p-4">
	{#each messages as message (message.id)}
		<div class="message m-2">
			<img
				class="avatar"
				src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`}
				alt="avatar"
				width="40px"
			/>
			<div class="msg-text">
				<p>{message.text}</p>
			</div>
		</div>
	{/each}
</div>

<form on:submit|preventDefault={sendMessage} class="m-2 p-4">
	<input placeholder="Message" type="text" bind:value={newMessage} class="input px-4">
	<input type="submit" name="Send" class="btn">
</form>
