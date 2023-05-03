'use client'

import { useEffect, useLayoutEffect } from "react"

export function Bridge() {
  useLayoutEffect(() => {

    // @ts-expect-error
    window.__CUSDIS__ = true

    // auto size

    function postMessage(event, data = {}) {
    const parent = window.parent
      parent.postMessage(
        {
          from: 'cusdis',
          event,
          data,
        },
        "*"
      )
    }
    function requestResize() {
      postMessage('resize', document.documentElement.offsetHeight)
    }

    const resizeObserve = new MutationObserver(() => {
      requestResize()
    })

    resizeObserve.observe(document.body, {
      childList: true,
      subtree: true
    })

    function onMessage(e) {
      console.log(e.data) 
    }

    window.addEventListener('message', onMessage)

    requestResize()


    return () => {
      // console.log('disconnect')
      // resizeObserve.disconnect()
      // window.removeEventListener('message', onMessage)
    }


  }, [])

  return (
    <div></div>
  )
}