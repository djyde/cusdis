<script>
import { getContext } from 'svelte';

  import Reply from './Reply.svelte'
  export let comment

  const {
    appId,
    pageId
   } = getContext('info')
</script>

<div style="padding-left: 1rem;">
  <div>{comment.content}</div>
  <div>{comment.createdAt}</div>

  <Reply parentId={comment.id} />

  {#if comment.replies.length > 0}
    {#each comment.replies as child (child.id)}
      <svelte:self comment={child} />
    {/each}
  {/if}

</div>