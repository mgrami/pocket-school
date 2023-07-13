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
			<div style="background: #EEE; height: 2em; width: 17em; margin: 0 auto; border-radius: 1em;">
			<form id="search-form" method="GET" action>
				<input type="text" name="q" style="border-top-left-radius: 1em; border-bottom-left-radius: 1em; padding-left: 1em; background: transparent;  border: none;">
				<button type="submit" style=" border: none;">
					<img src="/icons/search-icon.svg" alt style="width: 0.9em;">
				</button>
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
		<div class="side_nav_item"><a href="/chat" class="dark:text-white">Chat</a></div>
		<div class="side_nav_item">
		</div>
		{:else}
		<div class="side_nav_item"><a href="/posts" class="dark:text-white">Posts</a></div>
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
  .navbar {
/*    background: #FFF;*/
/*    color: #aaa;*/
    padding-top: 1em;
    padding-bottom: 1em;    
    padding-left: 0.5em;
    margin-bottom: 0;
  }
  .navbar a {
/*    color: #aaa;*/
    margin-left: 1em;
  }
  .navbar button {
/*    background: #EEE;*/
/*    color: #aaa;*/
    padding: 0;
    margin: 0;
    margin-left: 1em;
    border: none;
    cursor: pointer;
  }
  #side_nav {
    font-size: 0.9em;
    height: 100vh;
    width: 9em;
    max-width: 15%;
    padding: 1em;
  }
  #side_nav a {
/*    color: #FFF;*/
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
  #search-form {
    height: 2em;
/*    width: 17em;*/
    margin: 0 auto;
  }
  #search-form input {
    margin-right: 0;
    padding: 0.2em;
    height: 2em;
/*    width: 14em;*/
  }
  #search-form button {
/*    background: #EEE;*/
    margin-left: 0;
    padding: 0.2em;
    height: 2em;
    width: 2em;
  }
  @media (max-width: 640px) {
    .hide-on-mobile{display: none;}
  }
</style>