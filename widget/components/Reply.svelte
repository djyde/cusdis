<script>
  import { getContext } from "svelte";
  export let parentId;

  // form data
  let content = "";
  let nickname = "";
  let email = "";

  export let onSuccess;

  const api = getContext("api");
  const { appId, pageId } = getContext("attrs");
  const refresh = getContext("refresh");

  async function addComment() {
    const res = await api.post("/api/open/comments", {
      appId,
      pageId,
      content,
      nickname,
      email,
      parentId,
    });
    await refresh();
    teardown();
  }

  function teardown() {
    content = "";
    nickname = "";
    email = "";
    onSuccess && onSuccess();
  }
</script>

<div style="margin-top: 1rem;">
  <div class="reply-info field">
    <div>
      <input type="text" placeholder="nickname" bind:value={nickname} />
    </div>
    <div>
      <input type="text" placeholder="email" bind:value={email} />
    </div>
  </div>

  <div class="field">
    <textarea bind:value={content} placeholder="Reply..." />
  </div>

  <div class="field">
    <button class="submit-btn" on:click={addComment}>Post Comment</button>
  </div>
</div>

<style>
  textarea,
  input {
    width: 100%;
    border: 2px solid #ddd;
    padding: 0.5rem;
    border-radius: 4px;
  }

  textarea {
    height: 4rem;
  }

  input {
  }

  .reply-info div {
    display: inline-block;
  }

  .submit-btn {
    background-color: #ddd;
    border: 0px;
    color: rgba(0, 0, 0, 0.8);
    border-radius: 0;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 2px;
    font-weight: bold;
  }

  .field {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
</style>
