import Widget from './Widget.svelte'

const target = document.querySelector("#cusdis");

if (target) {
  new Widget({
    target,
    props: {
      attrs: target.dataset
    }
  });
}
