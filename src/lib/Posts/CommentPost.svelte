<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import CommentRepliesPost from '$lib/Posts/CommentRepliesPost.svelte'

	export let postId
	let comments = []
	let newComment = ''

	async function getComments() {
		try{
			const resultList = await pb.collection('comments_post').getList(1, 50, {
				sort: '-created',
				expand: 'user',
				filter: `post="${postId}" && root_comment=""`,
			})
			comments = resultList?.items
		}
		catch(err){
			console.log(err)
		}
	}

	async function sendComment(){
		let data = { text: newComment, user: $currentUser?.id, post: postId, }
		try{
			let record = await pb.collection('comments_post').create(data)
			newComment = ''
			getComments()
		}
		catch(err){
			console.log(err)
		}
	}

	async function deleteComment(id){
		if(confirm('Are you sure of deleting your comment?')){			
			try{
				await pb.collection('comments_post').delete(id)
				getComments()
			}
			catch(err){
				console.log(err)
			}
		}
		else return
	}

	onMount(getComments)
</script>

<div class="comments">
	<strong style="margin-bottom: 1em;">Comments</strong>

	<form on:submit|preventDefault={sendComment}>
		<textarea bind:value={newComment} class="textarea"></textarea>
		<input type="submit" value="" class="btn">
	</form>

	{#each comments as comment (comment?.id)}
	<div class="comment">

		{#if comment?.expand?.user?.id == $currentUser?.id}
		<span style="cursor: pointer;" on:click={() => deleteComment(comment?.id)}>
			<img src="/icons/trash-icon.svg" alt="" style="width: 0.9em;" />
		</span>
		{/if}

		<span><strong>{comment?.expand?.user?.username}</strong></span>
		<span>{comment?.text}</span>

		<div style="font-size: 0.7em;"><strong>{(comment?.created).slice(0,16)}</strong></div>

		<CommentRepliesPost postId={postId} root_comment_id={comment?.id}/>
	</div>
	{/each}
</div>


<style>
	.comments{
		margin: 0.5em;
		margin-top: 2em;
		padding: 0.5em;
		font-size: 0.9em;
	}
	.comment{
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}

	input {
		width: 100%;
		max-width: 936px;
		margin: 0.25em auto;
	}
	textarea {
		max-width: 80%;
		height: 3em;
	}
	input[type=submit] {
		cursor: pointer;
		width: 3em;
		margin-top: 0.5em;
		background: url("/icons/send-icon.svg") no-repeat scroll 7px 7px;
		background-size: 1.5em;
		border: none;
	}
</style>