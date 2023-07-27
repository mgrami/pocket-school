<script>
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	let messages = []
	let newMessage = ''
	let unsubscribe = () => {}

	async function sendMessage(){
		const data = { text: newMessage, user: $currentUser.id, }
		const createdMessage = await pb.collection('messages').create(data)
		newMessage = ''
	}

	onMount(async () => {
		const record = await pb.collection('chats').getOne($page.params?.id, {expand: 'messages,messages.user',})
		messages = record?.expand?.messages

		unsubscribe = await pb.collection('chats').subscribe($page.params?.id, async ({action, record}) => {
			console.log('record.expand: ', record?.expand)
		})
	})

	onDestroy(()  => {
		unsubscribe()
	})
</script>

<h1 class="m-4">Chat ID: {$page.params?.id}</h1>

<div class="messages m-2 p-4">
	{#each messages as message (message.id)}
		<div class="message m-2">
			<img
				class="avatar"
				src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`}
				alt="avatar"
				width="40px"
			/>
			<div>{message?.expand?.user?.username}</div>
			<div class="msg-text">
				<p>{message.text}</p>
			</div>
		</div>
	{/each}
</div>

<form on:submit|preventDefault={sendMessage} class="m-2 p-4">
	<input placeholder="Message" type="text" bind:value={newMessage} class="input">
	<input type="submit" name="Send" class="btn">
</form>
