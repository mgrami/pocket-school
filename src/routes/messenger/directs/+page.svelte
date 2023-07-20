<script>
	import { onMount, onDestroy } from 'svelte'
	import { pb, currentUser } from '$lib/pocketbase'

	let directs = []
	let unsubscribe = () => {}

	onMount(async () => {
		const resultList = await pb.collection('directs').getList(1, 50, {
			sort: 'created',
			expand: 'members',
		})
		directs = resultList.items
		unsubscribe = await pb.collection('directs').subscribe('*', async ({action, record}) => {
			if(action === 'create'){
				// const user = await pb.collection('users').getOne(record.user)
				// record.expand ={ user }
				directs = [...directs, record]
			}
			if(action === 'delete'){
				directs = directs.filter(dir => dir.id !== record.id)
			}
		})
	})

	onDestroy(()  => {
		unsubscribe()
	})
</script>

<div class="m-2 p-4">
	{#each directs as direct (direct.id)}
		<div class="m-2">
			<div class="msg-text">
<!-- <div>{JSON.stringify(direct?.expand?.members.filter(m => m.id !== $currentUser?.id)[0])}</div> -->
				<p>
					<a href="/messenger/directs/{direct?.id}" class="dark:text-white">
						{(direct?.expand?.members.filter(m => m.id !== $currentUser?.id)[0])?.username}
					</a>
				</p>
			</div>
		</div>
	{/each}
</div>