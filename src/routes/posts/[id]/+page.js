import { pb, currentUser } from '$lib/pocketbase'

export async function load({ fetch, params }){
	try {
		let post = await pb.collection('posts').getOne(params.id, {expand: 'user',})
		return { post, }
	}
	catch {
		return { post: [] }
	}
}