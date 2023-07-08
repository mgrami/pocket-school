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
<div class="card">
	<QuestionChoosing id={question?.id}/>
</div>
{/each}
</div>

<style>	
	.card {
		width: 95%;
		max-width: 900px;
		min-height: 250px;
		margin: 1em auto;
		padding: 0.75em;
		background: #FFF;
		box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
		border-radius: 0.2em;
	}
</style>