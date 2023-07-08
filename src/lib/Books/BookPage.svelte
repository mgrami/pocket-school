<script>
	import Post from '$lib/Posts/Post.svelte'
	import QuestionChoosing from '$lib/QuestionChoosing.svelte'

	export let pagetype
	export let pageid
</script>

<div class="page">

{#if pagetype == 'Post'}
	<Post id={pageid} />
{/if}

{#if pagetype == 'QuestionChoosing'}
	<QuestionChoosing id={pageid} />
{/if}

</div>

<style>
	.page{
		margin-top: 1em;
	}
</style>