# Integrate Cusdis into Docsify

[Docsify](https://docsify.js.org) is a powerful document site generator, which also powers this Cusdis document. Cusdis has a built-in Docsify plugin.

## Usage

```html
<script>
  window.$docsify = {
    cusdis: {
      host: 'https://cusdis.com', // change the host if you are using self-hosted Cusdis
      appId: 'xxxx',
    },
  }
</script>
<script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
<script src="https://cusdis.com/js/cusdis.docsify.js"></script> <!-- change the host if you are using self-hosted Cusdis -->

```


