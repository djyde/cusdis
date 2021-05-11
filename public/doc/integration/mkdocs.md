# Integrate Cusdis into Mkdocs

[MkDocs](https://www.mkdocs.org/) is a **fast**, **simple** and **convenient** static site generator geared towards building project documentation. Documentation source files are written in Markdown, and configured with a single YAML configuration file.

[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) is the most commonly used theme for [MkDocs](https://www.mkdocs.org/).

Once you have [Python](https://www.python.org/) installed on your system, as well as [pip](https://pip.readthedocs.io/en/stable/installing/), you can easily install mkdocs with material-mkdocs and start building your own site. For more detail, follow the documentation of [Getting started](https://squidfunk.github.io/mkdocs-material/getting-started/)

## Usage

Here's the tutorial for integrating Cusdis into [Material for MkDocs] following its [comment system configuratin](https://squidfunk.github.io/mkdocs-material/setup/adding-a-comment-system/). As for other [themes](https://github.com/mkdocs/mkdocs/wiki/MkDocs-Themes), you can achieve it in a similar way!

### Configure the `mkdocs.yml`

We need add more kv pairs to `mkdocs.yml` with [`extra`](https://www.mkdocs.org/user-guide/configuration/#extra) setting:

```yaml
extra:
  disqus:
  cusdis:
    host:
    app_id:
    lang:
```

The `lang` setting aims to support [cusdis i18n](../advanced/i18n.md?id=current-support-language).

### Rewrite the template

We need first extend the theme and [override the `disqus block`](https://squidfunk.github.io/mkdocs-material/customization/#extending-the-theme) to support Cusdis comment system.

Inorder to override, we can replace it with a file of the same `disqus.html` name and locate in the `overrides directory`:

```txt
.
├─ overrides/
│  └─ partials/
|     └─ partials/
│        └─ disqus.html
└─ mkdocs.yml
```

Add the following line to `disqus.html`:

```html
{% set cusdis = config.extra.cusdis %}
{% if page and page.meta and page.meta.cusdis is string %}
{% set cusdis = page.meta.cusdis %}
{% endif %}
{% if not page.is_homepage %}
<div class="cusdis" style="width:100%">
    <div id="cusdis_thread" data-host="{{ config.extra.cusdis.host }}" data-app-id="{{ config.extra.cusdis.app_id }}"
        data-page-id="{{ page.abs_url|url }}""
          data-page-url=" {{ page.abs_url|url }}" data-page-title="{{ page.title }}">
    </div>
</div>
<script type="text/javascript">
    const src = '{{ config.extra.cusdis.host }}/js/widget/lang/{{ config.extra.cusdis.lang }}.js';
    var createScript = function (url, onload) {
        var s = document.createElement('script');
        s.setAttribute('src', url);
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('charset', 'UTF-8');
        s.async = false;
        if (typeof onload === 'function') {
            if (window.attachEvent) {
                s.onreadystatechange = function () {
                    var e = s.readyState;
                    if (e === 'loaded' || e === 'complete') {
                        s.onreadystatechange = null;
                        onload();
                    }
                };
            } else {
                s.onload = onload;
            }
        }
        var e = document.getElementsByTagName('script')[0] ||
            document.getElementsByTagName('head')[0] ||
            document.head || document.documentElement;
        e.parentNode.insertBefore(s, e);
    }
    createScript(src);
    var schema = document.documentElement.getAttribute('data-user-color-scheme');
    if (schema) {
        document.querySelector('#cusdis_thread').dataset.theme = schema
    }
</script>
<script type="text/javascript">
    var loadComments = function (selectors, loadFunc) {
        loadFunc();
    }
    loadComments('#cusdis_thread', function () {
        createScript("https://cusdis.com/js/cusdis.es.js");
    });
</script>
<noscript>Please enable JavaScript to view the comments</noscript>
{% endif %}
```
