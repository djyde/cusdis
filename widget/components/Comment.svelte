<script>
  import { getContext } from 'svelte'
  import { t } from '../i18n'

  import Reply from './Reply.svelte'
  export let comment
  export let showReplyForm = false
  export let isChild = false

  const { showIndicator } = getContext('attrs')

</script>

<div
  class="my-4"
  class:pl-4={isChild}
  class:border-l-2={isChild}
  class:border-color-gray-200={isChild}
  class:cusdis-indicator={showIndicator}
>
  <div class="flex">
    <div class="mr-2 font-medium">
      {comment.by_nickname}
    </div>

    {#if comment.moderatorId}
      <div class="mr-2">
        <span>MOD</span>
      </div>
    {/if}
  </div>

  <div class="text-gray-500 text-sm">
    {comment.parsedCreatedAt}
  </div>

  <div class="text-gray-500 my-2">
    {@html comment.parsedContent}
  </div>

  {#if comment.replies.data.length > 0}
    {#each comment.replies.data as child (child.id)}
      <svelte:self isChild={true} comment={child} />
    {/each}
  {/if}

  <div>
    <button
      class="font-medium text-sm text-gray-500"
      type="button"
      on:click={(_) => {
        showReplyForm = !showReplyForm
      }}>{t('reply_btn')}</button
    >
  </div>


  {#if showReplyForm}
    <div class="mt-4 pl-4 border-l-2 border-gray-200">
      <Reply
        parentId={comment.id}
        onSuccess={() => {
          showReplyForm = false
        }}
      />
    </div>
  {/if}


</div>

<style>
  /* .cusdis-padding {
    padding-left: 1em;
  }

  .cusdis-indicator {
    border-left: 2px solid;
    border-left-color: var(--cusdis--color-comment-indicator-border);
  }
  .cusdis-font-bold {
    font-weight: bold;
  }

  .cusdis-inline {
    display: inline-block;
  }

  .cusdis-comment-nickname {
    font-size: 1em;
    color: var(--cusdis--color-comment-username-text);
  }

  .cusdis-comment-content {
    color: var(--cusdis--color-text-default);
    font-size: 1em;
  }

  .cusdis-comment-date {
    color: var(--cusdis--color-text-default);
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
    color: var(--cusdis--color-text-default);
  }

  .cusdis-mod {
    background-color: var(--cusdis--color-mod-bg);
    font-size: 0.8em;
    box-sizing: border-box;
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-weight: bold;
    color: var(--cusdis--color-mod-text);
  } */

</style>
