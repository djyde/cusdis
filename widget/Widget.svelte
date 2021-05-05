<script>
  import { onMount, setContext } from 'svelte'
  import axios from 'redaxios'
  import Comment from './components/Comment.svelte'
  import Reply from './components/Reply.svelte'
  import { t } from './i18n'

  export let attrs
  export let commentsResult

  let page = 1

  let loadingComments = true

  let message = ''

  let error

  let theme = attrs.theme || 'light'

  const api = axios.create({
    baseURL: attrs.host,
  })

  function setMessage(msg) {
    message = msg
  }

  setContext('api', api)
  setContext('attrs', attrs)
  setContext('refresh', getComments)
  setContext('setMessage', setMessage)

  async function getComments(p = 1) {
    loadingComments = true
    try {
      const res = await api.get(`/api/open/comments`, {
        params: {
          page: p,
          appId: attrs.appId,
          pageId: attrs.pageId,
        },
      })
      commentsResult = res.data.data
    } catch (e) {
      error = e
    } finally {
      loadingComments = false
    }
  }

  function onClickPage(p) {
    page = p
    getComments(p)
  }

  onMount(() => {
    getComments()
  })
</script>

{#if !error}
  <div class='cusdis-comment-main' class:dark={theme === 'dark'} class:auto={theme === 'auto'}>
    {#if message}
      <div class="cusdis-message">
        {message}
      </div>
    {/if}

    <Reply />

    <div>
      {#if loadingComments}
        <div
          class="cusdis-loading-text"
          style="text-align: center; font-size: .8em;"
        >
          {t('loading')}...
        </div>
      {:else}
        {#each commentsResult.data as comment (comment.id)}
          <Comment {comment} firstFloor={true} />
        {/each}
        {#if commentsResult.pageCount > 1}
          <div class="cusdis-paginator">
            {#each Array(commentsResult.pageCount) as _, index}
              <button
                class:selected={page === index + 1}
                class="cusdis-pagination-button"
                on:click={(_) => onClickPage(index + 1)}>{index + 1}</button
              >
            {/each}
          </div>
        {/if}
      {/if}
    </div>

    <div class="cusdis-footer">
      <a style="text-decoration: none;" href="https://cusdis.com"
        >{t('powered_by')}</a
      >
    </div>
  </div>
{/if}

<style>
  :root {
    --cusdis--color-text-default: rgba(0, 0, 0, 0.8);
    --cusdis--color-input-border: #ddd;
    --cusdis--color-btn-text: rgba(0, 0, 0, 0.8);
    --cusdis--color-btn-bg-default: #ddd;
    --cusdis--color-btn-bg-disabled: rgba(0, 0, 0, 0.5);
    --cusdis--color-btn-border: none;
    --cusdis--color-message-text: #fff;
    --cusdis--color-message-bg: #046582;
    --cusdis--color-pagination-bg-selected: #ddd;
    --cusdis--color-comment-indicator-border: #ddd;
    --cusdis--color-comment-username-text: #000;
    --cusdis--color-mod-text: rgba(0, 0, 0, 0.8);
    --cusdis--color-mod-bg: #ddd;
  }

  .dark {
    --cusdis--color-text-default: rgba(243, 244, 246, 0.8);
    --cusdis--color-input-border: rgb(229, 231, 235);
    --cusdis--color-btn-text: var(--cusdis--color-text-default);
    --cusdis--color-btn-bg-default: rgb(229, 231, 235, 0);
    --cusdis--color-btn-bg-disabled: rgba(55, 65, 81, 0.5);
    --cusdis--color-btn-border: 2px solid var(--cusdis--color-text-default);
    --cusdis--color-message-text: rgba(243, 244, 246, 0.8);
    --cusdis--color-pagination-bg-selected: rgb(229, 231, 235);
    --cusdis--color-comment-indicator-border: rgb(229, 231, 235);
    --cusdis--color-comment-username-text: #fff;
    --cusdis--color-mod-text: rgba(55, 65, 81, 0.8);
    --cusdis--color-mod-bg: rgb(229, 231, 235);
  }

  @media (prefers-color-scheme: dark) {
    .auto {
      --cusdis--color-text-default: rgba(243, 244, 246, 0.8);
      --cusdis--color-input-border: rgb(229, 231, 235);
      --cusdis--color-btn-text: var(--cusdis--color-text-default);
      --cusdis--color-btn-bg-default: rgb(229, 231, 235, 0);
      --cusdis--color-btn-bg-disabled: rgba(55, 65, 81, 0.5);
      --cusdis--color-btn-border: 2px solid var(--cusdis--color-text-default);
      --cusdis--color-message-text: rgba(243, 244, 246, 0.8);
      --cusdis--color-message-bg: #046582; /* no need change for now */
      --cusdis--color-pagination-bg-selected: rgb(229, 231, 235);
      --cusdis--color-comment-indicator-border: rgb(229, 231, 235);
      --cusdis--color-comment-username-text: #fff;
      --cusdis--color-mod-text: rgba(55, 65, 81, 0.8);
      --cusdis--color-mod-bg: rgb(229, 231, 235);
    }
  }

  .cusdis-footer {
    margin-top: 1em;
    font-size: 0.8em;
    text-align: center;
    color: var(--cusdis--color-text-default);
  }

  .cusdis-loading-text {
    color: var(--cusdis--color-text-default);
  }
  .cusdis-comment-main {
    font-size: 17px;
  }
  .cusdis-message {
    background-color: var(--cusdis--color-message-bg);
    color: var(--cusdis--color-message-text);
    padding: 0.5em;
    font-size: 1em;
  }

  .cusdis-paginator {
    display: flex;
  }

  .cusdis-pagination-button {
    background: none;
    border: none;
    cursor: pointer;
    margin-right: 0.5em;
    padding: 0.2em 0.5em;
    box-sizing: border-box;
  }

  .cusdis-pagination-button.selected {
    background-color: var(--cusdis--color-pagination-bg-selected);
  }

  .cusdis-footer a {
    color: var(--cusdis--color-text-default);
  }
</style>
