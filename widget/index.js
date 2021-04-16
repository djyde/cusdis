import Widget from './Widget.svelte'

const target = document.querySelector("#comment");

if (target) {
  const { appId, pageId } = target.dataset
  new Widget({
    target,
    props: {
      appId, pageId
    }
  });
}
