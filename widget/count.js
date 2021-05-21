import axios from 'redaxios'

export async function initial() {

  // local testing fallback
  const currentScript = document.currentScript || document.querySelector('#for-testing')

  const { appId, host } = currentScript.dataset
  const resolvedHost = host || 'https://cusdis.com'

  const nodes = document.querySelectorAll('*[data-cusdis-count-page-id]')

  const pageIds = Array.from(nodes).map(el => {
    return el.dataset.cusdisCountPageId
  })

  const results = await axios.get(`${resolvedHost}/api/open/project/${appId}/comments/count`, {
    params: {
      pageIds
    }
  })

  results.data.data.map(result => {
    const el = document.querySelector(`*[data-cusdis-count-page-id=${result.pageId}]`)
    el.innerHTML = result.count
  })
}

initial()
