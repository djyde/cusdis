window.CUSDIS = {}

const makeIframeContent = (target) => {
  const iframeJsPath = `http://localhost:3001/iframe.js`
  return `<!DOCTYPE html>
<html>
  <head>
    <base target="_parent" />
    <script>
      window.__DATA__ = ${JSON.stringify(target.dataset)}
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script src="${iframeJsPath}" type="module">
      
    </script>
  </body>
</html>`
}

let singleTonIframe
function createIframe(target) {
  if (!singleTonIframe) {
    singleTonIframe = document.createElement('iframe')
  }
  // srcdoc dosen't work on IE11
  singleTonIframe.srcdoc = makeIframeContent(target)
  singleTonIframe.style.width = '100%'
  singleTonIframe.style.height = '100%'
  singleTonIframe.style.border = '0'

  return singleTonIframe
}

function render(target) {
  if (target) {
    target.innerHTML = ''
    const iframe = createIframe(target)
    target.appendChild(iframe)

    window.addEventListener('message', (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.from === 'cusdis') {
          switch (msg.event) {
            case 'resize':
              {
                iframe.style.height = msg.data + 'px'
              }
              break
          }
        }
      } catch (e) {}
    })
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
