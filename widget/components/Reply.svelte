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
    <button disabled={loading} class="submit-btn" class:disabled={loading} on:click={addComment}>{ loading ? 'Sending...' : 'Post Comment' }</button>
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

  .disabled {
    background-color: rgba(0, 0, 0, .5);
    cursor: not-allowed;
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

  .lds-ring {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
