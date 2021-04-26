<script>
  import { onMount, setContext } from 'svelte'
  import axios from 'redaxios'
  import Comment from './components/Comment.svelte'
  import Reply from './components/Reply.svelte'
  import { t } from './i18n';

  export let attrs
  export let comments = []

  let loadingComments = true

  let message = ''

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

  async function getComments() {
    loadingComments = true
    try {
      const res = await api.get(`/api/open/comments`, {
        params: {
          appId: attrs.appId,
          pageId: attrs.pageId,
        },
      })
      comments = res.data.data
    } finally {
      loadingComments = false
    }
  }

  onMount(() => {
    getComments()
  })
</script>

<div class="comment-main">
  {#if message}
    <div class="cusdis-message">
      {message}
    </div>
  {/if}

  <Reply />

  <div>
    {#if loadingComments}
      <div style="text-align: center; font-size: .8em;">{t('loading')}...</div>
    {:else}
      {#each comments as comment (comment.id)}
        <Comment {comment} firstFloor={true} />
      {/each}
    {/if}
  </div>

  <div class="cusdis-footer">
     <a style="text-decoration: none;" href="https://cusdis.com">{t('powered_by')}</a>
  </div>
</div>

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
</style>
