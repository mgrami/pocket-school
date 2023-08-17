<script>
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	let messages = []
	let newMessage = ''
	let unsubscribe = () => {}
	let pv

	onMount(async () => {
		const resultList = await pb.collection('messages').getList(1, 50, {
			sort: 'created',
			expand: 'user,to',
			filter: `(user.id="${$currentUser?.id}" && to.id="${$page.params?.id}") || (to.id="${$currentUser?.id}" && user.id="${$page.params?.id}")`,
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

		const resultList2 = await pb.collection('pvs').getList(1, 5, {
			sort: 'created',
			expand: 'user1,user2,last_message',
			filter: `(user1.id="${$currentUser?.id}" && user2.id="${$page.params?.id}") || (user2.id="${$currentUser?.id}" && user1.id="${$page.params?.id}")`,
		})
		pv = resultList2.items[0]
	})

	onDestroy(()  => {
		unsubscribe()
	})

	async function sendMessage(){
		if(!pv){
			try{
				const user2 = await pb.collection('users').getOne($page.params?.id)
				pv = await pb.collection('pvs').create({
					user1: $currentUser?.id,
					user2: user2?.id,
				})
			}
			catch(err){
				console.log('could not create the pv: ',err)
				return
			}
		}
		const data = { text: newMessage, user: $currentUser.id, to: $page.params?.id }
		const createdMessage = await pb.collection('messages').create(data)
		newMessage = ''
		pv = await pb.collection('pvs').update(pv?.id, {last_message: createdMessage.id}, {expand: 'last_message'})
	}
	async function deleteMessage(id){
		if(confirm('Are you sure?')){
			try{
				await pb.collection('messages').delete(id)
			}
			catch(err){
				console.log(err)
			}
		}
		else return
	}
</script>

<div class="card max-w-2xl m-2 p-2 mx-auto max-sm:rounded-none max-sm:m-0 text-sm bg-violet-200 dark:bg-sky-900">
	{#each messages as message (message.id)}
		<div class="">
			<div 
			class="card m-2 mb-4 p-3 w-11/12 rounded-lg
			{message.expand?.user?.username==$currentUser?.username? 
			'bg-primary-300 dark:bg-cyan-700':'bg-secondary-300 dark:bg-sky-800'}
			{message.expand?.user?.username==$currentUser?.username && 'mr-2 ml-auto'}">
				<div class="font-bold">{message.expand?.user?.username}</div>
				<p dir="auto">{message.text}</p>
				<footer class="card-footer text-xs mt-2">
					<span>
						{(new Date(message.created)).toLocaleString('fa-IR', {
							timeZone: 'Asia/Tehran',
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
						})?.slice(5,17)}
					</span>
					{#if $currentUser?.id == message?.user}
					<span on:click={() => deleteMessage(message?.id)} class="mx-1 px-1">
						<img src="/icons/trash-icon.svg" alt="" style="width: 1em;" />
					</span>
					{/if}
				</footer>
			</div>
		</div>
	{/each}
	<form on:submit|preventDefault={sendMessage} class="m-2 p-4" dir="auto">
		<input placeholder="Message" type="text" bind:value={newMessage} dir="auto" 
		class="input px-4 bg-secondary-100 dark:bg-sky-800">
		<input type="submit" name="Send" class="btn btn-sm">
	</form>
</div>
{JSON.stringify(pv?.length)}
<!-- {JSON.stringify(pv?.expand?.last_message?.text)} -->
