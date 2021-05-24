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

function postMessage(event, data = {}) {
  parent.postMessage(
    JSON.stringify({
      from: 'cusdis',
      event,
      data,
    }),
  )
}

postMessage('onload')
requestResize()

function requestResize() {
  postMessage('resize', document.documentElement.offsetHeight)
}

const resizeObserve = new MutationObserver(() => {
  requestResize()
})

resizeObserve.observe(target, {
  childList: true,
  subtree: true
})
