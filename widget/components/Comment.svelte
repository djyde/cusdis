<script>
  import { getContext } from "svelte";

  import Reply from "./Reply.svelte";
  export let comment;
  export let firstFloor = false;
  export let showReplyForm = false;
</script>

<div class:padding={!firstFloor} style="margin-top: 2rem; margin-bottom: 2rem;">
  <div style="margin-bottom: .5rem;">
    <div class="nickname inline font-bold">{comment.by_nickname}</div>
    <div class="date inline">{comment.parsedCreatedAt}</div>
  </div>

  <div class="content" style="margin-bottom: .5rem;">{comment.content}</div>

  <div style="font-size: .5rem; margin-top: .25rem; margin-bottom: .25rem;">
    <button type="button" on:click={_ => { showReplyForm = true }} class="link-btn">Reply</button>
  </div>

  {#if showReplyForm}
    <Reply parentId={comment.id} onSuccess={() => { showReplyForm = false }} />
  {/if}

  {#if comment.replies.length > 0}
    {#each comment.replies as child (child.id)}
      <svelte:self comment={child} />
    {/each}
  {/if}
</div>

<style>
  .padding {
    padding-left: 1rem;
  }
  .font-bold {
    font-weight: bold;
  }

  .inline {
    display: inline-block;
  }

  .nickname {
    font-size: 1rem;
  }

  .content {
    color: rgba(0, 0, 0, 0.8);
    font-size: 1rem;
  }

  .date {
    color: rgba(0, 0, 0, 0.8);
    font-size: 0.8rem;
  }

  .link-btn {
    font-size: 0.8rem;
    text-decoration: underline;
    cursor: pointer;
    border: 0;
    margin: 0;
    background: none;
    padding: 0;
  }
</style>
