<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import { goto } from '$app/navigation'

	let title = ''
	let content = ''

	async function createPost(){
		let data = {
			title,
			content,
			user: $currentUser.id,
			tags: '',
			categories: '',
		}
		try{
			let record = await pb.collection('posts').create(data)
			title = ''
			content = ''
			goto('/posts')
		}
		catch(err){
			console.log(err)
		}
	}
</script>

<form class="card m-2 p-4" on:submit|preventDefault={createPost}>
	<label class="label mb-4">
		<span>Title</span>
		<input type="text" bind:value={title} dir="auto" class="input">
	</label>
	<label class="label mb-4">
		<span>Conten</span>
		<textarea bind:value={content} dir="auto" class="textarea"></textarea>
	</label>
	<input type="submit" class="btn">
</form>