<script>
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import { goto } from '$app/navigation'
	import Book from '$lib/Books/Book.svelte'
</script>

<Book id={$page.params.id}/>
