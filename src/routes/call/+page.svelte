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
		peer.on('call', call => {
			call.answer(stream)
			call.on('stream', stream2 => {
				addVideoStream(video2, stream2)
			})
		})
	}

	function connect(){
		peerId2 = '3f31b76f-c43b-40fd-8b1e-b160-d04bcc83-'+inputId2
		conn = peer.connect(peerId2)
		conn.on("open", () => {
			showConnectForm = false
			conn.send(outMessage)
			messages = [...messages, {dir: 'out', userId: inputId, text: "Hi, I'm connected."}]
		})
		conn.on('error', (error) => {
			console.log('Connection error: ', error)
		})
	}

	function sendMessage(){
		conn?.send(outMessage)
		messages = [...messages, {dir: 'out', userId: inputId, text: outMessage}]
		outMessage = ''
	}

	let video  = {}
	let video2 = {}
	var stream

	function addVideoStream(video, stream) {
		video.srcObject = stream
		video.addEventListener('loadedmetadata', () => {
		video.play()
		})
	}

	function callToPeer2() {
		peerId2 = '3f31b76f-c43b-40fd-8b1e-b160-d04bcc83-'+inputId2
		const call = peer.call(peerId2, stream)
		call.on('stream', stream2 => {
			addVideoStream(video2, stream2)
		})
	}

	onMount(async () =>{
		stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
		// video.muted = true
		addVideoStream(video, stream)
	})
</script>

<div class="card m-2 p-2">
	<form on:submit|preventDefault={handlePeer} class="m-2">
		<input type="text" bind:value={inputId} class="input m-2 pl-4 w-52" placeholder="Your own ID">
		<button class="btn btn-sm variant-filled">Set ID</button>
	</form>

	{#if showConnectForm}
	<form on:submit|preventDefault={connect} class="m-2">
		<input type="text" bind:value={inputId2} class="input m-2 pl-4 w-52" placeholder="Your friend's ID">
		<button class="btn btn-sm variant-filled">Connect</button>
	</form>
	<button class="btn btn-sm variant-filled" on:click={callToPeer2}>Call</button>
	{/if}




	<div class="w-full max-w-xl my-2 mx-auto" style="position: relative; min-height: 100vw;">
		<video bind:this={video}  class="w-1/4 max-w-xl m-1 rounded" muted
			style="position: absolute; z-index: 2;" 
		></video>
		<video bind:this={video2} class="w-full max-w-xl mb-2 mx-auto rounded bg-black"
			style="position: absolute; z-index: 1;"
		></video>
	</div>





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

<style>
	video {
		transform: scale(-1,1);
	}
	video::-webkit-media-controls-panel {
		transform: scale(-1,1);
	}
</style>