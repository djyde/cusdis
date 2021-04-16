<script>
  import { onMount, setContext } from "svelte";
  import axios from "redaxios";
  import Comment from './components/Comment.svelte'
  import Reply from './components/Reply.svelte'

  export let attrs
  export let comments = [];

  const endpoint = "http://localhost:3000";

  const api = axios.create({
    baseURL: endpoint,
  });

  setContext('api', api)
  setContext('attrs', attrs)
  setContext('refresh', getComments)

  async function getComments() {
    const res = await api.get(`/api/open/comments`, {
      params: {
        appId: attrs.appId,
        pageId: attrs.pageId,
      },
    });
    comments = res.data.data;
  }

  onMount(() => {
    getComments();
  });
</script>

<div class="comment-main">
  {#if comments.length === 0}
    No comment
  {/if}

  <Reply />

  <div>
    {#each comments as comment (comment.id)}
      <Comment comment={comment} firstFloor={true} />
    {/each}
  </div>
</div>

<style>
  .comment-main {
    font-size: 16px;
  }
</style>