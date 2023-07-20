<script>
	import { onMount, onDestroy } from 'svelte'

	let peer
	let peerId
	let inputId
	let peerId2
	let inputId2
	let conn
	let showConnectForm = false
	let inMessage
	let outMessage

	let messages = []

	function connect(){
		peerId2 = '3f31b76f-c43b-40fd-8b1e-b160-d04bcc83-'+inputId2
		conn = peer.connect(peerId2)
		conn.on("open", () => {
			showConnectForm = false
			outMessage = "Hi, I'm connected."
			conn.send(outMessage)
			messages = [...messages, {dir: 'out', userId: inputId, text: outMessage}]
		})
		conn.on('error', (error) => {
			console.log('Connection error: ', error)
		})
	}

	function handlePeer(){
		peer = new Peer('3f31b76f-c43b-40fd-8b1e-b160-d04bcc83-'+inputId)
		// peer = new Peer()
		peer.on('open', id => {
			showConnectForm = true
			peerId = id
		})
		peer.on("connection", (conn) => {
			conn.on("data", (data) => {
				console.log('Recieved data: ', data)
				messages = [...messages, {dir: 'in', userId: inputId2, text: data}]
			})
			conn.on("open", () => {
				conn.send("Hi, I'm connected.")
			})
			conn.on('error', (error) => {
				console.log('Connection error: ', error)
			})
		})
	}

	function sendMessage(){
		conn?.send(outMessage)
		messages = [...messages, {dir: 'out', userId: inputId, text: outMessage}]
		outMessage = ''
	}

	// onMount(handlePeer)
</script>

<div class="card m-2 p-4">
	<form on:submit|preventDefault={handlePeer} class="m-2">
		<input type="text" bind:value={inputId} class="input m-2 pl-4 w-52" placeholder="Your own ID">
		<button class="btn btn-sm variant-filled">Set ID</button>
	</form>

	{#if showConnectForm}
	<form on:submit|preventDefault={connect} class="m-2">
		<input type="text" bind:value={inputId2} class="input m-2 pl-4 w-52" placeholder="Your friend's ID">
		<button class="btn btn-sm variant-filled">Connect</button>
	</form>
	{/if}

	<div class="card m-2 p-4 min-h-4">
	{#each messages as message}
		<div class="card m-2 p-4 {message?.dir=='in' && 'bg-indigo-300 dark:bg-indigo-500/50'}">
			<div><strong>{message?.userId}</strong></div>
			<div>{message?.text}</div>
		</div>
	{/each}
	</div>

	<form on:submit|preventDefault={sendMessage} class="m-2">
		<input type="text" bind:value={outMessage} class="input m-2 pl-4 w-52" placeholder="Your own ID">
		<button class="btn btn-sm variant-filled">Send</button>
	</form>

</div>