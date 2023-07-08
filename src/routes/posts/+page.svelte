<script>
	import Posts from '$lib/Posts/Posts.svelte'
	export let data
	let { posts } = data
</script>

<Posts {posts} />