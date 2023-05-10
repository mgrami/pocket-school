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

<form class="form-post" on:submit|preventDefault={createPost}>
	<input type="text" placeholder="Title" bind:value={title} dir="auto">
	<textarea bind:value={content} dir="auto"></textarea>
	<input type="submit">
</form>
<style>
	.form-post {
		/*max-width: 400px;*/
		width: 90%;
		margin: 3em auto;
		padding: 1em;
		text-align: center;
		background: #FFF;
		box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
		border-radius: 0.2em;
	}
	input {
		width: 100%;
		max-width: 936px;
		margin: 0.25em auto;
		border: 2px solid #EEE;
		border-radius: 0.3em;
	}
	textarea {
		width: 100%;
		max-width: 936px;
		min-height: 20em;
		margin: 0.25em auto;
		border: 2px solid #EEE;
		border-radius: 0.3em;
	}
	input[type=submit] {
		cursor: pointer;
		width: 100%;
		background: #3861FB;
		color: #FFF;
		border-color: #3861FB;
		margin-top: 0.5em;
	}
/*	.errorlist {
		color: #E00
	}*/
/*	p label {
		margin-bottom: 0.5em;
		padding-left: 1em;
		text-align: left;
	}*/
</style>