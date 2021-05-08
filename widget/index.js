import Widget from "./Widget.svelte";

window.CUSDIS = {}

function render(target) {
  if (target) {
    target.innerHTML = ''
    new Widget({
      target,
      props: {
        attrs: target.dataset,
      },
    });
  }
}

// deprecated
window.renderCusdis = render

window.CUSDIS.renderTo = render

function initial() {
  let target

  if (window.cusdisElementId) {
    target = document.querySelector(`#${window.cusdisElementId}`)
  } else if (document.querySelector('#cusdis_thread')) {
    target = document.querySelector('#cusdis_thread')
  } else if (document.querySelector('#cusdis')) {
    console.warn(
      'id `cusdis` is deprecated. Please use `cusdis_thread` instead',
    )
    target = document.querySelector('#cusdis')
  }

  if (window.CUSDIS_PREVENT_INITIAL_RENDER === true) {
  } else {
    if (target) {
      render(target)
    }
  }
}

// initialize
window.CUSDIS.initial = initial

initial()