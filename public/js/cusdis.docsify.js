function CusdisPlugin(hook, vm) {
  window.cusdisTag = 'cusdis_thread'

  const config = vm.config.cusdis

  const { appId, host } = config;

  const dom = Docsify.dom

  hook.init(_ => {
    const script = dom.create("script");
    script.async = true;
    script.src = `http://localhost:3000/js/cusdis.es.js`;
    script.setAttribute("data-timestamp", Number(new Date()));
    dom.appendTo(dom.body, script);
  })

  hook.afterEach((html, next) => {
    // const cusdisFooter = `
    // <div id="cusdis"
    //   data-host="${host}"
    //   data-app-id="${appId}"
    //   data-page-id="${vm.route.path}"
    //   data-page-title="${vm.route.path}"
    // ></div>
    // `;

    // next(html + cusdisFooter);
    next(html)
  });

  function createCusdis() {
    const div = document.createElement('div')
    div.style.marginTop = '4rem'
    div.dataset.appId = appId
    div.dataset.pageId = vm.route.path
    div.dataset.pageTitle = vm.route.path
    div.dataset.host = host
    return div
  }

  hook.doneEach(() => {
    const cusdis = createCusdis()
    dom.find('#main').append(cusdis)
    console.log(cusdis)
    window.renderCusdis(cusdis);
  })
}

window.$docsify.plugins = (window.$docsify.plugins || []).concat(CusdisPlugin);
