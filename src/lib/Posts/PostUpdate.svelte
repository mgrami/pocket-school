<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import { goto } from '$app/navigation'

	export let post
	let { title, content, } = post

	async function updatePost(){
		let data = {
			title,
			content,
			user: $currentUser.id,
			tags: '',
			categories: '',
		}
		try{
			let record = await pb.collection('posts').update(post?.id ,data)
			title = ''
			content = ''
			// goto('/posts/'+post?.id)
			window.location.reload();
		}
		catch(err){
			console.log(err)
		}
	}
</script>

<form class="form-post card m-4 p-4" on:submit|preventDefault={updatePost}>
	<input type="text" placeholder="Title" bind:value={title} dir="auto" class="input">
	<textarea bind:value={content} dir="auto" class="textarea"></textarea>
	<input type="submit" value="Edit" class="btn">
</form>