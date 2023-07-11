<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import { goto } from '$app/navigation'

	let title = ''
	let description = ''

	async function createBook(){
		let data = {
			title,
			description,
			user: $currentUser.id,
		}
		try{
			let record = await pb.collection('books').create(data)
			title = ''
			description = ''
			goto('/books')
		}
		catch(err){
			console.log(err)
		}
	}
</script>

<form class="card m-2 p-4" on:submit|preventDefault={createBook}>
	<label class="label mb-4">
		<span>Title</span>
		<input type="text" bind:value={title} dir="auto" class="input">
	</label>
	<label class="label mb-4">
		<span>Description</span>
		<textarea bind:value={description} dir="auto" class="textarea"></textarea>
	</label>
	<input type="submit" class="btn">
</form>

