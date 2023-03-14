# Integrate Cusdis into Jekyll

[Jekyll](https://jekyllrb.com/) is a blog-aware static site generator in Ruby.

## Usage

```html
{%- if page.id -%}
<!--Every article has a id, but special pages don't unless you set manually.
This prevents Cusdis from appear everywhere-->
<div id="cusdis_thread"
  data-host="https://cusdis.com"
  data-app-id="YOUR APP ID"
  data-page-id="{{ page.id }}"
  data-page-url="{{ site.url }}{{ page.baseurl }}{{ page.url }}"
  data-page-title="{{ page.title }}"
></div>
<script defer src="https://cusdis.com/js/cusdis.es.js"></script>
{%- endif -%}
```


