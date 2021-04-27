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
  <div class="comment-main">
    {#if message}
      <div class="cusdis-message">
        {message}
      </div>
    {/if}

    <Reply />

    <div>
      {#if loadingComments}
        <div style="text-align: center; font-size: .8em;">
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
  .cusdis-footer {
    margin-top: 1em;
    font-size: 0.8em;
    text-align: center;
  }
  .comment-main {
    font-size: 17px;
  }
  .cusdis-message {
    background-color: #046582;
    color: #fff;
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
    background-color: #ddd;
  }
</style>
