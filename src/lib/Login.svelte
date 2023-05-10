<script>
	import { pb, currentUser } from './pocketbase'

	let username = ''
	let password = ''

	async function login(){
		await pb.collection('users').authWithPassword(username, password)
	}
	async function signup(){
		try {
			const data = { username, password, passwordConfirm: password, name: 'hi' }
			const createdUser = pb.collection('users').create(data)
			await login()
		}
		catch(err) {
			console.log(err)
		}
	}
	function logout(){
		pb.authStore.clear()
	}

</script>

{#if $currentUser}
	<p>Signed in as {$currentUser.username}</p>
	<button on:click={logout}>Logout</button>
{:else}
	<form on:submit|preventDefault>
		<input type="text" name="username" placeholder="Username" bind:value={username}>
		<input type="password" name="password" placeholder="Password" bind:value={password}>
		<button on:click={signup}>Signup</button>
		<button on:click={login}>Login</button>
	</form>
{/if}