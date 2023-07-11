<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	let books = []

	onMount(async () => {
		try{
			const resultList = await pb.collection('books').getList(1, 50, {
				sort: '-created',
				expand: 'user',
			})
			books = resultList.items
		}
		catch(err){
			console.log(err)
		}
	})
</script>

<div style="display: grid; grid-template-columns: repeat( auto-fit, minmax(20em, 1fr));">
	{#each books as book (book?.id)}
	<div class="card m-2 p-4 xcard">
		<h2 dir="auto">{book?.title}</h2>
		<div dir="auto">
			{(book?.description?.length>300 ? book?.description?.slice(0,300)+'...' : book?.description)}
		</div>
		<div style="font-size:0.8em; height: 1em; position: absolute; bottom: 1em;">
			<span><strong>Author:</strong> {book?.expand?.user?.username}</span>
			<span><strong>Created:</strong> {book?.created?.slice(0,10)}</span>
			<span><a href={'/books/'+ book?.id}>
				<img src="/icons/view-icon.svg" alt="" style="width: 1.4em; padding-left: 0.5em;">
			</a></span>
		</div>
	</div>
	{/each}
</div>


<style>
	.xcard {
		overflow: hidden;
		position: relative;
		min-width: 200px;
		max-width: 350px;
		height: 250px;
	}
</style>