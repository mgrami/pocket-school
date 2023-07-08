<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	export let postId
	let likes = 0
	let liked = false


	async function getLiked(){
		try{
			let { items } = await pb.collection("likes_post").getList(1, 1, {
				filter: `post="${postId}" && user="${$currentUser?.id}"`
			})
			liked = (items?.length > 0)? true : false
		}
		catch(err){
			console.log(err)
		}
	}

	async function getLikes(){
		try{
			let { totalItems } = await pb.collection("likes_post").getList(1, 1, {
				filter: `post="${postId}"`
			})
			likes = totalItems
		}
		catch(err){
			console.log(err)
		}
	}

	async function toggleLike(){
		console.log(pb.authStore.isValid)
		if(!liked){
			try{
				await pb.collection('likes_post').create({
					post: postId,
					user: $currentUser?.id,
				})
				liked = true
				// await getLiked()
				await getLikes()
			}
			catch(err){
				console.log(err)
			}
		}
		else{
			try{
				let record = await pb.collection('likes_post')
					.getFirstListItem(`post="${postId}" && user="${$currentUser?.id}"`)
				await pb.collection('likes_post').delete(record.id)
				liked = false
				// await getLiked()
				await getLikes()
			}
			catch(err){
				console.log(err)
			}
		}
	}

	onMount(async () => {
		await getLiked()
		getLikes()
	})

</script>
<span style="padding-bottom: 1.5em;">{likes}</span>
<img 
	src={liked? "/icons/thumbs-up-black-icon.svg" : "/icons/thumbs-up-line-icon.svg"}
	alt="like" 
	style="width: 1.4em; padding-right: 0.5em; cursor: pointer;" 
	on:click={toggleLike}
/>

<!-- 
<img 
	src="/icons/thumbs-down-line-icon.svg" 
	style="width: 1.4em; padding-left: 0.5em; cursor: pointer; transform: rotateY(180deg);"
/>
 -->