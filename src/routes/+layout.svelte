<script>
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import '../styles/global.css'
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import { pb, currentUser } from '../lib/pocketbase'

	let show_side_nav = false
</script>

<AppShell>
<svelte:fragment slot="header">
	<AppBar>

			<div style="display: flex; width: 95vw;">

			<div style="width: 5em;">
			<span style="cursor: pointer;" id="hamburger" on:click={() => show_side_nav = !show_side_nav}>&#x2630;</span>
			<a href="/" style="text-decoration: none;"  class="dark:text-white">Home</a>
			</div>

			<div style="width: 80%;" class="hide-on-mobile">
				<div style="height: 2em; width: 17em; margin: 0 auto;">
					<form method="GET" action>
						<input type="text" name="q" placeholder="&#128269; Search..." 
						style="padding-left: 1em;" class="input border-none">
					</form>
				</div>
			</div>

			<div style="margin: 0 0 0 auto;">
				<LightSwitch />
			</div>

			</div>
	</AppBar>
</svelte:fragment>

<svelte:fragment slot="sidebarLeft">
	<div id="side_nav" style="{show_side_nav? 'display: block;' : 'display: none;'}">
		{#if pb.authStore.isValid && $currentUser}
		<div class="side_nav_item">{$currentUser?.username}</div>
		<form method="POST" action="/logout/">
		<button style="margin-left: 0;" class="btn btn-sm variant-ghost dark:text-white">Logout</button>
		</form>
		<div class="side_nav_item"><a href="/books" class="text-black dark:text-white">Books</a></div>
		<div class="side_nav_item"><a href="/books/create" class="text-gray-500 dark:text-white">+Book</a></div>
		<div class="side_nav_item"><a href="/posts" class="dark:text-white">Posts</a></div>
		<div class="side_nav_item"><a href="/posts/create" class="dark:text-white">+Post</a></div>
		<div class="side_nav_item"><a href="/questions_choosing" class="dark:text-white">Questions</a></div>
		<div class="side_nav_item"><a href="/questions_choosing/create" class="dark:text-white">+Question</a></div>
		<div class="side_nav_item"><a href="/messenger/publicroom" class="dark:text-white">Room</a></div>
		<div class="side_nav_item"><a href="/messenger/directs" class="dark:text-white">Directs</a></div>
		<div class="side_nav_item"><a href="/call" class="dark:text-white">Call</a></div>
		<div class="side_nav_item"><a href="/peerchat" class="dark:text-white">Peer Chat</a></div>
		<div class="side_nav_item">
		</div>
		{:else}
		<div class="side_nav_item"><a href="/posts" class="dark:text-white">Posts</a></div>
		<div class="side_nav_item"><a href="/call" class="dark:text-white">Call</a></div>
		<div class="side_nav_item"><a href="/peerchat" class="dark:text-white">Peer Chat</a></div>
		<div class="side_nav_item"><a href="/login" class="dark:text-white">Signup</a></div>
		<div class="side_nav_item"><a href="/login" class="dark:text-white">login</a></div>
		{/if}
	</div>
</svelte:fragment>

<slot>
  <div style="display: flex;">
    <div style="width: 100%; min-height: 100vh; background: #F8F8F8; border-top: 1px solid #DDD;">
      <slot></slot>
    </div>
  </div>
</slot>
</AppShell>

<style>
  #side_nav {
    font-size: 0.9em;
    width: 12em;
    padding: 1em;
  }
  .side_nav_item {
    padding: 0.5em;
  }
  .side_nav_item:hover {
    font-size: 1.05em;
    font-weight: bold;
  }
  .side_nav_item a {
    text-decoration: none;
  }
  @media (max-width: 640px) {
    .hide-on-mobile{display: none;}
  }
</style>