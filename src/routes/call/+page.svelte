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

	let stream
	let video_on = true
	let audio_on = true
	var video  = {}
	var video2 = {}


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

	function addVideoStream(video, stream) {
		video.srcObject = stream
		// video.setAttribute('src', stream)
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

	function toggleVideo() {
		stream.getTracks().forEach((track) => {
			if (track.readyState == 'live' && track.kind === 'video') {
				// console.log(track.getSettings())
				track.enabled = !track.enabled
				video_on = track.enabled
			}
		})
	}

	function toggleAudio() {
		stream.getTracks().forEach((track) => {
			if (track.readyState == 'live' && track.kind === 'audio') {
				track.enabled = !track.enabled
				audio_on = track.enabled
			}
		})
	}

	onMount(async () =>{
		// { width: 320, height: 240 }
		// { width: 320, }
		stream = await navigator.mediaDevices.getUserMedia({video: { width: 240, }, audio: true})
		addVideoStream(video, stream)
	})

	onDestroy(() => {
		stream?.getTracks()?.forEach((track) => {
			if (track?.readyState == 'live') {
				track?.stop()
			}
		})
	})
</script>

<div class="">

	<div class="w-full max-w-3xl mb-1 mx-auto layer-stack sm:mt-0 md:mt-8 lg:mt-8 xl:mt-8 2xl:mt-8">

 		<video bind:this={video} autoPlay muted playsInline
		class="w-1/4 max-w-3xl mt-0 ml-0 layer-2"></video>

		<video bind:this={video2} autoPlay playsInline style="max-height: 100vh; object-fit: cover;"
		class="w-full max-w-3xl mx-auto bg-black layer-1"></video>

	</div>

	<div class="w-full max-w-3xl mb-2 mx-auto px-2">
		<button on:click={toggleVideo} 
		class="btn btn-sm text-xs m-1 {video_on? '':'text-white bg-gray-600'}">Video</button>
		<button on:click={toggleAudio} 
		class="btn btn-sm text-xs m-1 {audio_on? '':'text-white bg-gray-600'}">Audio</button>
	</div>


	<div class="w-full max-w-3xl my-2 mx-auto p-1">
		<form on:submit|preventDefault={handlePeer} class="">
			<input type="text" bind:value={inputId} class="input m-2 pl-4 w-52" placeholder="Your own ID">
			<button class="btn btn-sm">Set</button>
		</form>

		{#if showConnectForm}
		<input type="text" bind:value={inputId2} class="input m-2 pl-4 w-52" placeholder="Your friend's ID">
		<button class="btn btn-sm" on:click={callToPeer2}>Call</button>
		<div></div>
		<button class="btn btn-sm m-2" on:click={connect}>Connect to Chat</button>
		{/if}


		<div class="card m-2 p-4 min-h-[5em]">
		{#each messages as message}
			<div class="card m-2 p-4 {message?.dir=='in' && 'bg-indigo-300 dark:bg-indigo-500/50'}">
				<div><strong>{message?.userId}</strong></div>
				<div>{message?.text}</div>
			</div>
		{/each}
		</div>

		<form on:submit|preventDefault={sendMessage} class="m-2">
			<input type="text" bind:value={outMessage} placeholder="Message" class="input m-2 pl-4 w-52">
			<button class="btn btn-sm text-xs px-2 py-2">Send</button>
		</form>
	</div>

</div>

<style>
	video {
		transform: scale(-1,1);
	}
	video::-webkit-media-controls-panel {
		transform: scale(-1,1);
	}

	.layer-stack {
		display: grid;
		grid-template-areas: "inner-layer";
	}

	.layer-1 {
		grid-area: inner-layer;
		z-index: 1;
	}

	.layer-2 {
		grid-area: inner-layer;
		z-index: 2;
	}
</style>