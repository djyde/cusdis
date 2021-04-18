import Widget from "./Widget.svelte";


function render(target) {
  if (target) {
    new Widget({
      target,
      props: {
        attrs: target.dataset,
      },
    });
  }
}

window.renderCusdis = render

render(document.querySelector(window.cusdisTag || "#cusdis"));