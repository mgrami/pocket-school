<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import { goto } from '$app/navigation'

	export let book

	let { title, description, } = book

	async function createBook(){
		let data = {
			title,
			description,
			user: $currentUser.id,
		}
		try{
			let record = await pb.collection('books').update(book?.id, data)
			title = ''
			description = ''
			window.location.reload()
		}
		catch(err){
			console.log(err)
		}
	}
</script>

<form class="my-4" on:submit|preventDefault={createBook}>
	<input type="text" placeholder="Title" bind:value={title} dir="auto" class="input">
	<textarea bind:value={description} dir="auto" class="textarea"></textarea>
	<input type="submit" class="btn">
</form>
