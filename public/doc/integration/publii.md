# Integrate Cusdis into Publii

[Publii](https://getpublii.com/) is a free and open source static site generator and Content Management System (CMS) designed to create a personal blog, portfolio, or corporate website. Publii sites are built using handlebars.js, HTML, CSS, json, and Javascript.

Once you have Publii [downloaded](https://getpublii.com/download/) on your system, as well as a [theme installed](https://getpublii.com/docs/installing-and-updating-publii-themes.html), you can easily get started building your own site. For more details, follow the documentation for [Users](https://getpublii.com/docs/) and [Developpers](https://getpublii.com/dev/).

## Simple Method: Plugin

Publii has created a [free plugin](https://marketplace.getpublii.com/plugins/cusdis-comments/) to easily intergrate Cusdis on any site. To do so, follow these steps:

1. Open Publii’s App Menu by clicking on the three dots icon in the top-right of the app UI; this icon is always visible except when creating or editing a new post, tag or menu.
2. In the menu that appears, click on Plugins. This will take you to the Plugins page where you can see any plugins that you have installed.
3. Click on the Get More Plugins box to open the Publii Plugins Marketplace in our browser.
4. Select the [Cusdis Comments plugin](https://marketplace.getpublii.com/plugins/cusdis-comments/) and click on the Download button under the description to download the zipped install package.
5. Once the download has finished, in the Plugins screen of the Publii app, click on the Install Plugin button at the top of the page. This will open your file explorer; browse to the folder where you downloaded your plugin, and select it. Publii will automatically install the plugin and add it to the list of available plugins in both the Plugins and Tools & Plugins pages in Publii.

For more details on activating and using the plugin, [consult Publii's plugin page](https://getpublii.com/docs/cusdis-comments.html).

## Manual Method: Edit Theme Files (Advanced)
Here's the older method for integrating Cusdis into Publii by manually editing the theme files.

Granted, you could copy paste your custom Cusdis code directly into your Publii post editor using the WYSIWYG HTML source code view. That said, this method is more efficient in the long run for multiple posts.

In terms of customizing themes, you can edit the theme files directly, but Publii recommends creating an override folder. For more info, consult the [Theme overrides article](https://getpublii.com/dev/theme-overrides/) and [this forum post](https://forum.getpublii.com/topic/post-template-adress-templates/#post-6310)


### Create a `cusdis.hbs` partial

Go to the file directory for your Publii websites. If you cannot find this file directory: In Publii, click on the three vertical dots at the top right and click on "App Settings". Scroll to "Files location" > "Sites location".

Head to the the partials folder of your site's theme: 

Publii > sites > *NAME-OF-SITE* > input > themes > *THEME-NAME* > partials

```txt
.
├─ Publii/
│  └─ sites/
|     └─ NAME-OF-SITE/
│        └─ input/
|           └─ themes/
|              └─ THEME-NAME/
|                 └─ partials
.
```

Create a partial where you will store the Cusdis code. For this tutorial, let's call it `cusdis.hbs`. Make sure that the file you name has the `.hbs` file extension.


### Add the code
Paste the following code inside your cusdis partial:

```html
<div id="cusdis_thread"
  data-host="https://cusdis.com"
  data-app-id="YOUR APP ID"
  data-page-id="{{id}}"
  data-page-url="{{url}}"
  data-page-title="{{title}}"
></div>

<script async defer src="https://cusdis.com/js/cusdis.es.js"></script>
```

You can find the `data-app-id` link on your Cusdis dashboard by clicking on the site and clicking on "Settings":

![image](https://user-images.githubusercontent.com/55474996/143308433-e17d5131-aa90-4bac-9352-fb7ca28cd8cf.png)

If you are using self-hosted Cusdis, remember to change the `data-host` in the div and the host in the `<script>` tag to your own domain.

Notice that this code uses Publii's `{{id}}`, `{{url}}`, and `{{title}}` tags. This ensures that once your site output is generated, the correct page ID, URL, and title will automatically be populated by Publii's rendering engine. You can read more about these tags [here](https://getpublii.com/dev/post-tags/).


### Insert the partial in the respective post templates
Depending on your theme, you will have to insert the cusdis partial to all the post templates. You will find these here:

Publii > sites > *NAME-OF-SITE* > input > themes > *THEME-NAME*
```txt
.
├─ Publii/
│  └─ sites/
|     └─ NAME-OF-SITE/
│        └─ input/
|           └─ themes/
|              └─ THEME-NAME
.
```

All themes come with the `post.hbs` template, and some may have variations such as `post-*NAME_OF_VARIATION*.hbs`. Since nearly all Publii themes come with Disqus bundled, you could search up the "`{{> disqus}}`" tag in your theme's folder and replace it with "`{{> cusdis}}`" or whatever name you gave to your cusdis partial.

Here's an example of what you would replace in `post.hbs`:

Old code:
```html
{{#if postViewConfig.displayComments}}
  <div class="post__comments">
    <div class="wrapper">
      {{{@commentsCustomCode}}} <! -- can remove this line if you don't want other comment plugins-->
    </div>
  </div>
{{/if}}
```

Replaced with:

```html
{{#if postViewConfig.displayComments}}
  <div class="post__comments">
    <div class="wrapper">
    <h2 class="h5">{{ translate 'post.comments' }}</h2> <! -- added this line -->
      {{> cusdis}} <! -- added this line -->
    </div>
  </div>
{{/if}}
```

Make sure to keep the `{{#if}}` statement so that you are able to enable and disable the comment section from your Post Editor and "Theme Settings" > "[Post Options](https://getpublii.com/docs/theme-settings.html#theme-settings)".

From here, your Cusdis widget should be working when you preview it and host it on a server. Keep in mind, though, that any comments you leave in "Preview" won't work appear on the site hosted online because the URL will be different.


## Optional: Configure the `data-app-id` and `data-host` from your Theme Settings
If you are building a Publii theme for someone else or to share with the public, it might be useful to add a section for Cusdis in the Themes Settings using the [Theme Settings API](https://getpublii.com/dev/theme-settings-api/), much like the one for Disqus.

Here are the steps to do so:


### Edit the `config.json` to add a section in the Theme Settings
Open the `config.json` file for your theme. You will find it here:

Publii > sites > *NAME-OF-SITE* > input > themes > *THEME-NAME*
```txt
.
├─ Publii/
│  └─ sites/
|     └─ NAME-OF-SITE/
│        └─ input/
|           └─ themes/
|              └─ THEME-NAME
.
```

Scroll to `"customConfig": [` and add two text "type" entries inside the JSON array. Consult Publii's [Theme Settings API Guide](https://getpublii.com/dev/theme-settings-api/). You could also replicate how the Disqus section is formatted. To jump to it, use `CTRL + F` to find "Disqus" in the `config.json` file.

Here is an example of what you could add:

```json
        {
            "name": "commentCusdisDataHost",
            "label": "Cusdis data host",
            "group": "Comments",
            "placeholder": "Enter your Cusdis data-host (no quotation marks \"\")",
            "note": "You can find this in your Cusdis account settings. If you are using their hosted version, the data host will be \"https://cusdis.com\".<br /><br /> Please visit https://cusdis.com/doc#/advanced/sdk to find more details. <br /><br /><span>Do not forget to enable comments under Post View tab.</span>",
            "value": "",
            "type": "text"
        },
        {
            "name": "commentCusdisDataAppID",
            "label": "Cusdis data app ID",
            "group": "Comments",
            "placeholder": "Enter your Cusdis data-app-id (no quotation marks \"\")",
            "note": "You can find this in your Cusdis account settings.<br /><br /> Please visit https://cusdis.com/doc#/advanced/sdk to find more details. <br /><br /><span>Do not forget to enable comments under Post View tab.</span>",
            "value": "",
            "type": "text"
        },
```


### Edit your cusdis partial
Edit your `cudis.hbs` file so that the code looks like this:

```html
<div id="cusdis_thread"
  data-host="{{@config.custom.commentCusdisDataHost}}"
  data-app-id="{{@config.custom.commentCusdisDataAppID}}"
  data-page-id="{{id}}"
  data-page-url="{{url}}"
  data-page-title="{{title}}"
></div>

<script async defer src="{{@config.custom.commentCusdisDataHost}}/js/cusdis.es.js"></script>
```

The `{{@config.custom.commentCusdisDataHost}}` and `{{@config.custom.commentCusdisDataAppID}}` will fetch the data host and app ID from whatever you type in the Theme Settings text boxes.


### Configure the Cusdis widget from your Theme Settings
Open Publii and head to your Theme's Custom Settings. You should see the new section you just created in the `config.json` file. Enter your app host and data ID information, save your settings, and preview your site.

![image](https://user-images.githubusercontent.com/55474996/143319837-5f335a25-50df-4002-9772-e044eb57081f.png)

Head to a post that has comments enabled and use your browser's Inspect Element tools to make sure everything works.
