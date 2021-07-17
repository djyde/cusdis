# Show comment count

Sometimes you want to show the comments count of a page. You can put `js/cusdis-count.umd.js` on the bottom of `<body>`. And add the attribute `data-cusdis-count-page-id="{{ PAGE ID }}"` in the elements which you want to display count number.

```html
<body>
  <div>
    <h1>Post Title</h1>
    <span data-cusdis-count-page-id="{{ PAGE ID }}">0</span> comments
  </div>
  <script defer data-host="https://cusdis.com" data-app-id="{{ APP ID }}" src="https://cusdis.com/js/cusdis-count.umd.js"></script>
</body>
```

This script will collect all `data-cusdis-count-page-id` in current page and fetch the comments count. Then replace the count number to the element.

!> Don't forget to change `https://cusdis.com` to your own domain if you are using self-host version.

?> If there are more than one element with `data-cusdis-count-page-id`, the script will batch the query in one.

## API

This UMD script expose `CUSDIS_COUNT` on `window` object.

### window.CUSDIS_COUNT.initial()

Manually update the count in the page.