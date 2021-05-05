# Webhook

In addition to get new comment notification from Email, we also provide Webhook. 

## Enable

To enable webhook for project, in `Project` -> `Settings`, save your webhook url and turn on the switch button.

![](../images/enable_webhook.png ':size=500')

## Reference

### New comment

When new comment comes in, Cusdis will make a `POST` request to your webhook, with below data:

```js
{
  "type": "new_comment",
  "data": {
    "by_nickname": "xxx",
    "by_email": "xxx",
    "content": "xxx",
    "page_id": "xxx",
    "page_title": "xxx", // page title, maybe NULL
    "project_title": "haha", // project title
    "approve_link": "" // use this link to approve this comment without login
  }
}
```

## Official Telegram bot

We also provide an official Telegram bot to send notification to you, with the power of Webhook: 

1. Open and start bot https://t.me/CusdisBot
2. send `/gethook` command
3. Copy the URL result and paste in Cusdis project's webhook settings
