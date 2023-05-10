import { pb, currentUser } from '$lib/pocketbase'

export async function load({ fetch }){
	try{
		const resultList = await pb.collection('posts').getList(1, 50, {
			sort: '-created',
			expand: 'user',
		})
		let posts = resultList.items
		return { posts, }
	}
	catch{
		return { posts: [] }
	}
}