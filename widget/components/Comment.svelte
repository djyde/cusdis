<script>
  import { getContext } from "svelte";

  import Reply from "./Reply.svelte";
  export let comment;
  export let firstFloor = false;
  export let showReplyForm = false;

  const { showIndicator } = getContext('attrs')
</script>

<div class:cusdis-padding={true} class:cusdis-indicator={showIndicator} style="margin-top: 2rem; margin-bottom: 2rem;">
  <div style="margin-bottom: .5rem;">
    <div class="cusdis-comment-nickname cusdis-inline cusdis-font-bold">{comment.by_nickname}</div>
    {#if comment.moderatorId}
      <span class="mod">MOD</span>
    {/if}
    <div class="cusdis-comment-date cusdis-inline">{comment.parsedCreatedAt}</div>
  </div>

  <div class="cusdis-comment-content" style="margin-bottom: .5rem;">{comment.content}</div>

  <div style="font-size: .5rem; margin-top: .25rem; margin-bottom: .25rem;">
    <button type="button" on:click={_ => { showReplyForm = true }} class="cusdis-link-btn">Reply</button>
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
  .cusdis-padding {
    padding-left: 1rem;
  }

  .cusdis-indicator {
    border-left: 2px solid #ddd;
  }
  .cusdis-font-bold {
    font-weight: bold;
  }

  .cusdis-inline {
    display: inline-block;
  }

  .cudis-comment-nickname {
    font-size: 1rem;
  }

  .cusdis-comment-content {
    color: rgba(0, 0, 0, 0.8);
    font-size: 1rem;
  }

  .cusdis-comment-date {
    color: rgba(0, 0, 0, 0.8);
    font-size: 0.8rem;
  }

  .cusdis-link-btn {
    font-size: 0.8rem;
    text-decoration: underline;
    cursor: pointer;
    border: 0;
    margin: 0;
    background: none;
    padding: 0;
  }

  .mod {
    background-color: #ddd;
    font-size: .1rem;
    padding: .15rem .15rem;
    border-radius: 4px;
    font-weight: bold;
    color: rgba(0,0, 0, .8);
  }
</style>
