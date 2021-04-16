<script>
  import { onMount, setContext } from "svelte";
  import axios from "redaxios";
  import Comment from './components/Comment.svelte'
  import Reply from './components/Reply.svelte'
  export let pageId;
  export let appId;

  export let comments = [];

  const endpoint = "http://localhost:3000";

  const api = axios.create({
    baseURL: endpoint,
  });

  setContext('api', api)
  setContext('info', {
    appId,
    pageId
  })

  async function getComments() {
    const res = await api.get(`/api/open/comments`, {
      params: {
        appId,
        pageId,
      },
    });
    comments = res.data.data;
  }

  onMount(() => {
    getComments();
  });
</script>

<div>
  {#if comments.length === 0}
    No comment
  {/if}

  <Reply />

  <div>
    {#each comments as comment (comment.id)}
      <Comment comment={comment} />
    {/each}
  </div>
</div>
