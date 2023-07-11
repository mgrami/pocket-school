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

{#if pb.authStore.isValid && $currentUser}
	<p>Signed in as {$currentUser.username}</p>
	<button on:click={logout}>Logout</button>
{:else}
	<form on:submit|preventDefault class="card m-2 p-4">
		<input type="text" name="username" placeholder="Username" bind:value={username} class="input px-4">
		<input type="password" name="password" placeholder="Password" bind:value={password} class="input px-4">
		<button on:click={signup} class="btn variant-filled">Signup</button>
		<button on:click={login} class="btn variant-filled">Login</button>
	</form>
{/if}