<script>
  import { getContext } from "svelte";
  export let parentId;

  // form data
  let content = "";
  let nickname = "";
  let email = "";

  let loading = false;

  export let onSuccess;

  const api = getContext("api");
  const setMessage = getContext('setMessage')
  const { appId, pageId, pageUrl, pageTitle } = getContext("attrs");
  const refresh = getContext("refresh");

  async function addComment() {
    if (!content) {
      alert("Content is required");
      return;
    }

    if (!nickname) {
      alert("Nickname is required");
      return;
    }

    try {
      loading = true;
      const res = await api.post("/api/open/comments", {
        appId,
        pageId,
        content,
        nickname,
        email,
        parentId,
        pageUrl,
        pageTitle,
      });
      await refresh();
      teardown();
      setMessage('Your comment has been sent. Please wait for approval.')
    } finally {
      loading = false;
    }
  }

  function teardown() {
    content = "";
    nickname = "";
    email = "";
    onSuccess && onSuccess();
  }
</script>

<div style="margin-top: 1em;">
  <div class="cusdis-reply-info cusdis-field">
    <div>
      <input type="text" placeholder="Nickname" bind:value={nickname} />
    </div>
    <div>
      <input type="text" placeholder="Email" bind:value={email} />
    </div>
  </div>

  <div class="cusdis-field">
    <textarea bind:value={content} placeholder="Reply..." />
  </div>

  <div class="cusdis-field">
    <button cusdis-disabled={loading} class="submit-btn" class:cusdis-disabled={loading} on:click={addComment}>{ loading ? 'Sending...' : 'Post Comment' }</button>
  </div>
</div>

<style>
  textarea,
  input {
    width: 100%;
    border: 2px solid #ddd;
    padding: 0.5em;
    border-radius: 4px;
    outline: none;
    font-family: inherit;
  }

  textarea {
    height: 5em;
    outline: none;
  }

  .cusdis-disabled {
    background-color: rgba(0, 0, 0, .5);
    cursor: not-allowed;
  }

  .cusdis-reply-info div {
    display: inline-block;
  }

  .submit-btn {
    background-color: #ddd;
    border: 0px;
    color: rgba(0, 0, 0, 0.8);
    border-radius: 0;
    padding: 0.5em 1em;
    cursor: pointer;
    border-radius: 2px;
    font-weight: bold;
    font-family: inherit;
  }

  .cusdis-field {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
</style>
