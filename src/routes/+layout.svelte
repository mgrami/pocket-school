<script>
	import '../styles/global.css'
	import { currentUser } from '../lib/pocketbase'

	let show_side_nav = false
</script>

<header>
	<nav class="navbar">
		<div style="display: flex; width: 100%;">

		<div style="width: 5em;">
		<span style="cursor: pointer;" id="hamburger" on:click={() => show_side_nav = !show_side_nav}>&#9776;</span>
		<a href="/" style="text-decoration: none;">Home</a>
		</div>

		<div style="width: 80%;" class="hide-on-mobile">
		<div style="background: #EEE; height: 2em; width: 17em; margin: 0 auto; border-radius: 1em;">
		<form id="search-form" method="GET" action="">
			<input type="text" name="q" 
				style="border-top-left-radius: 1em; border-bottom-left-radius: 1em; padding-left: 1em;">
			<button type="submit">
				<img src="/icons/search-icon.svg" style="width: 0.9em;">
			</button>
		</form>
		</div>
		</div>

		</div>
	</nav>
</header>

<main>
	<div style="display: flex;">
    <div id="side_nav" style={show_side_nav? 'display: block;' : 'display: none;'}>
      {#if $currentUser}
      <div class="side_nav_item">{$currentUser?.username}</div>
      <div class="side_nav_item"><a href="/posts">Posts</a></div>
      <div class="side_nav_item"><a href="/posts/create">New Post</a></div>
      <div class="side_nav_item"><a href="/chat">Chat</a></div>
      <div class="side_nav_item">
      <form method="POST" action="/logout/">
      <button style="background: #FFF; margin-left: 0;">Logout</button>
      </form>
      </div>
      {:else}
      <div class="side_nav_item"><a href="/posts">Posts</a></div>
      <div class="side_nav_item"><a href="/login">Signup</a></div>
      <div class="side_nav_item"><a href="/login">login</a></div>
      {/if}
    </div>
    <div style="width: 100%; background: #F8F8F8; border-top: 1px solid #DDD;">
			<slot/>
		</div>
	</div>
</main>

<footer></footer>

<style>
  .navbar {
    background: #FFF;
    color: #aaa;
    padding-top: 1em;
    padding-bottom: 1em;    
    padding-left: 0.5em;
    margin-bottom: 0;
  }
  .navbar a {
    color: #aaa;
    margin-left: 1em;
  }
  .navbar button {
    background: #EEE;
    color: #aaa;
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
    color: #555;
  }
  #side_nav button {
    color: #555;
    padding: 0;
    margin: 0;
    margin-left: 1em;
    border: none;
    cursor: pointer;
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
    background: #EEE;
    margin-left: 0;
    padding: 0.2em;
    height: 2em;
    width: 2em;
  }
  @media (max-width: 640px) {
    .hide-on-mobile{display: none;}
  }
</style>