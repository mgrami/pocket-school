<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from './pocketbase'

	let messages = []
	let newMessage = ''
	let unsubscribe = () => {}

	onMount(async () => {
		const resultList = await pb.collection('messages').getList(1, 50, {
			sort: 'created',
			expand: 'user',
		})
		messages = resultList.items
		unsubscribe = await pb.collection('messages').subscribe('*', async ({action, record}) => {
			if(action === 'create'){
				const user = await pb.collection('users').getOne(record.user)
				record.expand ={ user }
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

<div class="messages">
	{#each messages as message (message.id)}
		<div class="message">
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

<form on:submit|preventDefault={sendMessage}>
	<input placeholder="Message" type="text" bind:value={newMessage}>
	<input type="submit" name="Send">
</form>
