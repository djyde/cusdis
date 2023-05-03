export const Cusdis = {}

const $thread = document.querySelector('#cusdis_thread')
const $iframe = document.createElement('iframe')
$iframe.style.width = '100%'
$iframe.style.height = '0'
$iframe.style.border = 'none'
$iframe.style.padding = '0'
$iframe.style.margin = '0'

// @ts-expect-error
const data = $thread.dataset

const host: string | undefined = data['host'] || 'https://cusdis.com'
const projectId: string = data['projectId']
const pageTitle = data['pageTitle'] || document.title
const pageUrl =
  data['pageUrl'] ||
  location.protocol + '//' + location.host + location.pathname
const pageId = data['pageId']

const queryString = new URLSearchParams()
queryString.append('p_t', pageTitle)
queryString.append('p_u', pageUrl)
if (pageId) {
  queryString.append('p_id', pageId)
}

const url = `${host}/c/${projectId}?${queryString.toString()}`

$iframe.src = url
$thread.appendChild($iframe)

window.addEventListener('message', (e) => {
  try {
    const msg = e.data
    if (msg.from === 'cusdis') {
      switch (msg.event) {
        case 'resize':
          {
            $iframe.style.height = msg.data + 'px'
          }
          break
          
      }
    }
  } catch (e) {
    console.log(e)
  }
})

function postMessage(event, data?) {
  console.log('post')
  $iframe.contentWindow.postMessage(
    JSON.stringify({
      from: 'cusdis',
      event,
      data,
    }),
    '*',
  )
}

$iframe.onload = function () {
  postMessage('init')
}
