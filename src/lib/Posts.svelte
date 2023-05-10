<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import PostOverView from '$lib/PostOverView.svelte'

	export let posts = []
	// let posts = []

	onMount(async () => {
		try{
			const resultList = await pb.collection('posts').getList(1, 50, {
				sort: '-created',
				expand: 'user',
			})
			posts = resultList.items
		}
		catch(err){
			console.log(err)
		}
	})
</script>

<!-- <div style="display: flex; justify-content: space-around; flex-wrap: wrap;"> -->

<div style="display: grid; grid-template-columns: repeat( auto-fit, minmax(20em, 1fr));">
	{#each posts as post (post?.id)}
		<PostOverView {post} />
	{/each}
</div>

