<script>
	export let post
</script>

<div class="card">
	<h2 dir="auto">{post?.title}</h2>
	<div dir="auto">
		{@html (post?.content?.length>300 ? post?.content?.slice(0,300)+'...' : post?.content)}
	</div>
	<div style="font-size:0.8em; height: 1em; position: absolute; bottom: 1em;">
		<span><strong>Author:</strong> {post?.expand?.user?.username}</span>
		<span><strong>Created:</strong> {post?.created?.slice(0,10)}</span>
		<span><a href={'/posts/'+ post?.id}>
			<img src="/icons/view-icon.svg" alt="" style="width: 1.4em; padding-left: 0.5em;">
		</a></span>
	</div>
</div>

<style>
	.card {
		overflow: hidden;
		position: relative;
		min-width: 200px;
		max-width: 350px;
		height: 250px;
		margin: 0.5em;
		padding: 0.75em;
		background: #FFF;
		box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
		border-radius: 0.2em;
	}
</style>