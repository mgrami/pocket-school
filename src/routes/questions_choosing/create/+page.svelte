<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import { goto } from '$app/navigation'

	let	question_lang = 'us-eng'
	let	question = ''
	let	question_img = ''
	let	question_img_on = false
	let	question_text_on = true
	let	question_tts_on = false
	let	choice_img_on = false
	let	choice_text_on = true
	let	choice_tts_on = false
	let	choice_lang = 'us-eng'
	let	choice1 = ''
	let	choice1_img = ''
	let	choice2 = ''
	let	choice2_img = ''
	let	choice3 = ''
	let	choice3_img = ''
	let	choice4 = ''
	let	choice4_img = ''
	let	answer = 1

	async function createQuestion(){
		let data = {
			question_lang,
			question,
			question_img,
			question_img_on,
			question_text_on,
			question_tts_on,
			choice_img_on,
			choice_text_on,
			choice_tts_on,
			choice_lang,
			choice1,
			choice1_img,
			choice2,
			choice2_img,
			choice3,
			choice3_img,
			choice4,
			choice4_img,
			answer,
			user: $currentUser.id,
		}
		try{
			let record = await pb.collection('questions_choosing').create(data)
			goto('/questions_choosing')
		}
		catch(err){
			console.log(err)
		}
	}
</script>

<form class="form-post" on:submit|preventDefault={createQuestion}>
	<p>Question</p>
	<textarea bind:value={question} dir="auto"></textarea>
	<p></p>
	<span>Question Image</span>
	<input type="checkbox" bind:checked={question_img_on} style="width: 5%; margin-left: 0.25em;">
	{#if question_img_on}
	<input type="text" bind:value={question_img} style="width: 30%; margin-left: 0.25em;">
	{/if}
	<p></p>
	<span>Question Text Visible:</span>
	<input type="checkbox" bind:checked={question_text_on} style="width: 5%; margin-left: 0.25em;">
	<span>Question TTS:</span>
	<input type="checkbox" bind:checked={question_tts_on} style="width: 5%; margin-left: 0.25em;">
	<span>Question language:</span>
	<input type="text" bind:value={question_lang} style="width: 10%; margin-left: 0.25em;">
	<p></p>

	<p></p>
	<span>Choices Image On:</span>
	<input type="checkbox" bind:checked={choice_img_on} style="width: 5%; margin-left: 0.25em;">
	<span>Choices Text Visible:</span>
	<input type="checkbox" bind:checked={choice_text_on} style="width: 5%; margin-left: 0.25em;">
	<span>Choices TTS:</span>
	<input type="checkbox" bind:checked={choice_tts_on} style="width: 5%; margin-left: 0.25em;">
	<span>Choices language:</span>
	<input type="text" bind:value={choice_lang} style="width: 10%; margin-left: 0.25em;">
	<p></p>

	<p>Choice 1</p>
	<textarea bind:value={choice1} dir="auto"></textarea>
	{#if choice_img_on}
	<br/>
	<span>Image</span>
	<input type="text" bind:value={choice1_img} style="width: 30%; margin-left: 0.25em;">
	{/if}
	
	<p>Choice 2</p>
	<textarea bind:value={choice2} dir="auto"></textarea>
	{#if choice_img_on}
	<br/>
	<span>Image</span>
	<input type="text" bind:value={choice2_img} style="width: 30%; margin-left: 0.25em;">
	{/if}
	
	<p>Choice 3</p>
	<textarea bind:value={choice3} dir="auto"></textarea>
	{#if choice_img_on}
	<br/>
	<span>Image</span>
	<input type="text" bind:value={choice3_img} style="width: 30%; margin-left: 0.25em;">
	{/if}
	
	<p>Choice 4</p>
	<textarea bind:value={choice4} dir="auto"></textarea>
	{#if choice_img_on}
	<br/>
	<span>Image</span>
	<input type="text" bind:value={choice4_img} style="width: 30%; margin-left: 0.25em;">
	{/if}
	
	<p>Answer</p>
	<input type="number" min="1" max="4" step="1" bind:value={answer} />
	<input type="submit">
</form>
<style>
	.form-post {
		/*max-width: 400px;*/
		width: 90%;
		margin: 3em auto;
		padding: 1em;
/*		text-align: center;*/
		background: #FFF;
		box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
		border-radius: 0.2em;
	}
	input {
		width: 100%;
		max-width: 936px;
		margin: 0.25em auto;
		border: 2px solid #EEE;
		border-radius: 0.3em;
	}
	textarea {
		width: 100%;
		max-width: 936px;
		margin: 0.25em auto;
		border: 2px solid #EEE;
		border-radius: 0.3em;
	}
	input[type=submit] {
		cursor: pointer;
		width: 100%;
		background: #3861FB;
		color: #FFF;
		border-color: #3861FB;
		margin-top: 0.5em;
	}
/*	.errorlist {
		color: #E00
	}*/
/*	p label {
		margin-bottom: 0.5em;
		padding-left: 1em;
		text-align: left;
	}*/
</style>