<script>
	import Posts from '$lib/Posts.svelte'
	export let data
	let { posts } = data
</script>

<Posts {posts} />