<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import { goto } from '$app/navigation'

	export let id = ''
	
	let question
	let tts
	let lang = 'us-eng'
	let picked = 0
	let checked = false
	let answer_status = 'not-checked' // 'correct' - 'wrong'
	let showEdit = false

	function deleteConfirm(){
		if(confirm('Are you sure?')) deletePost()
		else return
	}
	async function deleteQuestion(){
		try{
			await pb.collection('questions_choosing').delete(question?.id)
			goto('/questions_choosing')
		}
		catch(err){
			console.log(err)
		}
	}

	function check(answer){
		checked = true
		if(picked == +answer) answer_status = 'correct'
		if(picked != +answer) answer_status = 'wrong'
	}

	async function speak(text){
		tts.text = text
		speechSynthesis.speak(tts)
	}

	onMount(async () => {
			try{
			tts = new SpeechSynthesisUtterance()
			question = await pb.collection('questions_choosing').getOne(id, {expand: 'user',})
			}
			catch(err){
				question = {}
				console.log(err)
			}
	})
</script>

{#if question}
	<div class="question" style="margin: 0.5em;">
		<span on:click={() => speak(question?.question)} style="cursor: pointer;">
			<img src="/icons/sound-icon.svg" alt="speaker" 
				style="width: 1.4em; margin-right: 0.25em;">
		</span>
		<span>{question?.question}</span>
	</div>
	<div class="choices">
		<div class="choice {picked==1 && 'picked'} {checked && question?.answer==1 && 'answer'}" 
		on:click={() => picked=1}>
			{#if question?.choice1_img}<img src={question?.choice1_img} alt="">{/if}
			<div>{question?.choice1}</div>
		</div>
		<div class="choice {picked==2 && 'picked'} {checked && question?.answer==2 && 'answer'}" 
		on:click={() => picked=2}>
			{#if question?.choice2_img}<img src={question?.choice2_img} alt="">{/if}
			<div>{question?.choice2}</div>
		</div>
		<div class="choice {picked==3 && 'picked'} {checked && question?.answer==3 && 'answer'}" 
		on:click={() => picked=3}>
			{#if question?.choice3_img}<img src={question?.choice3_img} alt="">{/if}
			<div>{question?.choice3}</div>
		</div>
		<div class="choice {picked==4 && 'picked'} {checked && question?.answer==4 && 'answer'}" 
		on:click={() => picked=4}>
			{#if question?.choice4_img}<img src={question?.choice4_img} alt="">{/if}
			<div>{question?.choice4}</div>
		</div>
	</div>
	<div>
		<button 
		class="
			btn-check 
			{answer_status=='correct' && 'btn-green'}
			{answer_status=='wrong' && 'btn-red'}
		" 
		on:click={() => check(question?.answer)} 
		>
			Check
		</button>
	</div>
	{#if pb.authStore.isValid && $currentUser?.id==question?.user}
	<div style="font-size:0.8em; height: 1em; margin-top: 1.2em;">
		<span style="cursor: pointer; padding: 0.25em;" on:click={deleteConfirm}>
			<img src="/icons/trash-icon.svg" alt="" style="width: 1.2em;" />
		</span>
		<span style="cursor: pointer;" on:click={() => showEdit=!showEdit}>
			<img src="/icons/edit-box-icon.svg" alt="" style="width: 1.2em;" />
		</span>
	</div>
	{/if}
{:else}
<div style="text-align: center;">
	Loading...
</div>
{/if}

<style>
	.btn-check{
		border-radius: 0.6em;
	}
	.btn-green{
		color: #FFF;
		background:   #0D0;
		border-color: #0D0;
	}
	.btn-red{
		color: #FFF;
		background:   #F00;
		border-color: #F00;
	}
	.choices{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1em;
	}
	.choice{
		width: 7em;
/*		min-height: 7em;*/
		overflow: hidden;
		box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
		border-radius: 0.4em;
		background: #fff;
		margin: 0.5em;
		padding: 0.5em;
		cursor: pointer;
	}
	.choice img{
		width: 7em;
		height: 7em;
	}
	.picked{
		box-shadow: 0 3px 10px rgb(0 0 255 / 0.5);
	}
	.answer{
		box-shadow: 0 3px 10px rgb(0 255 0 / 0.5);
	}
</style>