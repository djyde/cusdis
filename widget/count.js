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

  Array.from(nodes).forEach(el => {
    el.innerHTML = results.data.data[el.dataset.cusdisCountPageId]
  })
}

initial()
