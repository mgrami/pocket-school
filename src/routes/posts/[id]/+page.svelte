<script>
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import { goto } from '$app/navigation'
	import Post from '$lib/Posts/Post.svelte'
	import PostUpdate from '$lib/Posts/PostUpdate.svelte'
	import CommentPost from '$lib/Posts/CommentPost.svelte'

	export let data

	let { post } = data
	let showEdit = false

	function deleteConfirm(){
		if(confirm('Are you sure?')) deletePost()
		else return
	}
	async function deletePost(){
		try{
			await pb.collection('posts').delete(post?.id)
			goto('/posts')
		}
		catch(err){
			console.log(err)
		}
	}
</script>

<div class="m-2 p-4">

	<Post id={$page.params?.id}/>

	{#if $currentUser?.id == post?.user}
		<div style="font-size:0.8em; height: 1em; margin-top: 1.2em;">
			<span style="cursor: pointer; padding: 0.25em;" on:click={deleteConfirm}>
				<img src="/icons/trash-icon.svg" alt="" style="width: 1.2em;" />
			</span>
			<span style="cursor: pointer;" on:click={() => showEdit=!showEdit}>
				<img src="/icons/edit-box-icon.svg" alt="" style="width: 1.2em;" />
			</span>
		</div>
		{#if showEdit}
		<PostUpdate {post}/>
		{/if}
	{/if}
	
	<CommentPost postId={post?.id}/>

</div>
