<script>
  import { getContext } from "svelte";
  export let parentId

  // form data
  let content = ""
  let nickname = ""
  let email = ""

  const api = getContext('api')
  const {
    appId,
    pageId
  } = getContext('info')

  async function addComment(body) {
    const res = await api.post("/api/open/comments", {
      appId,
      pageId,
      content,
      nickname,
      email,
      parentId
    });
  }
</script>

<div>
  <input type="text" placeholder="nickname" bind:value={nickname} />
  <input type="text" placeholder="email" bind:value={email} />

  <textarea bind:value={content} />
  <button on:click={addComment}>comment</button>
</div>

