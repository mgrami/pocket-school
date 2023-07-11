<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'
	import { goto } from '$app/navigation'

	let	question_lang = 'us-en'
	let	question = ''
	let	question_img = ''
	let	question_img_on = false
	let	question_text_on = true
	let	question_tts_on = false
	let	choice_img_on = false
	let	choice_text_on = true
	let	choice_tts_on = false
	let	choice_lang = 'us-en'
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

<form class="card m-2 p-4" on:submit|preventDefault={createQuestion}>
	<label class="label mb-4">
		<h1>Question</h1>
		<textarea bind:value={question} dir="auto" class="textarea"></textarea>
	</label>

	<input type="checkbox" bind:checked={question_img_on} class="checkbox">
	<span class="mr-4">Image</span>
	
	{#if question_img_on}
		<input type="text" bind:value={question_img} style="width: 30%; margin-left: 0.25em;" class="input m-4">
	{/if}

	<input type="checkbox" bind:checked={question_text_on} class="checkbox">
	<span class="mr-4">Text Visible</span>

	<input type="checkbox" bind:checked={question_tts_on} class="checkbox">
	<span class="mr-4">TTS</span>

	<select bind:value={question_lang} class="select" style="width: 10%; margin-left: 0.25em;">
		<option value="ir-fa">Persian (Iran)</option>
		<option value="us-en">English (US)</option>
	</select>


	<h1>Choices</h1>

	<input type="checkbox" bind:checked={choice_img_on} class="checkbox">
	<span class="mr-4">Image</span>

	<input type="checkbox" bind:checked={choice_text_on} class="checkbox">
	<span class="mr-4">Text Visible</span>

	<input type="checkbox" bind:checked={choice_tts_on} class="checkbox">
	<span class="mr-4">TTS</span>

	<select bind:value={choice_lang} class="select" style="width: 10%; margin-left: 0.25em;">
		<option value="ir-fa">Persian (Iran)</option>
		<option value="us-en">English (US)</option>
	</select>

	<label class="label mb-4">
		<span>Choice 1</span>
		<textarea bind:value={choice1} dir="auto" class="textarea"></textarea>
	</label>
	{#if choice_img_on}
		<span>Image Link</span>
		<input type="text" bind:value={choice1_img} style="width: 30%; margin-left: 0.25em;" class="input">
	{/if}
	
	<label class="label mb-4">
		<span>Choice 2</span>
		<textarea bind:value={choice2} dir="auto" class="textarea"></textarea>
	</label>
	{#if choice_img_on}
		<span>Image Link</span>
		<input type="text" bind:value={choice2_img} style="width: 30%; margin-left: 0.25em;" class="input">
	{/if}
	
	<label class="label mb-4">
		<span>Choice 3</span>
		<textarea bind:value={choice3} dir="auto" class="textarea"></textarea>
	</label>
	{#if choice_img_on}
		<span>Image Link</span>
		<input type="text" bind:value={choice3_img} style="width: 30%; margin-left: 0.25em;" class="input">
	{/if}
	
	<label class="label mb-4">
		<span>Choice 4</span>
		<textarea bind:value={choice4} dir="auto" class="textarea"></textarea>
	</label>
	{#if choice_img_on}
	<span>Image Link</span>
	<input type="text" bind:value={choice4_img} style="width: 30%; margin-left: 0.25em;" class="input">
	{/if}
	
	<label class="label mb-4">
	<span>Answer</span>
	<input type="number" min="1" max="4" step="1" bind:value={answer} class="input" />
	</label>
	
	<input type="submit" class="btn">
</form>