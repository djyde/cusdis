<script>
  import { getContext } from "svelte";

  import Reply from "./Reply.svelte";
  export let comment;
  export let firstFloor = false;
  export let showReplyForm = false;

  const { showIndicator } = getContext('attrs')
</script>

<div class:cusdis-padding={true} class:cusdis-indicator={showIndicator} style="margin-top: 2em; margin-bottom: 2em;">
  <div style="margin-bottom: .5em;">
    <div class="cusdis-comment-nickname cusdis-inline cusdis-font-bold">{comment.by_nickname}</div>
    {#if comment.moderatorId}
      <span class="mod">MOD</span>
    {/if}
    <div class="cusdis-comment-date cusdis-inline">{comment.parsedCreatedAt}</div>
  </div>

  <div class="cusdis-comment-content" style="margin-bottom: .5em;">{@html comment.parsedContent}</div>

  <div style="margin-top: .25em; margin-bottom: .25em;">
    <button style="" type="button" on:click={_ => { showReplyForm = true }} class="cusdis-link-btn">Reply</button>
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
    padding-left: 1em;
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

  .cusdis-comment-nickname {
    font-size: 1em;
  }

  .cusdis-comment-content {
    color: rgba(0, 0, 0, 0.8);
    font-size: 1em;
  }

  .cusdis-comment-date {
    color: rgba(0, 0, 0, 0.8);
    font-size: 0.8em;
  }

  .cusdis-link-btn {
    font-size: 0.8em;
    text-decoration: underline;
    cursor: pointer;
    border: 0;
    margin: 0;
    background: none;
    padding: 0;
  }

  .mod {
    background-color: #ddd;
    font-size: .8em;
    box-sizing: border-box;
    padding: .15em .4em;
    border-radius: 4px;
    font-weight: bold;
    color: rgba(0,0, 0, .8);
  }
</style>
