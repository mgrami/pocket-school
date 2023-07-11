<script>
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import { goto } from '$app/navigation'
	import BookPage from '$lib/Books/BookPage.svelte'
	import BookUpdate from '$lib/Books/BookUpdate.svelte'


	export let id

	let book = {}
	let book_loaded = false
	let is_open =false
	let current_page = 1
	let showEdit = false

	let new_page_type
	let new_page_id

	async function addPage(){
		let data = book
		let pages = [...book?.pages, {type: new_page_type, id: new_page_id}]
		data.pages = pages

		try{
			let record = await pb.collection('books').update(id, data)
			book = record
			new_page_id = ''
		}
		catch(err){
			console.log(err)
		}
	}
	function deleteConfirm(){
		if(confirm('Are you sure?')) deleteBook()
		else return
	}
	async function deleteBook(){
		try{
			await pb.collection('books').delete(book?.id)
			goto('/books')
		}
		catch(err){
			console.log(err)
		}
	}

	function next(){
		if(current_page < book?.pages?.length) current_page++
	}

	function prev(){
		if(current_page > 1) current_page--
	}

	onMount(async () =>{
		try{
			book = await pb.collection('books').getOne(id, {expand: 'user',})
			book_loaded = true
		}
		catch(err){
			console.log(err)
		}
	})
</script>

{#if book_loaded}

<div class="card m-2 p-4 xcard">

{#if !is_open }
	<h2 dir="auto">{book?.title}</h2>
	<div dir="auto">
		{(book?.description?.length>300 ? book?.description?.slice(0,300)+'...' : book?.description)}
	</div>
	<div>
		<span><strong>Author:</strong> {book?.expand?.user?.username}</span>
		<span><strong>Created:</strong> {book?.created?.slice(0,10)}</span>
	</div>
	<button on:click={() =>{if(book?.pages?.length>0){is_open=true}}} class="btn variant-ghost my-4">Open</button>
	
	{#if $currentUser?.id == book?.user}
	<div style="font-size:0.8em; height: 2em;" class="my-4">
		<span style="cursor: pointer; padding: 0.25em;" on:click={deleteConfirm}>
			<img src="/icons/trash-icon.svg" alt="" style="width: 1.2em;" />
		</span>
		<span style="cursor: pointer;" on:click={() => showEdit=!showEdit}>
			<img src="/icons/edit-box-icon.svg" alt="" style="width: 1.2em;" />
		</span>
	</div>
	{#if showEdit}
		<BookUpdate {book}/>
	{/if}

	<form on:submit|preventDefault={addPage} method="POST">
		<select bind:value={new_page_type} class="select">
			<option value="Post">Post</option>
			<option value="QuestionChoosing">Choosing Question</option>
		</select>
		<input type="text" name="id" placeholder="ID" bind:value={new_page_id} class="input px-4">
		<!-- <input type="number" name="pagenumber" value={book?.pages?.length+1}> -->
		<button class="btn variant-ghost">Add Page</button>
	</form>
	{/if}

{/if}

{#if is_open && current_page}
<div style="min-height: 70vh; display: flex; flex-direction: column; justify-content: space-between;">
	{#key current_page}
		<BookPage pagetype={book?.pages[current_page-1]?.type} pageid={book?.pages[current_page-1]?.id}/>
	{/key}
	<div>
		<button on:click={prev} style={current_page==1 && 'display: none;'} class="btn btn-sm variant-filled">
			prev
		</button>
		<span>{current_page}/{book?.pages?.length}</span>
		<button on:click={next} style={current_page>=book?.pages?.length && 'display: none;'} class="btn btn-sm variant-filled">
			next
		</button>
		<button on:click={() => is_open=false} class="btn btn-sm variant-ghost">Close</button>
	</div>
</div>
{/if}

</div>

{/if}
<style>
	.xcard {
		min-height: 75vh;
	}
</style>