# JS SDK

Understand how the JS SDK works help you integrate Cusdis to an existed system. 

To embed the comment widget to your web page, you need to put **the element and JS SDK** on the page, at the position where you want to embed to:

```html
<div id="cusdis_thread"
  data-host="https://cusdis.com"
  data-app-id="{{ APP_ID }}"
  data-page-id="{{ PAGE_ID }}"
  data-page-url="{{ PAGE_URL }}"
  data-page-title="{{ PAGE_TITLE }}"
>
<script async src="https://cusdis.com/js/cusdis.es.js"></script>
```

> If you are using self-hosted Cusdis, remember changing the `data-host` and the host in `<script>` to your own domain

## How it Works

1. The SDK will find the element with id `cusdis_thread`, then mount the widget on it.
2. The SDK request the comments for the page with id `data-page-id`, in the website with id (`data-app-id`)
3. When user post a comment, the SDK send a POST request to the API server with the attributes.

## Attributes Reference

- `data-host` **(required)** API server host.
- `data-app-id` **(required)** The website ID.
- `data-page-id` **(required)** Current page ID. Used to identity your page. Should be unique in a website. Such as page slug, permalink.
- `data-page-url` Current page URL. Used to display on dashboard.
- `data-page-title` Current page title. Used to display on dashboard.
- `data-theme`
  - `light` (default)
  - `auto` Automatically set theme by `prefers-color-scheme`
  - `dark`

## API

Cusdis exposes some global APIs on `window.CUSDIS`:

#### window.CUSDIS.initial()

Initialize widget.

#### window.CUSDIS.renderTo(target: HTMLElement)

Render widget to specific DOM element.

#### window.CUSDIS.setTheme(theme: 'dark' | 'light' | 'auto')

Manually set theme. 
