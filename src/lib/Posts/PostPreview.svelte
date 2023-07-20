<script>
	export let post
</script>

<div class="card p-4 m-2 xcard">
	<header dir="auto">{post?.title}</header>
	<section dir="auto">
		{@html (post?.content?.length>300 ? post?.content?.slice(0,300)+'...' : post?.content)}
	</section>
	<footer class="card-footer text-xs mt-2">
		<span><strong>Author:</strong> {post?.expand?.user?.username}</span>
		<span><strong>Created:</strong> {post?.created?.slice(0,10)}</span>
		<span><a href={'/posts/'+ post?.id} class="ml-2  font-bold">
			<!-- <img src="/icons/view-icon.svg" alt="" style="width: 1.4em; padding-left: 0.5em;"> -->
			View->
		</a></span>
	</footer>
</div>

<style>
	.xcard {
		overflow: hidden;
		position: relative;
		min-width: 250px;
		max-width: 350px;
		height: 250px;
	}
</style>