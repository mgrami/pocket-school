<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import QuestionChoosing from '$lib/QuestionChoosing.svelte'

	let questions = []

	onMount(async () => {
		try{
		const resultList = await pb.collection('questions_choosing').getList(1, 50, {
			sort: '-created',
			expand: 'user',
		})
		questions = resultList.items
		}
		catch(err){
			console.log(err)
		}
	})
</script>


<div style="display: grid; grid-template-columns: repeat( auto-fit, minmax(20em, 1fr));">
{#each questions as question (question?.id)}
<div class="xcard card m-2 p-4">
	<QuestionChoosing id={question?.id}/>
</div>
{/each}
</div>

<style>	
	.xcard {
		width: 95%;
		max-width: 900px;
		min-height: 250px;
		margin: 1em auto;
	}
</style>