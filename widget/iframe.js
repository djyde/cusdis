import Widget from './Widget.svelte'

window.CUSDIS = {}

const parent = window.parent
const target = document.querySelector('#root')

const dataset = window.__DATA__
const widget = new Widget({
  target,
  props: {
    attrs: dataset,
  },
})

function requestResize() {
  setTimeout(() => {
    parent.postMessage(
      JSON.stringify({
        from: 'cusdis',
        event: 'resize',
        data: document.documentElement.offsetHeight,
      }),
    )
  })
}

const resizeObserve = new MutationObserver(() => {
  requestResize()
})

resizeObserve.observe(target, {
  childList: true,
  subtree: true
})

window.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data)

  switch (msg.event) {
    case 'dataset': {
      
    }
  }
})
