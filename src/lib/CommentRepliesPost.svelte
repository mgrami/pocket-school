<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	export let root_comment_id = ''
	export let postId

	let showReplies = false
	let reply_to_root_form = false
	let comments = []
	let newComment = ''

	async function getComments() {
		if(showReplies){
			try{
				const resultList = await pb.collection('comments_post').getList(1, 50, {
					sort: '-created',
					expand: 'user',
					filter: `post="${postId}" && root_comment="${root_comment_id}"`,
				})
				comments = resultList?.items
			}
			catch(err){
				console.log(err)
			}
		}
	}
	async function sendComment(){
		let data = { 
			text: newComment, 
			user: $currentUser?.id, 
			post: postId, 
			root_comment: root_comment_id, 
			reply_to: '' 
		}
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

	$: {
		if(showReplies)	getComments()
	}
</script>

 
<div on:click={() => showReplies = !showReplies} 
	style="cursor: pointer; font-weight: bold; font-size: 0.8em;"
	>
	Replies
</div>

<div class="comments" style={showReplies ? 'display: block;' : 'display: none;'}>

	<div on:click={() => reply_to_root_form = !reply_to_root_form} 
		style="cursor: pointer; font-weight: bold; font-size: 0.9em; 
		width: 3em; background: #eee; border-radius: 0.25em; 
		padding: 0.25em; margin: 0.25em; text-align: center;">
		{reply_to_root_form? 'Close' : 'Reply'}
	</div>

	<form on:submit|preventDefault={sendComment} 
		class="reply-form" 
		style={reply_to_root_form? 'display: flex;' : 'display: none;'}>
		<textarea bind:value={newComment}></textarea>
		<input type="submit" value="">
	</form>

	{#each comments as comment (comment?.id)}
	<div class="comment">

		{#if comment?.expand?.user?.id == $currentUser?.id}
		<span style="cursor: pointer;" on:click={() => deleteComment(comment?.id)}>
			<img src="/icons/trash-icon.svg" alt="" style="width: 0.9em;" />
		</span>
		{/if}

		<span><strong>{comment?.expand?.user?.username}</strong></span>

		<span>{comment?.text}</span><br>
		<span style="font-size: 0.7em;"><strong>{(comment?.created).slice(0,16)}</strong></span>
		
	</div>
	{/each}
</div>


<!-- <span><strong>{comment?.expand?.reply_to ? '@'+comment?.expand?.reply?.username : ''}</strong></span> -->


<style>
	.comments{
		margin: 0.25em;
		margin-left: 1em;
		padding: 0.5em;
		font-size: 0.9em;
	}
	.comment{
		margin-top: 0.25em;
		margin-bottom: 0.25em;
	}
	.reply-form{
		width: 80%;
	}

	form{
		display: flex;
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
		height: 3em;
		margin: 0.25em auto;
		border: 1px solid #888;
		border-radius: 0.3em;
	}
	input[type=submit] {
		cursor: pointer;
		width: 3em;
		background: #fff;
		color: #333;
		border-color: #fff;
		margin-top: 0.5em;
		padding: 0.5em;
		background: url("/icons/send-icon.svg") no-repeat scroll 7px 7px;
		background-size: 1.5em;
	}
</style>