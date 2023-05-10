<script>
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import LikePost from '$lib/LikePost.svelte'

	export let post

	onMount(async () => {
		try{
			post = await pb.collection('posts').getOne($page.params.id, {expand: 'user',})
		}
		catch(err){
			console.log(err)
		}
	})
</script>

<div>
	<h2 dir="auto">{post?.title}</h2>
	<div dir="auto">{@html post?.content}</div>
	<div style="font-size:0.8em; height: 1em; margin-top: 1.2em;">
		<span><strong>Author:</strong> {post?.expand?.user?.username}</span>
		<span><strong>Created:</strong> {post?.created?.slice(0,10)}</span>
	</div>
	<div style="font-size:0.8em; margin: 0.5em; margin-top: 1.2em;">
		<LikePost postId={post?.id}/>
	</div>
</div>


